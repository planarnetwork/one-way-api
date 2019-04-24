import { Stop, StopID } from "raptor-journey-planner";
import autobind from "autobind-decorator";

/**
 * Return the stops that are available for use
 */
@autobind
export class StopsController {

  constructor(
    private readonly stops: Stop[],
    private readonly groups: StopGroup[],
    private readonly blacklist: Record<StopID, boolean>
  ) {}

  /**
   * Return all the stops
   */
  public getStops(): StopsResponse {
    const groups = this.groups.map(group => ({
      ...group,
      code: "",
      description: "",
      timezone: "",
    }));

    const stops = this.stops
      .concat(groups)
      .filter(stop => !this.blacklist[stop.id]);

    return {
      "data": stops
    };
  }

}

export interface StopsResponse {
  "data": Stop[]
}

export interface StopGroup {
  id: string,
  name: string,
  latitude: number,
  longitude: number
}
