export interface IGitHubHeaders {
	[key: string]: string;
}

export interface IJSON {
	[key: string]: IJSON | string;
}

export interface IGitHubComment extends IJSON {
	id: string;
	user: {
		login: string;
	};
}

export interface IGitHub {
	getComments(owner: string, repository: string, issueNumber?: string): Promise<IGitHubComment[]>;
	deleteComment(owner: string, repository: string, commentId: string): Promise<any>;
	postComment(owner: string, repository: string, issueNumber: string, body: string): Promise<IGitHubComment>;
}
