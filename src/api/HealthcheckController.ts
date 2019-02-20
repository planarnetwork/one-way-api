import autobind from "autobind-decorator";

@autobind
export class HealthcheckController {

  public healthcheck(): HealthcheckResponse {
    return {
      "status": "UP"
    };
  }

}

interface HealthcheckResponse {
  "status": "UP" | "DOWN"
}

