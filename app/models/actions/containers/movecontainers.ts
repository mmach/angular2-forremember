import { MoveContainer } from "../../MoveContainer";
import { BaseAction } from "../baseAction";
export class MoveContainerAction extends BaseAction {
    public Action: string = "MoveContainerAction";
    constructor(public model: MoveContainer) {
        super();
    }
}