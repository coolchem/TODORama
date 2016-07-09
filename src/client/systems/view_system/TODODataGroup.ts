

import {DataGroup} from "ramajs/dist/DataGroup";
import {event} from "ramajs/dist/index";

@event("todoItemEdited")
@event("todoItemDeleted")
@event("todoItemToggleCompleted")
export class TODODataGroup extends DataGroup
{

    constructor() {
        super("ul");
    }
}
