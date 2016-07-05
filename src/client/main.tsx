

import {DOMElement} from "ramajs/dist/core/DOMElement";
import {TODODataGroup, TODOItemRenderer} from  "./systems/view_system/TODODataGroup";
require("todomvc-common");

import {View, rama, render, ArrayCollection} from "ramajs"

class Application extends View
{

    toggleAllCheckBox:DOMElement;


    todoCollection:ArrayCollection<any> = new ArrayCollection([
        {
            label:"Taste JavaScript",
            completed:true,
            deleted:false
        },
        {
            label:"Buy a unicorn",
            completed:false,
            deleted:false
        }
    ]);

    attached():void {

        this.toggleAllCheckBox.addEventListener("change", (event:Event)=>{
            console.log(event)
        })
    }

    render() {
        return <div>
            <states>
                <state name="testState"/>
            </states>
            <section class="todoapp">
                <header class="header">
                    <h1>todos</h1>
                    <input class="new-todo" placeholder="What needs to be done?" autofocus/>
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
                            <a class="selected" href="#/">All</a>
                        </li>
                        <li>
                            <a href="#/active">Active</a>
                        </li>
                        <li>
                            <a href="#/completed">Completed</a>
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

render(Application,document.getElementById("app"));