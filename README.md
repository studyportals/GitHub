# GitHub

This package aims to ease the process of interacting with GitHub.

[![NPM version](https://img.shields.io/npm/v/@studyportals/github.svg?style=flat)](https://www.npmjs.com/package/@studyportals/github)
[![NPM license](https://img.shields.io/npm/l/@studyportals/github.svg?style=flat)](https://www.npmjs.com/package/@studyportals/github)
[![NPM downloads](https://img.shields.io/npm/dm/@studyportals/github.svg?style=flat)](https://www.npmjs.com/package/@studyportals/github)

## Interface:
```typescript
export interface IGitHub {
	getComments(owner: string, repository: string, issueNumber?: string): Promise<IGitHubComment[]>;
	deleteComment(owner: string, repository: string, commentId: string): Promise<any>;
	postComment(owner: string, repository: string, issueNumber: string, body: string): Promise<IGitHubComment>;
}
```

## Installation:

```node
npm install --save @studyportals/github
```

## Example:

_TypeScript_
```typescript
import {GitHub} from "@studyportals/github";

const GH = new GitHub(process.env.GITHUB_TOKEN);

return GH.postComment("studyportals", "github", "1", "Comment description")
    .then((comment) => { });
```

_Node_
```node
const github = require("@studyportals/github");
const GH = new github.GitHub(process.env.GITHUB_TOKEN);

return GH.postComment("studyportals", "github", "1", "Comment description")
    .then((comment) => { });
```

## Development
[![Build Status](https://travis-ci.org/studyportals/GitHub.svg?branch=master&style=flat)](https://travis-ci.org/studyportals/GitHub)

This package can be compiled and tested locally.
- `npm install` - Install the dependencies
- `npm test` - Runs the test suite (will lint and compile first)
- `npm compile` - Compiles the entire project
- `npm run setup-hooks` - Install Git hooks. This will add a pre-commit hook to ensure code quality.
- `npm run watch` - Watch the project and compile on the fly.

_Please have a look at [package.json](./package.json) scripts section._

## Publishing NPM package
This package is automatically published by TravisCI for every commit on master.

```bash
# Draft a new version
# @see: https://docs.npmjs.com/cli/version
# @see: https://semver.org/
npm version [<newversion> | major | minor | patch | prerelease ]

# Push the commit and tags
git push --follow-tags
```