

import {DataGroup} from "ramajs/dist/DataGroup";
import {View,rama} from "ramajs/dist/index";
import {DOMElement} from "ramajs/dist/core/DOMElement";


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
            this._data.completed =  (this.completedCheckBox.getElementRef() as HTMLInputElement).checked;
            this.updateItemRenderer();
        })

    }

    protected updateItemRenderer():void
    {
        if(this._data)
        {
            if(this.todoLabel)
                (this.todoLabel.getElementRef() as HTMLLabelElement).textContent = this._data.label;

            if(this.completedCheckBox)
            {
                (this.completedCheckBox.getElementRef() as HTMLInputElement).checked = this._data.completed;
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

    render():any {
        return <li class__completed="completed">

            <states>
                <state name="completed"/>
            </states>
            <div class="view">
                <input id="completedCheckBox" class="toggle" type="checkbox"/>
                <label id="todoLabel"/>
                <button class="destroy"/>
            </div>
            <input class="edit" value="Create a TodoMVC template"/>
        </li>
    }
}

export class TODODataGroup extends DataGroup
{

    constructor() {
        super("ul");
    }
}
