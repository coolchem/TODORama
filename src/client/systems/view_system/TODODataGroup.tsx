

import {DataGroup} from "ramajs/dist/DataGroup";
import {View, rama, event} from "ramajs/dist/index";
import {DOMElement} from "ramajs/dist/core/DOMElement";
import {REventInit} from "ramajs/dist/core/event";


export class TODOItemRenderer extends View
{

    private _data:any;
    todoLabel:DOMElement;
    completedCheckBox:DOMElement;

    setData(data:any):void
    {
        this._data = data;
        this.updateItemRenderer()
    }


    attached():void {
        super.attached();
        this.updateItemRenderer();

        this.completedCheckBox.addEventListener("change",(event:Event)=>{
            this._data.completed =  (this.completedCheckBox[0] as HTMLInputElement).checked;
            this.updateItemRenderer();
            this.dispatchEvent(new CustomEvent("todoItemUpdated", new REventInit<any>(true,false,this._data)))
        })

    }

    protected updateItemRenderer():void
    {
        if(this._data)
        {
            if(this.todoLabel)
                (this.todoLabel[0] as HTMLLabelElement).textContent = this._data.label;

            if(this.completedCheckBox)
            {
                (this.completedCheckBox[0] as HTMLInputElement).checked = this._data.completed;
            }

            if(this._data.completed)
            {
                this.setCurrentState("completed");
            }
            else
            {
                this.setCurrentState("");
            }
        }
    }
    
    private deleteItem():void
    {
        this._data.deleted = true;
        this.dispatchEvent(new CustomEvent("todoItemDeleted", new REventInit<any>(true,false,this._data)))
    }

    render():any {
        return <li class__completed="completed">

            <states>
                <state name="completed"/>
            </states>
            <div class="view">
                <input id="completedCheckBox" class="toggle" type="checkbox"/>
                <label id="todoLabel"/>
                <button class="destroy" onclick={(event:MouseEvent)=>{this.deleteItem()}}/>
            </div>
            <input class="edit" value="Create a TodoMVC template"/>
        </li>
    }
}

@event("todoItemUpdated")
@event("todoItemDeleted")
export class TODODataGroup extends DataGroup
{

    constructor() {
        super("ul");
    }
}
