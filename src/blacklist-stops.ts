import { loadGTFS } from "raptor-journey-planner";
import * as fs from "fs";
import { promisify } from "util";

const writeFile = promisify(fs.writeFile);

async function run(): Promise<void> {
  const [trips, transfers, interchange, calendars, stops] = await loadGTFS(fs.createReadStream("./data/output.zip"));
  const usefulStops = {};

  for (const trip of trips) {
    for (const stopTime of trip.stopTimes) {
      usefulStops[stopTime.stop] = true;
    }
  }

  const pointlessStops = Object
    .keys(stops)
    .filter(s => !usefulStops[s])
    .reduce((index, stop) => {
      index[stop] = true;

      return index;
    }, {});

  await writeFile(__dirname + "/../data/stop-blacklist.json", JSON.stringify(pointlessStops));
}

run().catch(e => console.log(e));
