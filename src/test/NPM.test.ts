import {assert} from "chai";
import {exec} from "child_process";
import * as semver from "semver";
// noinspection TsLint
import * as pjson from "./../../package.json";

describe("NPM", () => {

	const BRANCH = process.env.TRAVIS_PULL_REQUEST_BRANCH || process.env.TRAVIS_BRANCH;

	const condition = (BRANCH && BRANCH !== "master");

	if (condition) {

		it("package.version should be valid and bigger then the published one.", (done) => {

			exec(`npm info ${pjson.name} version`, (error, version, stderr) => {
				if (error) {
					return done(error);
				}
				if (stderr) {
					return done(stderr);
				}

				assert.isNotNull(semver.valid(pjson.version), `${pjson.version} is not a valid semver`);
				assert.isTrue(semver.gt(pjson.version, version), `${pjson.version} is not bigger then ${version}`);
				done();
			});
		}).timeout(5000);
	}
});
