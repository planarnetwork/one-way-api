import * as Koa from "koa";
import * as fs from "fs";
import * as pino from "pino";
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

  private getLogger(): Logger {
    return pino({ prettyPrint: { translateTime: true } });
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
    const stopsController = new StopsController(stops);

    return {
      "/jp": journeyPlanController.plan,
      "/health": healthcheckController.healthcheck,
      "/stops": stopsController.getStops
    };
  }

}
