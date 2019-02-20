import { KoaService } from "./api/KoaService";

import * as Koa from "koa";
import * as pino from "pino";
import { Logger } from "pino";
import { JourneyPlanController } from "./api/JourneyPlanController";
import {
  Journey,
  JourneyFactory,
  loadGTFS,
  RaptorDepartAfterQuery,
  RaptorQueryFactory
} from "raptor-journey-planner";
import * as fs from "fs";

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

  private async getRequestMap() {
    const journeyPlanController = await this.getJourneyPlanController();

    return {
      "/jp": journeyPlanController.plan
    };
  }

  private async getJourneyPlanController(): Promise<JourneyPlanController> {
    const journeyPlanner = await this.getJourneyPlanner();

    return new JourneyPlanController(journeyPlanner);
  }

  private async getJourneyPlanner(): Promise<RaptorDepartAfterQuery<Journey>> {
    this.getLogger().info("Loading GTFS: " + process.argv[2]);
    const stream = fs.createReadStream(process.argv[2]);
    const [trips, transfers, interchange, calendars] = await loadGTFS(stream);

    this.getLogger().info("Pre-processing");
    const raptor = RaptorQueryFactory.createDepartAfterQuery(
      trips,
      transfers,
      interchange,
      calendars,
      new JourneyFactory()
    );

    this.getLogger().info("Trips: " + trips.length);
    return raptor;
  }
}
