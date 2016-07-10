
import todoService = require("../../../../src/client/systems/service_system/services/todo-service")
import Spy = jasmine.Spy;

var storage = window.localStorage;

describe('todo-service Test cases', () => {

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
    
    var todosJson:string = JSON.stringify(todosArray);
    
    describe("getTODOs",()=>{

        var storageGetItemSpy:Spy;
        
        it("should resolve with array of todoItems if items are present in local storage",(done)=>{

            storageGetItemSpy = spyOn(storage,"getItem").and.returnValue(todosJson);
            
            todoService.getTODOs().then((result)=>{

                expect(result.length > 0).toBe(true);
                expect(storageGetItemSpy).toHaveBeenCalledTimes(1);
                done();
            });
        });

        it("should resolve with empty array if no item is returned from storage",(done)=>{

            storageGetItemSpy = spyOn(storage,"getItem").and.returnValue(null);

            todoService.getTODOs().then((result)=>{

                expect(result.length == 0).toBe(true);
                expect(storageGetItemSpy).toHaveBeenCalledTimes(1);
                done();
            });
        });

    });
});