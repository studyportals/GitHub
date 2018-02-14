import fetch, {Response} from "node-fetch";
import {IGitHub, IGitHubComment, IGitHubHeaders} from "./IGitHub";

export class GitHub implements IGitHub {

	private oauthTokenField: string | undefined;

	constructor(oauthToken?: string) {

		this.oauthTokenField = oauthToken;
	}

	private get oauthToken(): string | undefined {

		return this.oauthTokenField;
	}

	public getComments(owner: string, repository: string, issueNumber?: string): Promise<IGitHubComment[]> {
		const commentsUrl = this.getCommentsUrl(owner, repository, issueNumber);
		return this.callFetch(commentsUrl, {
			headers: this.getHeaders(),
			method: "GET",
		}).then<IGitHubComment[]>(this.handleResponse);
	}

	public deleteComment(owner: string, repository: string, commentId: string): Promise<any> {
		const commentsUrl = this.getCommentsUrl(owner, repository);
		return this.callFetch(`${commentsUrl}/${commentId}`, {
			headers: this.getHeaders(),
			method: "DELETE"});
	}

	public postComment(owner: string, repository: string, issueNumber: string, body: string): Promise<IGitHubComment> {
		const commentsUrl = this.getCommentsUrl(owner, repository, issueNumber);
		return this.callFetch(commentsUrl, {
			body: JSON.stringify({body}),
			headers: this.getHeaders(),
			method: "POST",
		}).then<IGitHubComment>(this.handleResponse);
	}

	private getRepoUrl(owner: string, repository: string): string {
		return `https://api.github.com/repos/${owner}/${repository}`;
	}

	private getIssuesUrl(owner: string, repository: string, issueNumber?: string): string {
		let url = this.getRepoUrl(owner, repository);

		url += "/issues";

		if (undefined === issueNumber) {

			return url;
		}

		return `${url}/${issueNumber}`;
	}

	private getCommentsUrl(owner: string, repository: string, issueNumber?: string): string {

		return this.getIssuesUrl(owner, repository, issueNumber) + "/comments";
	}

	private getHeaders(): IGitHubHeaders {

		const headers: IGitHubHeaders = {

			"Content-Type": "application/json",
		};

		if (undefined !== this.oauthToken) {

			headers.Authorization = `token ${this.oauthToken}`;
		}

		return headers;
	}

	private handleResponse<T>(response: Response): Promise<T> {

		if (response.ok) {

			return response.json();
		}

		throw new Error(`fetch: response.ok is false.`);
	}

	private callFetch(url: string, options: {[key: string]: any}): Promise<any> {

		return fetch(url, options);
	}
}
