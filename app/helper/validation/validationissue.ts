export class ValidationIssue {
	public message: string;
	public concern: string;
	public priority: number;

    constructor(message: string, concern: string, priority: IssuePriority) {
		this.message = message;
		this.concern = concern;
		this.priority = priority;
    }
}

export enum IssuePriority { Notice = 0, Warning = 1, Error = 1 }
