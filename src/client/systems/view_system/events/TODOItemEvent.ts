

import {REventInit} from "ramajs/dist/core/event";
import {TODOItem} from "../../service_system/models/TODOItem";


export class TODOItemEventInit extends REventInit<{item:TODOItem,value?:any}>
{

    static TODO_ITEM_DELETED:string = "todoItemDeleted";
    static TODO_ITEM_EDITED:string = "todoItemEdited";
    static TODO_ITEM_TOGGLE_COMPLETED:string = "todoItemToggleCompleted";
    
    constructor(detail:{item:TODOItem,value?:any}) {
        super(true, true, detail);
    }
}