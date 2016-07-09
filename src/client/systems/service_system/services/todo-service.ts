

import Promise =  require("bluebird");

var storage = window.localStorage;

export function getTODOs():Promise<any[]>
{
    var items:Array<any>;

    if (storage) {
        items = JSON.parse(storage.getItem('todos-rama')) || [];
    }
    
    return Promise.resolve(items);
}

export function saveTODOs(todos:any[]):Promise<any[]>
{
    var items:Array<any>;

    if (storage)
    {
        storage.setItem('todos-rama', JSON.stringify(todos));
        items = JSON.parse(storage.getItem('todos-rama')) || [];
    }

    
    return Promise.resolve(items);
}