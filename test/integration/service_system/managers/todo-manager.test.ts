
import todoManager = require("../../../../src/client/systems/service_system/managers/todo-manager");
import {todoStore} from "../../../../src/client/systems/service_system/stores/index";
import {EventConstants} from "../../../../src/client/systems/service_system/constants";


describe('todo-manager Integration Test cases', () => {

    describe("addTODO",()=>{

        it("should add a todoItem and save to local storage",(done)=>{


            todoStore.addEventListener(EventConstants.TODOS_CHANGED,handler);

            function handler(){
                expect(todoStore.hasCompletedItems()).toBe(false);
                todoStore.removeEventListener(EventConstants.TODOS_CHANGED,handler);
                done();
            }

            todoManager.addTODO("all");
        });

    });
});