import * as Koa from "koa";
import * as fs from "fs";
import pino = require("pino");
import { Logger } from "pino";
import { KoaService, Routes } from "./api/KoaService";
import { JourneyPlanController } from "./api/JourneyPlanController";
import {
  GroupStationDepartAfterQuery,
  JourneyFactory,
  loadGTFS,
  MultipleCriteriaFilter,
  RaptorAlgorithmFactory, StopIndex
} from "raptor-journey-planner";
import { HealthcheckController } from "./api/HealthcheckController";
import { StopsController } from "./api/StopsController";
import { GroupsController } from "./api/GroupsController";
import { GroupRepository, GroupStop } from "./stop/GroupRepository";
import * as cheapRuler from "cheap-ruler";

/**
 * Dependency container
 */
export class Container {

  public async getKoaService(): Promise<KoaService> {
    return new KoaService(
      await this.getRequestMap(),
      new Koa(),
      Number(process.env.PORT) || 8080,
      this.getLogger()
    );
  }

  private getLogger() {
    // return pino({ prettyPrint: { translateTime: true } });
    return {
      info: (message: any) => console.log("[" + new Date().toISOString() + "] " + message)
    };
  }

  private async getRequestMap(): Promise<Routes> {
    const gtfsPath = process.env.GTFS || "data/output.zip";

    this.getLogger().info("Loading GTFS: " + gtfsPath);
    const stream = fs.createReadStream(<string> gtfsPath);
    const [trips, transfers, interchange, calendars, stops] = await loadGTFS(stream);
    const filteredTrips = trips.filter(t => t.stopTimes && t.stopTimes.length > 0);
    const groupsPromise = this.getGroups(stops);
    this.getLogger().info("Trips: " + filteredTrips.length);

    this.getLogger().info("Pre-processing");
    const raptor = RaptorAlgorithmFactory.create(filteredTrips, transfers, interchange, calendars );

    this.getLogger().info("Loading groups");
    const groups = await groupsPromise;
    this.getLogger().info("Groups: " + groups.length);

    const query = new GroupStationDepartAfterQuery(raptor, new JourneyFactory(), 2, [new MultipleCriteriaFilter()]);
    const journeyPlanController = new JourneyPlanController(query, groups);
    const healthcheckController = new HealthcheckController();
    const groupsController = new GroupsController(groups);
    const stopsController = new StopsController(Object.values(stops));

    return {
      "/jp": journeyPlanController.plan,
      "/health": healthcheckController.healthcheck,
      "/groups": groupsController.getGroups,
      "/stops": stopsController.getStops
    };
  }

  private getGroups(stops: StopIndex): Promise<GroupStop[]> {
    const repository = new GroupRepository(cheapRuler(46));

    return repository.getGroups("data/locations.csv.zip", Object.values(stops));
  }

}
