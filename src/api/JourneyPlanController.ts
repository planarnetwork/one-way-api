import autobind from "autobind-decorator";
import { Journey, RaptorDepartAfterQuery } from "raptor-journey-planner";
import { RequestParams } from "./KoaService";

/**
 * Handles journey planning requests.
 */
@autobind
export class JourneyPlanController {

  constructor(
    private readonly raptor: RaptorDepartAfterQuery<Journey>
  ) {}

  public plan(request: RequestParams): JourneyPlanResponse {
    const origin = request.origin;
    const destination = request.destination;
    const date = new Date(request.date);
    const time = this.getTime(request.time);

    return {
      "data": {
        "journeys": this.raptor.plan(origin, destination, date, time)
      }
    };
  }

  private getTime(time: string): number {
    const hours = time.substr(0, 2);
    const minutes = time.substr(2);

    return Number(hours) * 3600 + Number(minutes) * 60;
  }

}

export interface JourneyPlanResponse {
  "data": {
    "journeys": Journey[]
  }
}
