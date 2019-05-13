
import * as chai from "chai";
import { StopFilter } from "./StopFilter";

describe("StopFilter", () => {

  it("filters unused stops", () => {
    const trips = [{
      tripId: "1",
      serviceId: "1",
      stopTimes: [
        { stop: "A", departureTime: 1000, arrivalTime: 1000, dropOff: true, pickUp: true },
        { stop: "B", departureTime: 1100, arrivalTime: 1100, dropOff: true, pickUp: true }
      ]
    }];

    const stopA = {
      "id": "A",
      "code": "ACode",
      "name": "AName",
      "description": "ADescription",
      "latitude": 1.0,
      "longitude": 1.0,
      "timezone": "Europe/London"
    };

    const stopB = {
      "id": "B",
      "code": "BCode",
      "name": "BName",
      "description": "BDescription",
      "latitude": 1.0,
      "longitude": 1.0,
      "timezone": "Europe/London"
    };

    const stopC = {
      "id": "C",
      "code": "CCode",
      "name": "CName",
      "description": "CDescription",
      "latitude": 1.0,
      "longitude": 1.0,
      "timezone": "Europe/London"
    };

    const stops = [stopA, stopB, stopC];

    const filter = new StopFilter(trips);
    const actual = filter.getValidStops(stops);
    const expected = [stopA, stopB];

    chai.expect(actual).to.deep.equal(expected);
  });

});
