

export class TODOItem
{
    label:string;
    completed:boolean;
    deleted:boolean;


    constructor(label:string, completed?:boolean, deleted?:boolean) {
        this.label = label;
        this.completed = completed;
        this.deleted = deleted;
    }
}