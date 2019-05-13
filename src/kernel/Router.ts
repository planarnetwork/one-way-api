import { HealthcheckController } from "./HealthcheckController";
import { StopsController } from "../stop/api/StopsController";
import { GroupsController } from "../group/api/GroupsController";
import { JourneyPlanController } from "../planning/api/JourneyPlanController";
import { Routes } from "./KoaService";

/**
 * Creates a route map
 */
export class Router {

  constructor(
    private readonly healthcheckController: HealthcheckController,
    private readonly stopsController: StopsController,
    private readonly groupsController: GroupsController,
    private readonly journeyPlanController: JourneyPlanController
  ) {}

  /**
   * Return the route map
   */
  public getRoutes(): Routes {
    return {
      "/jp": this.journeyPlanController.plan,
      "/health": this.healthcheckController.healthcheck,
      "/groups": this.groupsController.getGroups,
      "/stops": this.stopsController.getStops
    };
  }

}
