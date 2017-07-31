export class BaseAction {
    public Action: string;
    constructor() {
    //    var constructorString: string = this.constructor.toString();
    //    var className: string = constructorString.match(/\w+/g)[1];
    //    this.Action = className;
    //    console.log(className);
    }

    getAuthToken() {
        return null;
    }
}
