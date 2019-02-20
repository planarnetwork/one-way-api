import { Stop, StopIndex } from "raptor-journey-planner";
import autobind from "autobind-decorator";

/**
 * Return the stops that are available for use
 */
@autobind
export class StopsController {

  constructor(
    private readonly stops: StopIndex
  ) {}

  /**
   * Return all the stops
   */
  public getStops(): StopsResponse {
    return {
      "data": Object.values(this.stops)
    };
  }

}

export interface StopsResponse {
  "data": Stop[]
}
