import { Stop, StopID } from "raptor-journey-planner";
import { CheapRuler } from "cheap-ruler";
import * as fs from "fs";
import * as parse from "csv-parse";
import * as unzipper from "unzipper";

/**
 * Loads city locations from the locations CSV file and puts nearby stops into a members array.
 */
export class GroupRepository {

  constructor(
    private readonly ruler: CheapRuler,
    private readonly acceptedCountries: CountryCode[] = [
      "GB", "DE", "ES", "FR", "BE", "NL", "SE", "CH", "CZ", "IT", "AT", "PL", "LT", "DK", "LX"
    ]
  ) {}

  /**
   * Open the CSV file, load the locations then add the nearby stops.
   */
  public async getGroups(filename: string, stops: Stop[]): Promise<GroupStop[]> {
    return new Promise((resolve, reject) => {
      const cities: GroupStop[] = [];
      const input = fs.createReadStream(filename)
        .pipe(unzipper.ParseOne())
        .pipe(parse());

      input.on("end", () => resolve(cities));
      input.on("error", reject);
      input.on("data", city => {
        const [id, asciiName, utf8name, lat, lng, country, population, timezone] = city;

        if (this.acceptedCountries.includes(country)) {
          const latitude = Number(lat);
          const longitude = Number(lng);
          const members = this.getMembers(latitude, longitude, stops, +population);

          if (members.length > 0) {
            cities.push({
              id: id + "_" + asciiName.toLowerCase().replace(" ", "_"),
              name: asciiName,
              description: utf8name,
              code: id,
              latitude: latitude,
              longitude: longitude,
              timezone: timezone,
              members: members
            });
          }
        }
      });
    });
  }

  private getMembers(latA: number, lngA: number, stops: Stop[], population: number): StopID[] {
    let maxDistance = 5;

    if (population < 1000000) maxDistance = 4;
    if (population < 100000) maxDistance = 3;
    if (population < 10000) maxDistance = 2;
    if (population < 1000) maxDistance = 1;

    return stops
      .filter(s => this.ruler.distance([latA, lngA], [s.latitude, s.longitude]) < maxDistance)
      .map(s => s.id);
  }
}

export interface GroupStop extends Stop {
  members: StopID[]
}

/**
 * Two character country code e.g. GB
 */
export type CountryCode = string;
