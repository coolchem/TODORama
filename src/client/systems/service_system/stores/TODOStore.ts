

import {ModelEventDispatcher} from "ramajs/dist/core/ModelEventDispatcher";
import {TODOItem} from "../models/TODOItem";
import {EventConstants, ActionConstants} from "../constants";
import {ArrayCollection} from "ramajs/dist/index";

var dispatcher:ModelEventDispatcher = require("../dispatcher");

export class TODOStore extends ModelEventDispatcher
{
    todos:ArrayCollection<TODOItem>;

    private _filter:String;

    constructor() {

        super();
        
        dispatcher.addEventListener(ActionConstants.TODOS_LOADED,this.handleTODOsLoaded);
        dispatcher.addEventListener(ActionConstants.TODOS_SAVED,this.handleTODOsSaved);
        dispatcher.addEventListener(ActionConstants.TODOS_FILTER_CHANGED,this.handleTODOsFilterChanged);
        
        this.todos = new ArrayCollection<TODOItem>();
        
        this.todos.filterFunction = (item:any)=>{
            return this.todoFilter(item);
        };
        
    }
    
    private handleTODOsLoaded = (todos:any[])=>{
        
        todos.forEach((todo:any)=>{
            
            this.todos.addItem(new TODOItem(todo.label,todo.completed,todo.deleted));
        });
        
        this.todos.refresh();
        this.dispatchEvent(EventConstants.TODOS_LOADED,this.todos);
        
    };

    private handleTODOsSaved = (todos:any[])=>{
        
        this.todos.refresh();
        this.dispatchEvent(EventConstants.TODOS_CHANGED,this.todos);

    };

    private handleTODOsFilterChanged = (filter:string)=>{
        
        if(filter === this._filter)
            return;
        
        this._filter = filter;
        this.todos.refresh();
        
        this.dispatchEvent(EventConstants.TODOS_CHANGED,this.todos);
    };

    private todoFilter(item:any):boolean
    {
        if(item.deleted)
            return false;


        if(this._filter == "active")
        {
            return !item.completed;
        }

        if(this._filter == "completed")
        {
            return item.completed;
        }

        return true;

    }
}