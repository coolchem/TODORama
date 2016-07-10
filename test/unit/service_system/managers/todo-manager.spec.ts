

import todoManager = require("../../../../src/client/systems/service_system/managers/todo-manager");

import todoService = require("../../../../src/client/systems/service_system/services/todo-service");

import Promise = require("bluebird");
import {ArrayCollection} from "ramajs/dist/index";
import {TODOItem} from "../../../../src/client/systems/service_system/models/TODOItem";
import Spy = jasmine.Spy;
import {ActionConstants} from "../../../../src/client/systems/service_system/constants";
import {todoStore} from "../../../../src/client/systems/service_system/stores/index";

var dispatcher = require("../../../../src/client/systems/service_system/dispatcher");


describe('todo-manager Test cases', () => {

    var todosArray:any[] = [
        {
            label:"Test 1",
            completed:false,
            deleted:false,
        },
        {
            label:"Test 2",
            completed:false,
            deleted:false,
        }
    ];
    var saveTODOsSpy:Spy;

    beforeAll(()=>{
        
        saveTODOsSpy = spyOn(todoService, "saveTODOs").and.returnValue(Promise.resolve(todosArray))
    });
    
    describe("loadTODOs",()=>{
        
        it("should dispatch an action on the dispatcher after getting todos from the service",(done)=>{

           
            spyOn(todoService,"getTODOs").and.returnValue(Promise.resolve(todosArray));

            dispatcher.addEventListener(ActionConstants.TODOS_LOADED,()=>{
                done();
            });

            todoManager.loadTODOs();

        });

    });

    describe("applyTOODsFilter",()=>{

        
        it("should dispatch an action on the dispatcher with the appropriate filter value",(done)=>{
            


            dispatcher.addEventListener(ActionConstants.TODOS_FILTER_CHANGED,(value)=>{
                expect(value).toEqual("all");
                done();
            });

            todoManager.applyTOODsFilter("all");
            
        });

    });

    describe("addTODO",()=>{

        
        it("should should add a new todo item to todoStorage",()=>{
            
            todoStore.todos = new ArrayCollection<TODOItem>();

            todoManager.addTODO("Test 1");

            expect(todoStore.todos.length).toEqual(1);

            expect(todoStore.todos.getItemAt(0) instanceof TODOItem).toBe(true);

        });

        it("should save all the todos in todoStorage and dispatch an Action with saved todos",(done)=>{


            dispatcher.addEventListener(ActionConstants.TODOS_SAVED,()=>{
                done();
            });
            
            todoManager.addTODO("all");

        });

    });

    describe("deleteTODO",()=>{

        it("should mark the item as deleted",()=>{

            var todoItem:TODOItem = new TODOItem("test 1");
            
            todoManager.deleteTODO(todoItem);

            expect(todoItem.deleted).toBe(true);

        });

        it("should save all the todos in todoStorage and dispatch an Action with saved todos",(done)=>{

            dispatcher.addEventListener(ActionConstants.TODOS_SAVED,()=>{
                done();
            });
            var todoItem:TODOItem = new TODOItem("test 1");
            todoManager.deleteTODO(todoItem);

        });

    });

    describe("editTODOItem",()=>{


        it("should set the label of the todoItem with new value",()=>{
            
            var todoItem:TODOItem = new TODOItem("test 1");

            todoManager.editTODOItem(todoItem, "test");
            expect(todoItem.label).toEqual("test");

        });

        it("should save all the todos in todoStorage and dispatch an Action with saved todos",(done)=>{


            dispatcher.addEventListener(ActionConstants.TODOS_SAVED,()=>{
                done();
            });
            
            var todoItem:TODOItem = new TODOItem("test 1");

            todoManager.editTODOItem(todoItem, "test");
            
        });

    });

    describe("toggleTODOItemCompleted",()=>{
        

        it("should set the completed to appropriate property",()=>{

            var todoItem:TODOItem = new TODOItem("test 1");

            todoManager.toggleTODOItemCompleted(todoItem, true);
            expect(todoItem.completed).toBe(true);

        });

        it("should save all the todos in todoStorage and dispatch an Action with saved todos",(done)=>{


            dispatcher.addEventListener(ActionConstants.TODOS_SAVED,()=>{
                done();
            });
            
            var todoItem:TODOItem = new TODOItem("test 1");

            todoManager.toggleTODOItemCompleted(todoItem, true);

        });

    });

    describe("toggleAllItemCompleted",()=>{


        it("should loop through all todoItems in todoStore todos collection and set them to appropriate property",()=>{
            
            var todoItem:TODOItem = new TODOItem("test 1");

            todoStore.todos = new ArrayCollection<TODOItem>([todoItem]);
            
            todoManager.toggleAllItemCompleted(true);

            expect(todoItem.completed).toBe(true);

        });

        it("should save all the todos in todoStorage and dispatch an Action with saved todos",(done)=>{

            function handler(){
                expect(todoItem.completed).toBe(true);
                dispatcher.removeEventListener(ActionConstants.TODOS_SAVED,handler);
                done();
            }
            dispatcher.addEventListener(ActionConstants.TODOS_SAVED,handler);
            
            var todoItem:TODOItem = new TODOItem("test 1");

            todoStore.todos = new ArrayCollection<TODOItem>([todoItem]);

            todoManager.toggleAllItemCompleted(true);
            
        });

    });

    describe("clearAllCompleted",()=>{

        it("should loop through all todoItems in todoStore todos collection and set them to deleted",()=>{

            var todoItem:TODOItem = new TODOItem("test 1");
            todoItem.completed = true;
            todoStore.todos = new ArrayCollection<TODOItem>([todoItem]);

            todoManager.clearAllCompleted();
            expect(todoItem.deleted).toBe(true);

        });

        it("should save all the todos in todoStorage and dispatch an Action with saved todos",(done)=>{

            dispatcher.addEventListener(ActionConstants.TODOS_SAVED,()=>{
                done();
            });
            
            var todoItem:TODOItem = new TODOItem("test 1");

            todoStore.todos = new ArrayCollection<TODOItem>([todoItem]);

            todoManager.clearAllCompleted();
            
        });
        
    });
    
});