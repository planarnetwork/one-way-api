import * as Koa from "koa";
import * as fs from "fs";
import pino = require("pino");
import * as groups from "../data/groups.json";
import * as blacklist from "../data/stop-blacklist.json";
import { Logger } from "pino";
import { KoaService, Routes } from "./api/KoaService";
import { JourneyPlanController } from "./api/JourneyPlanController";
import {
  GroupStationDepartAfterQuery,
  JourneyFactory,
  loadGTFS,
  MultipleCriteriaFilter,
  RaptorAlgorithmFactory
} from "raptor-journey-planner";
import { HealthcheckController } from "./api/HealthcheckController";
import { StopsController } from "./api/StopsController";

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

    this.getLogger().info("Pre-processing");
    const raptor = RaptorAlgorithmFactory.create(
      trips,
      transfers,
      interchange,
      calendars
    );

    this.getLogger().info("Trips: " + trips.length);
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    this.getLogger().info(`Memory usage: ${Math.round(used * 100) / 100} MB`);

    const query = new GroupStationDepartAfterQuery(raptor, new JourneyFactory(), 3, [new MultipleCriteriaFilter()]);
    const journeyPlanController = new JourneyPlanController(query);
    const healthcheckController = new HealthcheckController();
    const stopsController = new StopsController(
      Object.values(stops),
      groups,
      blacklist
    );

    return {
      "/jp": journeyPlanController.plan,
      "/health": healthcheckController.healthcheck,
      "/stops": stopsController.getStops
    };
  }

}
