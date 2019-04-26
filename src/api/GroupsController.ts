import { Stop, StopID } from "raptor-journey-planner";
import autobind from "autobind-decorator";

/**
 * Return the groups that are available for use
 */
@autobind
export class GroupsController {

  constructor(
    private readonly groups: Stop[]
  ) {}

  /**
   * Return all the groups
   */
  public getGroups(): GroupsResponse {
    return {
      "data": this.groups
    };
  }

}

export interface GroupsResponse {
  "data": Stop[]
}
