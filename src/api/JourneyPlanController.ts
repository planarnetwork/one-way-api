import autobind from "autobind-decorator";
import { Journey, GroupStationDepartAfterQuery, StopID } from "raptor-journey-planner";
import { RequestParams } from "./KoaService";
import * as groupData from "../../data/groups.json";

/**
 * Handles journey planning requests.
 */
@autobind
export class JourneyPlanController {

  private readonly groupIndex = groupData.reduce((index, group) => {
    index[group.id] = group.members;

    return index;
  }, {});

  constructor(
    private readonly raptor: GroupStationDepartAfterQuery
  ) {}

  public plan(request: RequestParams): JourneyPlanResponse {
    const origin = request.origin;
    const destination = request.destination;
    const date = new Date(request.date);
    const time = this.getTime(request.time);
    const origins = this.getStops(origin);
    const destinations = this.getStops(destination);
    const results = this.raptor.plan(origins, destinations, date, time);

    return {
      "data": {
        "journeys": results
      }
    };
  }

  private getTime(time: string): number {
    const hours = time.substr(0, 2);
    const minutes = time.substr(2);

    return Number(hours) * 3600 + Number(minutes) * 60;
  }

  private getStops(stop: StopID): StopID[] {
    return this.groupIndex[stop] || [stop];
  }

}

export interface JourneyPlanResponse {
  "data": {
    "journeys": Journey[]
  }
}
