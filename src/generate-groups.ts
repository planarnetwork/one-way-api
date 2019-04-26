import { loadGTFS, Stop, StopID } from "raptor-journey-planner";
import * as fs from "fs";
import { promisify } from "util";
import * as parse from "csv-parse";
import { Parser } from "csv-parse";
import * as unzipper from "unzipper";
import * as cheapRuler from "cheap-ruler";
import * as blacklist from "../data/stop-blacklist.json";

const writeFile = promisify(fs.writeFile);
const ruler = cheapRuler(46);

async function run(): Promise<void> {
  const [gtfs, cities] = await Promise.all([
    loadGTFS(fs.createReadStream("./data/output.zip")),
    getCities(
      fs.createReadStream("./data/stops.csv.zip")
        .pipe(unzipper.ParseOne())
        .pipe(parse())
    )
  ]);

  const stops = Object.values(gtfs[4]).filter(s => !blacklist[s.id]);
  const groups = cities
    .map(s => ({
      population: undefined,
      members: getMembers(s.latitude, s.longitude, stops, s.population),
      ...s,
    }))
    .filter(s => s.members.length > 0);

  await writeFile(__dirname + "/../data/groups.json", JSON.stringify(groups, null, 2));
}

function getCities(input: Parser): Promise<StopWithPopulation[]> {
  return new Promise((resolve, reject) => {
    const cities: StopWithPopulation[] = [];
    const acceptedCountries = ["GB", "DE", "ES", "FR", "BE", "NL", "SE", "CH", "CZ", "IT", "AT", "PL", "LT", "DK"];

    input.on("end", () => resolve(cities));
    input.on("error", reject);
    input.on("data", city => {
      const [id, asciiName, utf8name, lat, lng, country, population, timezone] = city;

      if (acceptedCountries.includes(country)) {
        cities.push({
          id: id + "_" + asciiName.toLowerCase().replace(" ", "_"),
          name: asciiName,
          description: utf8name,
          code: id,
          latitude: Number(lat),
          longitude: Number(lng),
          timezone: timezone,
          population: +population
        });
      }
    });
  });
}

interface StopWithPopulation extends Stop { population: number }

function getMembers(latA: number, lngA: number, stops: Stop[], population: number): StopID[] {
  let maxDistance = 5;

  if (population < 1000000) maxDistance = 4;
  if (population < 100000) maxDistance = 3;
  if (population < 10000) maxDistance = 2;
  if (population < 1000) maxDistance = 1;

  return stops
    .filter(s => ruler.distance([latA, lngA], [s.latitude, s.longitude]) < maxDistance)
    .map(s => s.id);
}

run().catch(e => console.log(e));
