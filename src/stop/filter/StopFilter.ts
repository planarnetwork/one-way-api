import { Stop, Trip } from "raptor-journey-planner";

/**
 * Filters stops to ensure they are all used in a trip
 */
export class StopFilter {

  constructor(
    private readonly trips: Trip[]
  ) {}

  /**
   * Extract the list of useful stop IDs from the trip stop times and then remove any stops not in that list.
   */
  public getValidStops(stops: Stop[]): Stop[] {
    // for (const trip of trips) {
    //   for (const stopTime of trip.stopTimes) {
    //     usefulStops[stopTime.stop] = true;
    //   }
    // }

    const usefulStops = this.trips
      .flatMap(trip => trip.stopTimes.map(times => times.stop))
      .reduce((index, stop) => {
        index[stop] = true;

        return index;
      }, {});

    return stops.filter(s => usefulStops[s.id]);
  }
}

