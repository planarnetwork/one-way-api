import { loadGTFS, Stop, StopID } from "raptor-journey-planner";
import * as fs from "fs";
import { promisify } from "util";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

async function run(): Promise<void> {
  const [gtfs, be, de, es, fr, gb] = await Promise.all([
    loadGTFS(fs.createReadStream("./data/output.zip")),
    readFile(__dirname + "/../data/be.json", "utf8"),
    readFile(__dirname + "/../data/de.json", "utf8"),
    readFile(__dirname + "/../data/es.json", "utf8"),
    readFile(__dirname + "/../data/fr.json", "utf8"),
    readFile(__dirname + "/../data/gb.json", "utf8")
  ]);

  const stops = Object.values(gtfs[4]);
  const groups = JSON.parse(be)
    .concat(JSON.parse(de))
    .concat(JSON.parse(fr))
    .concat(JSON.parse(es))
    .filter(s => parseInt(s.population_proper, 10) > 0)
    .map(s => ({
      id: s.city.toLocaleLowerCase() + "_" + s.population_proper,
      name: s.city,
      description: "",
      latitude: Number(s.lat),
      longitude: Number(s.lng),
      members: getMembers(Number(s.lat), Number(s.lng), stops)
    }))
    .filter(s => s.members.length > 0)
    .concat(JSON.parse(gb));

  await writeFile(__dirname + "/../data/groups.json", JSON.stringify(groups, null, 2));
}

function getMembers(latA: number, lngA: number, stops: Stop[]): StopID[] {
  return stops
    .filter(s => Math.abs(s.latitude - latA) + Math.abs(s.longitude - lngA) < 0.07)
    .map(s => s.id);
}

run().catch(e => console.log(e));
