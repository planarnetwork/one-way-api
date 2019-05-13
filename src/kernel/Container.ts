import * as Koa from "koa";
import * as fs from "fs";
import pino = require("pino");
import { Logger } from "pino";
import { KoaService, Routes } from "./KoaService";
import { JourneyPlanController } from "../planning/api/JourneyPlanController";
import {
  GroupStationDepartAfterQuery,
  JourneyFactory,
  loadGTFS,
  MultipleCriteriaFilter,
  RaptorAlgorithmFactory, Stop, StopIndex, Trip
} from "raptor-journey-planner";
import { HealthcheckController } from "./HealthcheckController";
import { StopsController } from "../stop/api/StopsController";
import { GroupsController } from "../group/api/GroupsController";
import { GroupRepository, GroupStop } from "../group/repository/GroupRepository";
import * as cheapRuler from "cheap-ruler";
import { Router } from "./Router";
import { StopFilter } from "../stop/filter/StopFilter";

/**
 * Dependency container
 */
export class Container {

  public async getKoaService(): Promise<KoaService> {
    const router = await this.getRequestMap();

    return new KoaService(
      router.getRoutes(),
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

  private async getRequestMap(): Promise<Router> {
    const gtfsPath = process.env.GTFS || "data/output.zip";

    this.getLogger().info("Loading GTFS: " + gtfsPath);
    const stream = fs.createReadStream(<string> gtfsPath);
    const [trips, transfers, interchange, calendars, stops] = await loadGTFS(stream);
    const filteredTrips = trips.filter(t => t.stopTimes && t.stopTimes.length > 0);
    const filteredStops = this.getStopFilter(filteredTrips).getValidStops(Object.values(stops));
    const groupsPromise = this.getGroups(filteredStops);
    this.getLogger().info("Trips: " + filteredTrips.length);

    this.getLogger().info("Pre-processing");
    const raptor = RaptorAlgorithmFactory.create(filteredTrips, transfers, interchange, calendars);

    this.getLogger().info("Loading groups");
    const groups = await groupsPromise;
    this.getLogger().info("Groups: " + groups.length);

    const query = new GroupStationDepartAfterQuery(raptor, new JourneyFactory(), 2, [new MultipleCriteriaFilter()]);
    const journeyPlanController = new JourneyPlanController(query, groups);
    const healthcheckController = new HealthcheckController();
    const groupsController = new GroupsController(groups);
    const stopsController = new StopsController(filteredStops);

    return new Router(
      healthcheckController,
      stopsController,
      groupsController,
      journeyPlanController
    );
  }

  private getGroups(stops: Stop[]): Promise<GroupStop[]> {
    const repository = new GroupRepository(cheapRuler(46));

    return repository.getGroups("data/locations.csv.zip", stops);
  }

  private getStopFilter(trips: Trip[]): StopFilter {
    return new StopFilter(trips);
  }
}
