
import * as chai from "chai";
import { StopsController } from "../../../src/api/StopsController";

describe("StopsController", () => {

  it("returns stops", () => {
    const stops = {
      "A": {
        "id": "A",
        "code": "ACode",
        "name": "AName",
        "description": "ADescription",
        "latitude": 1.0,
        "longitude": 1.0,
        "timezone": "Europe/London"
      },
      "B": {
        "id": "B",
        "code": "BCode",
        "name": "BName",
        "description": "BDescription",
        "latitude": 1.0,
        "longitude": 1.0,
        "timezone": "Europe/London"
      },
      "C": {
        "id": "C",
        "code": "CCode",
        "name": "CName",
        "description": "CDescription",
        "latitude": 1.0,
        "longitude": 1.0,
        "timezone": "Europe/London"
      },
    };
    const controller = new StopsController(Object.values(stops), [], { });
    const actual = controller.getStops();
    const expected = {
      "data": Object.values(stops)
    };

    chai.expect(actual).to.deep.equal(expected);
  });

  it("filters blacklisted stops", () => {
    const stops = {
      "A": {
        "id": "A",
        "code": "ACode",
        "name": "AName",
        "description": "ADescription",
        "latitude": 1.0,
        "longitude": 1.0,
        "timezone": "Europe/London"
      },
      "B": {
        "id": "B",
        "code": "BCode",
        "name": "BName",
        "description": "BDescription",
        "latitude": 1.0,
        "longitude": 1.0,
        "timezone": "Europe/London"
      },
      "C": {
        "id": "C",
        "code": "CCode",
        "name": "CName",
        "description": "CDescription",
        "latitude": 1.0,
        "longitude": 1.0,
        "timezone": "Europe/London"
      },
    };
    const controller = new StopsController(Object.values(stops), [], { "B": true });
    const actual = controller.getStops();
    const expected = {
      "data": [stops.A, stops.C]
    };

    chai.expect(actual).to.deep.equal(expected);
  });

});
