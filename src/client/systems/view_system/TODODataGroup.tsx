

import {DataGroup} from "ramajs/dist/DataGroup";
import {View, rama, event} from "ramajs/dist/index";
import {DOMElement} from "ramajs/dist/core/DOMElement";
import {REventInit} from "ramajs/dist/core/event";

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

export class TODOItemRenderer extends View
{

    private _data:any;
    todoLabel:DOMElement;
    completedCheckBox:DOMElement;
    editTODOInput:DOMElement;

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

        window.document.addEventListener("click", this.handleDocumentMouseClick)

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

    private handleDocumentMouseClick = (event:MouseEvent)=>{

        if(!(event.target == this[0]) && !(event.target == this.editTODOInput[0]) && this.getCurrentState() == "editing")
        {

            this.todoLabelUpdated();
        }
    };

    private handleDoubleClick = (event:Event)=>{

        if(!this._data.completed)
        {
            this.setCurrentState("editing");
            this.editTODOInput[0].value = this._data.label;
            (this.editTODOInput[0] as HTMLElement).focus();
        }
    };

    private handleKyePress = (event:KeyboardEvent)=>{

        if(this.getCurrentState() == "editing")
        {
            var keyCode:number = event.keyCode || event.which;

            if (keyCode == ENTER_KEY){
                this.todoLabelUpdated();
                return;
            }

            if(keyCode == ESCAPE_KEY)
            {
                this.setCurrentState("");
            }
        }

    };

    private todoLabelUpdated():void
    {
        this._data.label = this.editTODOInput[0].value;
        this.dispatchEvent(new CustomEvent("todoItemUpdated", new REventInit<any>(true,false,this._data)));
        this.setCurrentState("");
    }

    render():any {
        return <li class__completed="completed" ondblclick={this.handleDoubleClick}>

            <states>
                <state name="completed"/>
                <state name="editing"/>
            </states>
            <div class="view" style__editing="display:none">
                <input id="completedCheckBox" class="toggle" type="checkbox"/>
                <label id="todoLabel"/>
                <button class="destroy" onclick={(event:MouseEvent)=>{this.deleteItem()}}/>
            </div>
            <input id="editTODOInput" onkeydown={this.handleKyePress} style__editing="display:block" class="edit"/>
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
