import autobind from "autobind-decorator";
import { AnyLeg, Journey, RaptorDepartAfterQuery, Time, TimetableLeg } from "raptor-journey-planner";
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
    const results = this.raptor
      .plan(origin, destination, date, time)
      .map(j => this.getJourneyView(j));

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

  public getJourneyView(j: Journey): JourneyView {
    return {
      departureTime: getDepartureTime(j.legs),
      arrivalTime: getArrivalTime(j.legs),
      ...j
    };
  }

}

export interface JourneyPlanResponse {
  "data": {
    "journeys": JourneyView[]
  }
}

export interface JourneyView extends Journey {
  departureTime: Time,
  arrivalTime: Time
}

function isTimetableLeg(connection: AnyLeg): connection is TimetableLeg {
  return (connection as TimetableLeg).stopTimes !== undefined;
}

function getDepartureTime(legs: AnyLeg[]): Time {
  let transferDuration = 0;

  for (const leg of legs) {
    if (!isTimetableLeg(leg)) {
      transferDuration += leg.duration;
    }
    else {
      return leg.stopTimes[0].departureTime - transferDuration;
    }
  }

  return 0;
}

function getArrivalTime(legs: AnyLeg[]): Time {
  let transferDuration = 0;

  for (let i = legs.length - 1; i >= 0; i--) {
    const leg = legs[i];

    if (!isTimetableLeg(leg)) {
      transferDuration += leg.duration;
    }
    else {
      return leg.stopTimes[leg.stopTimes.length - 1].arrivalTime + transferDuration;
    }
  }

  return 0;
}
