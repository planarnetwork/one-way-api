import { Stop } from "raptor-journey-planner";
import autobind from "autobind-decorator";
import { GroupStop } from "../stop/GroupRepository";

/**
 * Return the groups that are available for use
 */
@autobind
export class GroupsController {

  constructor(
    private readonly groups: GroupStop[]
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
