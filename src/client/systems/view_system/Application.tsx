

import {View, rama,ArrayCollection} from "ramajs"
import {DOMElement} from "ramajs/dist/core/DOMElement";
import {TODOItemRenderer,TODODataGroup} from "./TODODataGroup";

export class Application extends View
{

    toggleAllCheckBox:DOMElement;
    newTODOInput:DOMElement;

    todoCollection:ArrayCollection<any>;


    constructor() {

        super();

        if(window.location.hash === "" || window.location.hash === null || window.location.hash === undefined)
        {
            window.location.hash = "#/"
        }

        var items:Array<any>;

        if (window.localStorage) {
            items = JSON.parse(window.localStorage.getItem('todos-rama')) || [];
        }

        this.todoCollection = new ArrayCollection(items);

        window.onhashchange = ()=>{
            this.handleHashChange()
        };


        this.todoCollection.filterFunction = (item:any)=>{
            return this.todoFilter(item);
        };

        this.handleHashChange();

    }

    private updateLocalStorage(){

        if (window.localStorage)
            window.localStorage.setItem('todos-rama', JSON.stringify(this.todoCollection.getSource()));

    }

    private todoFilter(item:any):boolean
    {
        var currentState = this.getCurrentState();

        if(item.deleted)
            return false;


        if(currentState == "active")
        {
            return !item.completed;
        }

        if(currentState == "completed")
        {
            return item.completed;
        }

        return true;

    }

    private handleHashChange():void
    {
        var state:string = "";
        switch(window.location.hash)
        {


            case "#/" :
            {
                state =  "all";
                break;
            }

            case "#/active" :
            {
                state =  "active";
                break;
            }

            case "#/completed" :
            {
                state =  "completed";
                break;
            }

        }

        this.setCurrentState(state);

        this.todoCollection.refresh();

    }

    attached():void {

        this.toggleAllCheckBox.addEventListener("change", (event:Event)=>{
            console.log(event)
        });

        this.newTODOInput.addEventListener("keypress",(event:KeyboardEvent)=>{

            var keyCode:number = event.keyCode || event.which;
            if (keyCode == 13){
                // Enter pressed
                var todoText = (this.newTODOInput.getElementRef() as HTMLInputElement).value;

                if(todoText)
                {
                    var newTODO:any = {label:todoText,completed:false,deleted:false};

                    this.todoCollection.addItem(newTODO);
                    (this.newTODOInput.getElementRef() as HTMLInputElement).value = "";

                    this.updateLocalStorage();
                }
            }

        });

        this.todoCollection.refresh();
    }

    render() {
        return <div>
            <states>
                <state name="all"/>
                <state name="active"/>
                <state name="completed"/>
            </states>
            <section class="todoapp">
                <header class="header">
                    <h1>todos</h1>
                    <input id="newTODOInput" class="new-todo" placeholder="What needs to be done?" autofocus/>
                </header>
                <section class="main">
                    <input id="toggleAllCheckBox" class="toggle-all" type="checkbox"/>
                    <label for="toggle-all">Mark all as complete</label>
                    <TODODataGroup class="todo-list" itemRenderer={TODOItemRenderer} dataProvider={this.todoCollection}/>
                </section>
                <footer class="footer">
                    <span class="todo-count"><strong>0</strong> item left</span>
                    <ul class="filters">
                        <li>
                            <a class__all="selected" href="#/">All</a>
                        </li>
                        <li>
                            <a  class__active="selected" href="#/active">Active</a>
                        </li>
                        <li>
                            <a  class__completed="selected" href="#/completed">Completed</a>
                        </li>
                    </ul>
                    <button class="clear-completed">Clear completed</button>
                </footer>
            </section>
            <footer class="info">
                <p>Double-click to edit a todo</p>
                <p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
                <p>Created by <a href="http://todomvc.com">you</a></p>
                <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
            </footer>

        </div>;
    }
}