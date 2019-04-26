import { Stop, StopID } from "raptor-journey-planner";
import autobind from "autobind-decorator";

/**
 * Return the stops that are available for use
 */
@autobind
export class StopsController {

  constructor(
    private readonly stops: Stop[],
    private readonly blacklist: Record<StopID, boolean>
  ) {}

  /**
   * Return all the stops
   */
  public getStops(): StopsResponse {
    return {
      "data": this.stops.filter(stop => !this.blacklist[stop.id])
    };
  }

}

export interface StopsResponse {
  "data": Stop[]
}
