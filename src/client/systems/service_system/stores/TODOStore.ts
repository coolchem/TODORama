

import {ModelEventDispatcher} from "ramajs/dist/core/ModelEventDispatcher";
import {TODOItem} from "../models/TODOItem";
import {EventConstants, ActionConstants} from "../constants";
import {ArrayCollection} from "ramajs/dist/index";

var dispatcher:ModelEventDispatcher = require("../dispatcher");

export class TODOStore extends ModelEventDispatcher
{
    todos:ArrayCollection<TODOItem>;

    itemsLeftToComplete:number;

    

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

        this.itemsLeftToComplete = 0;
        
    }
    
    hasTODOS():boolean
    {
        for (var i=0; i<this.todos.getSource().length; i++)
        {
            var todo:TODOItem = this.todos.getSource()[i];
            if(!todo.deleted)
                return true;
        }
        
        return false;
    }
    
    hasCompletedItems():boolean
    {
        
        for (var i=0; i<this.todos.length; i++)
        {
            var todo:TODOItem = this.todos.getItemAt(i);
            if(todo.completed)
                return true;
        }

        return false;
    }
    
    private handleTODOsLoaded = (todos:any[])=>{
        
        todos.forEach((todo:any)=>{
            
            this.todos.addItem(new TODOItem(todo.label,todo.completed,todo.deleted));
        });
        this.refreshTODOS();
        this.dispatchEvent(EventConstants.TODOS_LOADED,this.todos);
    };

    private handleTODOsSaved = (todos:any[])=>{

        this.refreshTODOS();
        this.dispatchEvent(EventConstants.TODOS_CHANGED,this.todos);

    };

    private handleTODOsFilterChanged = (filter:string)=>{
        
        if(filter === this._filter)
            return;
        
        this._filter = filter;

        this.refreshTODOS();
        this.dispatchEvent(EventConstants.TODOS_CHANGED,this.todos);
    };

    private refreshTODOS():void
    {
        this.itemsLeftToComplete = 0;
        if(this.todos)
            this.todos.refresh();
    }

    private todoFilter(item:any):boolean
    {
        if(item.deleted)
            return false;

        if(!item.completed)
            this.itemsLeftToComplete++;

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