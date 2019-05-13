
import * as chai from "chai";
import { GroupsController } from "./GroupsController";

describe("GroupsController", () => {

  it("returns stops", () => {
    const stops = {
      "A": {
        "id": "A",
        "code": "ACode",
        "name": "AName",
        "description": "ADescription",
        "latitude": 1.0,
        "longitude": 1.0,
        "timezone": "Europe/London",
        "members": []
      },
      "B": {
        "id": "B",
        "code": "BCode",
        "name": "BName",
        "description": "BDescription",
        "latitude": 1.0,
        "longitude": 1.0,
        "timezone": "Europe/London",
        "members": []
      },
      "C": {
        "id": "C",
        "code": "CCode",
        "name": "CName",
        "description": "CDescription",
        "latitude": 1.0,
        "longitude": 1.0,
        "timezone": "Europe/London",
        "members": []
      },
    };
    const controller = new GroupsController(Object.values(stops));
    const actual = controller.getGroups();
    const expected = {
      "data": Object.values(stops)
    };

    chai.expect(actual).to.deep.equal(expected);
  });

});
