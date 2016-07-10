

import {View, rama} from "ramajs"
import {DOMElement} from "ramajs/dist/core/DOMElement";
import {TODODataGroup} from "./TODODataGroup";
import {TODOItemRenderer} from "./TODOItemRenderer";

import {todoStore} from "../service_system/stores/index";
import {
    loadTODOs, applyTOODsFilter, addTODO, deleteTODO, editTODOItem,
    toggleTODOItemCompleted, toggleAllItemCompleted, clearAllCompleted
} from "../service_system/managers/todo-manager";
import {EventConstants} from "../service_system/constants";
import {TODOItem} from "../service_system/models/TODOItem";


export class Application extends View
{

    toggleAllCheckBox:DOMElement;
    newTODOInput:DOMElement;
    todoCount:DOMElement;
    clearCompletedBtn:DOMElement;
    
    constructor() {

        super();

        if(window.location.hash === "" || window.location.hash === null || window.location.hash === undefined)
        {
            window.location.hash = "#/"
        }

        window.onhashchange = ()=>{
            this.handleHashChange()
        };
        
        loadTODOs();
        
        todoStore.addEventListener(EventConstants.TODOS_LOADED,this.todosUPDATED);
        todoStore.addEventListener(EventConstants.TODOS_CHANGED,this.todosUPDATED);
    }


    initialized():void {

        this.toggleAllCheckBox.addEventListener("change", (event:Event)=>{
            console.log(event)
        });

        this.newTODOInput.addEventListener("keypress",(event:KeyboardEvent)=>{

            var keyCode:number = event.keyCode || event.which;
            if (keyCode == 13){
                // Enter pressed
                var todoText = (this.newTODOInput[0] as HTMLInputElement).value;

                if(todoText)
                {
                    addTODO(todoText);
                    (this.newTODOInput[0] as HTMLInputElement).value = "";
                }
            }

        });

        if(this.todoCount)
            this.todoCount[0].innerHTML = todoStore.itemsLeftToComplete;

    }


    private todosUPDATED = ()=>{
        if(!todoStore.hasTODOS())
        {
            this.setCurrentState("noTODOs")
        }
        this.handleHashChange();

        if(this.todoCount)
            this.todoCount[0].innerHTML = todoStore.itemsLeftToComplete;

        if(todoStore.hasCompletedItems())
            this.clearCompletedBtn[0].style.display = '';
        else
            this.clearCompletedBtn[0].style.display = 'none';

        if(this.toggleAllCheckBox)
            this.toggleAllCheckBox[0].checked = todoStore.itemsLeftToComplete == 0;
    };

    private handleHashChange():void
    {
        if(todoStore.hasTODOS())
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

            this.setCurrentState(state); //changing the state to any of the
            applyTOODsFilter(state);
        }

    }


    private todoItemDeleted = (event:CustomEvent)=>{

        var eventDetail:{item:TODOItem, value?:any} = event.detail;
        deleteTODO(eventDetail.item);
        
    };

    private todoItemEdited = (event:CustomEvent)=>{
        var eventDetail:{item:TODOItem, value?:any} = event.detail;
        editTODOItem(eventDetail.item,eventDetail.value);
    };

    private todoItemToggleCompleted = (event:CustomEvent)=>{
        var eventDetail:{item:TODOItem, value?:any} = event.detail;
        toggleTODOItemCompleted(eventDetail.item,eventDetail.value);
    };

    private handleToggleAllCompleted = (event:Event):void=>
    {
        toggleAllItemCompleted((this.toggleAllCheckBox[0] as HTMLInputElement).checked)
    };
    
    private handleClearCompleted = (event:Event):void =>{
        
        clearAllCompleted();
    };

    render() {
        return <div>
            <states>
                <state name="noTODOs" />
                <state name="all" />
                <state name="active"/>
                <state name="completed"/>
            </states>
            <section class="todoapp">
                <header class="header">
                    <h1>todos</h1>
                    <input id="newTODOInput" class="new-todo" placeholder="What needs to be done?" autofocus/>
                </header>
                <div style__noTODOs="display:none" style="">
                    <section class="main" >
                        <input onchange={this.handleToggleAllCompleted} id="toggleAllCheckBox" class="toggle-all" type="checkbox"/>

                        <label for="toggle-all">Mark all as complete</label>

                        <TODODataGroup todoItemEdited={this.todoItemEdited}
                                       todoItemToggleCompleted={this.todoItemToggleCompleted}
                                       todoItemDeleted={this.todoItemDeleted} class="todo-list"
                                       itemRenderer={TODOItemRenderer}
                                       dataProvider={todoStore.todos}/>
                    </section>
                    <footer class="footer">
                        <span class="todo-count"><strong id="todoCount"/> item left</span>
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
                        <button id="clearCompletedBtn" onclick={this.handleClearCompleted} class="clear-completed">Clear completed</button>
                    </footer>
                </div>
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