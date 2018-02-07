import { assert } from "chai";
import { Response } from "node-fetch";
import * as Moq from "typemoq";

import {GitHub} from "../GitHub";

describe("GitHub", () => {

	let testInstanceMock: Moq.IMock<GitHub>;
	let responseMock: Moq.IMock<Response>;

	beforeEach(() => {

		responseMock = Moq.Mock.ofType<Response>();

		testInstanceMock = Moq.Mock.ofType(GitHub);
		testInstanceMock.callBase = true;
	});

	it("getRepoUrl - - ExpectedValue NoTrailingSlash", () => {

		const owner = "SomeOwner";
		const repository = "SomeRepository";

		const result = testInstanceMock.object["getRepoUrl"](owner, repository);

		assert.equal(result, `https://api.github.com/repos/${owner}/${repository}`);
	});

	it("getIssuesUrl - NoIssueNumber - ExpectedValue NoTrailingSlash", () => {

		const repoUrl = "whatever";
		const owner = "SomeOwner";
		const repository = "SomeRepository";

		testInstanceMock
			.setup((x) => x["getRepoUrl"](owner, repository))
			.returns(() => repoUrl);

		const result = testInstanceMock.object["getIssuesUrl"](owner, repository);

		assert.equal(result, `${repoUrl}/issues`);
	});
	it("getIssuesUrl - IssueNumber - ExpectedValue NoTrailingSlash", () => {

		const repoUrl = "whatever";
		const owner = "SomeOwner";
		const repository = "SomeRepository";
		const issueNumber = "yes";

		testInstanceMock
			.setup((x) => x["getRepoUrl"](owner, repository))
			.returns(() => repoUrl);

		const result = testInstanceMock.object["getIssuesUrl"](owner, repository, issueNumber);

		assert.equal(result, `${repoUrl}/issues/${issueNumber}`);
	});

	it("getCommentsUrl - - ExpectedValue NoTrailingSlash", () => {

		const baseUrl = "whatever";
		const owner = "owner";
		const repository = "repository";
		const issueNumber = "issueNumber";

		testInstanceMock
			.setup((x) => x["getIssuesUrl"](owner, repository, issueNumber))
			.returns(() => baseUrl);

		const result = testInstanceMock.object["getCommentsUrl"](owner, repository, issueNumber);

		assert.equal(result, `${baseUrl}/comments`);
	});

	it("getHeaders - - ContentTypeApplicationJson", () => {

		const resultedHeaders = testInstanceMock.object["getHeaders"]();

		assert.isDefined(resultedHeaders["Content-Type"]);
		assert.equal(resultedHeaders["Content-Type"], "application/json");
	});
	it("getHeaders - OAuthTokenNotSet - AuthorizationUndefined", () => {

		testInstanceMock
			.setup((x) => x['oauthToken'])
			.returns(() => undefined);

		const resultedHeaders = testInstanceMock.object["getHeaders"]();

		assert.isUndefined(resultedHeaders["Authorization"]);
	});
	it("getHeaders - OAuthTokenSet - AuthorizationSetToOAuthtoken", () => {

		const providedValue = "SomeValue";

		testInstanceMock
			.setup((x) => x['oauthToken'])
			.returns(() => providedValue);

		const resultedHeaders = testInstanceMock.object["getHeaders"]();

		assert.isDefined(resultedHeaders["Authorization"]);
		assert.equal(resultedHeaders["Authorization"], `token ${providedValue}`);
	});

	it("handleResponse - ReponseOK - ReturnsResponseJSON", async () => {

		const providedValue = "SomeProvidedValue";
		let receivedValue: string | undefined;

		responseMock
			.setup((x) => x.ok)
			.returns(() => true);
		responseMock
			.setup((x) => x.json())
			.returns(async () => providedValue);

		receivedValue = await testInstanceMock.object["handleResponse"]<string>(responseMock.object);

		assert.equal(receivedValue, providedValue);
	});
	it("handleResponse - ResponseNotOk - ThrowsError", async () => {

		let errorCaught = false;

		responseMock
			.setup((x) => x.ok)
			.returns(() => false);

		try {

			await testInstanceMock.object["handleResponse"]<string>(responseMock.object);
		}
		catch(e) {

			errorCaught = true;
		}

		assert.isTrue(errorCaught);
	});
});
