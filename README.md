# PADERBORNJS API

<a href="https://circleci.com/gh/paderbornjs/api">
  <img alt="CircleCI Build Status" src="https://img.shields.io/circleci/project/github/paderbornjs/api/master.svg?style=flat-square&label=CircleCI"></a>
<a href="https://codecov.io/gh/paderbornjs/api">
  <img alt="Codecov Coverage Status" src="https://img.shields.io/codecov/c/github/paderbornjs/api.svg?style=flat-square"></a>
<a href="https://snyk.io/test/github/paderbornjs/api?targetFile=package.json">
  <img src="https://snyk.io/test/github/paderbornjs/api/badge.svg?targetFile=package.json" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/github/paderbornjs/api?targetFile=package.json" style="max-width:100%;"></a>
<a href="https://greenkeeper.io/">
  <img alt="code style: prettier" src="https://badges.greenkeeper.io/paderbornjs/api.svg"></a>
<a href="#badge">
  <img alt="Code style: Prettier" src="https://img.shields.io/badge/code_style-prettier-c596c7.svg?style=flat-square"></a>
<a href="https://twitter.com/paderbornjs">
  <img alt="Follow @paderbornjs on Twitter" src="https://img.shields.io/twitter/follow/paderbornjs.svg?label=follow+@paderbornjs&style=flat-square"></a>
<a href="https://app.fossa.io/projects/git%2Bgithub.com%2Fpaderbornjs%2Fapi?ref=badge_shield" alt="FOSSA Status"><img src="https://app.fossa.io/api/projects/git%2Bgithub.com%2Fpaderbornjs%2Fapi.svg?type=shield"/></a>


## Intro

The #paderbornjs API provides data for the [paderbornjs website](https://paderbornjs.org/) in the form of a single [GraphQL](https://graphql.org/) endpoint. Under the hood, it queries

- the [Github API](https://github.com) for talks (see the [talks repository](https://github.com/paderbornjs/talks) for more information)
- the [Meetup API](https://meetup.com) for events
- the [Twitter API](https://twitter.com) for organizer information

Data from these APIs is cached so that requests to the #paderbornjs API don't have to hit all of these on every request.

## Technology overview

#### Implementation

The #paderbornjs API is mostly implemented in [Typescript](https://www.typescriptlang.org) with a little bit of [GraphQL Schema Language](https://graphql.org/learn/schema/#type-language). The server implementation is based on [Express](https://expressjs.com) and [Apollo Server](https://www.apollographql.com/server).

#### Testing

Testing is done with [Jest](https://jestjs.io). Integration tests additionally use [Supertest](https://github.com/visionmedia/supertest) to assert on HTTP requests.

Continuous integration of these tests is run in [CirleCI](https://circleci.com), which collects coverage information and submits that to [CodeCov](https://codecov.io), which adds comments with test coverage statistics to pull requests.

#### Code style & linting
Code style is enforced by [Prettier](https://prettier.io), additional linting rules are provided by [TSLint](https://palantir.github.io/tslint) and  [tslint-microsoft-contrib](https://github.com/Microsoft/tslint-microsoft-contrib).

It is recommended to open this project as a directory in [Visual Studio Code](https://code.visualstudio.com) and install all recommended plugins. This way, code will be autoformatted every time you save a typescript file. In you are editing with another editor or auto-formatting in VSCode doesn't work, all typescript files will be auto-formatted on `git commit` with the help of [Husky](https://github.com/typicode/husky) and [Lint-staged](https://github.com/okonet/lint-staged).

#### Package management
[Greenkeeper](https://greenkeeper.io), which will open a pull request whenever it finds new versions of dependencies, is set up to ease the management of dependencies. Another tool that helps with that is [Snyk](https://snyk.io), which will perform security analysis of dependencies on new pull requests and open pull requests when newly discovered vulnerabilities affect the current state.

#### Deployment

Deployment is performed to a temporary [Now](https://zeit.co/now) instance for every pull request. Whenever a pull request is merged to master, the temporary deployment is automatically aliased to [https://api.paderbornjs.org](https://api.paderbornjs.org).

## Development

After cloning this repository, run `yarn` to install dependencies, then run `yarn start` to start the development server and `yarn test` to start the tests in watch mode. Both the development server and the test executions will automatically reload whenever you change code.

In order to fetch data from the Twitter and Meetup APIs, an `.env` file is required in the root of the repository

```ini
MEETUP_KEY=<YOUR MEETUP KEY>
TWITTER_API_KEY=<YOUR TWITTER API KEY>
TWITTER_API_SECRET=<YOUR TWITTER API SECRET>
```


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fpaderbornjs%2Fapi.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fpaderbornjs%2Fapi?ref=badge_large)