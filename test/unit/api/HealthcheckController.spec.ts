
import * as chai from "chai";
import { HealthcheckController } from "../../../src/api/HealthcheckController";

describe("HealthcheckController", () => {

  it("says it's up", () => {
    const controller = new HealthcheckController();
    const actual = controller.healthcheck();
    const expected = {
      "status": "UP"
    };

    chai.expect(actual).to.deep.equal(actual);
  });

});
