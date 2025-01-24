# Microcks Spectral ruleset

A set of rules for [Spectral](https://github.com/stoplightio/spectral) that allows linting OpenAPI and AsyncAPI spec for Microcks conventions.

Microcks conventions for [OpenAPI](https://microcks.io/documentation/using/openapi/) and [AsyncAPI](https://microcks.io/documentation/using/asyncapi/) specification files can be sometime a little boring to apply and debug. This set of rules allows you to use your favorite linter to detect if some of the conventions are missing or are incomplete so that Microcks will be able to import comprehensive mocks 😉

This ruleset is initially targeting the [Spectral](https://github.com/stoplightio/spectral) linter but we also added a compatibility layer for [Vacuum](https://github.com/daveshanley/vacuum). As this is not our primary focus, we'll see what it means to support this layer in the long-term...

[![License](https://img.shields.io/github/license/microcks/microcks-testcontainers-java?style=for-the-badge&logo=apache)](https://www.apache.org/licenses/LICENSE-2.0)
[![Project Chat](https://img.shields.io/badge/discord-microcks-pink.svg?color=7289da&style=for-the-badge&logo=discord)](https://microcks.io/discord-invite/)
[![Artifact HUB](https://img.shields.io/endpoint?url=https://artifacthub.io/badge/repository/microcks&style=for-the-badge)](https://artifacthub.io/packages/search?repo=microcks)
[![CNCF Landscape](https://img.shields.io/badge/CNCF%20Landscape-5699C6?style=for-the-badge&logo=cncf)](https://landscape.cncf.io/?item=app-definition-and-development--application-definition-image-build--microcks)

## Build Status

Latest released version is `0.0.5`.

Current development version is `0.0.6`.

#### Fossa license and security scans

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmicrocks%2Fmicrocks-spectral-ruleset.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fmicrocks%2Fmicrocks-spectral-ruleset?ref=badge_shield&issueType=license)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmicrocks%2Fmicrocks-spectral-ruleset.svg?type=shield&issueType=security)](https://app.fossa.com/projects/git%2Bgithub.com%2Fmicrocks%2Fmicrocks-spectral-ruleset?ref=badge_shield&issueType=security)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmicrocks%2Fmicrocks-spectral-ruleset.svg?type=small)](https://app.fossa.com/projects/git%2Bgithub.com%2Fmicrocks%2Fmicrocks-spectral-ruleset?ref=badge_small)

#### OpenSSF best practices on Microcks core

[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/7513/badge)](https://bestpractices.coreinfrastructure.org/projects/7513)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/microcks/microcks/badge)](https://securityscorecards.dev/viewer/?uri=github.com/microcks/microcks)

## Community

* [Documentation](https://microcks.io/documentation/tutorials/getting-started/)
* [Microcks Community](https://github.com/microcks/community) and community meeting
* Join us on [Discord](https://microcks.io/discord-invite/), on [GitHub Discussions](https://github.com/orgs/microcks/discussions) or [CNCF Slack #microcks channel](https://cloud-native.slack.com/archives/C05BYHW1TNJ)

To get involved with our community, please make sure you are familiar with the project's [Code of Conduct](./CODE_OF_CONDUCT.md).

## Versions

| This ruleset | Spectral Version | Vaccum Version |
|--------------|------------------|----------------|
| <= `0.0.5`   | `6.11.1` and +   | `0.9.16` and + |
| >= `0.0.6`   | `6.14.0` and +   | `0.9.16` and + |

## How to use it?

Developers wanting to pull the ruleset can just install the package using `yarn` or `npm` and reference the module name in `extends`:

```yaml
extends:
  - "@microcks/spectral-ruleset"
```

Locking a ruleset on a given version is possible through `package.json`:

```json
{
  "dependencies": {
    "@microcks/spectral-ruleset": "0.0.5"
  }
}
```

If you use Spectral in a browser or don't want to install the package, you can also reference that package through the use of CDNs for npm repositories, such as `unpkg.com`. You can then put directly in your own rules our `.spectral.yaml` file, the following directive:

```yaml
extends:
  - "https://unpkg.com/@microcks/spectral-ruleset@0.0.5"
```

## What results to expect?

To illustrate the results of applying the ruleset, let's have a look at the [Weather Forecast API](./resources/weather-forecast-openapi-bad.yaml) OpenAPI specification. Eventhough everything looks nice at a first look, some issues will prevent Microcks to collect and build comprhensive mocks from the spec elements:

1. [L39](./resources/weather-forecast-openapi-bad.yamlL39): `unknown` is an expected response (see L96) but no value has been defined for this parameter. Microcks will not be able to associate response with parameter value, 
2. [L54](./resources/weather-forecast-openapi-bad.yamlL54): `apiKey` parameter is required but no examples are provided. The mock will not be representative of expected API behavior,
3. [L95](./resources/weather-forecast-openapi-bad.yamlL95): `temp` has been defined as a number in the schema but we provided a string. The mock will not be consistent with the API types definition,
3. [L115](./resources/weather-forecast-openapi-bad.yamlL115): the `SetForecast` operation request define an example called `north` but no response has this name. Microcks will not be able to associate response with body value, 
4. [L125](./resources/weather-forecast-openapi-bad.yamlL125): the `SetForecast` operation defines no examples for both the response. Microcks will not be able to guess mock values for these one,
5. [L140](./resources/weather-forecast-openapi-bad.yamlL140): the `DeleteForecast` operation defines an example for a region `center` and there's no response for this region. Microcks will not be able to find a suitable response,
6. [L146](./resources/weather-forecast-openapi-bad.yamlL146): the `DeleteForecast` operation is a no-content response so it uses `x-microcks-refs` to tell to what response elements it should bind the response. However, the `center-south` value has not be defined as a valid parameter value... Microcks will not be able to bind to a matching request,
7. [L18](./resources/weather-forecast-openapi-bad.yamlL18): `team` label used in `x-microcks` extension is not well-formed as it should just be a `string`, 
8. [L30](./resources/weather-forecast-openapi-bad.yamlL30): `delay` information used in `x-microcks-operation` extension is not well-formed as it must be an `integer`. 

Debugging everything by hand can be tedious... So here's how to detect those issues and get some hints on what's going wrong. ✨

### Using Spectral

We'll use the `microcks-rules.yaml` ruleset definition file here. If you followed the above instruction on how to use it via `unpkg`, you don't need to include the `-r microcks-rules.yaml` part of the command:

```shell
$ spectral --version
6.11.1

$ spectral lint -r microcks-rules.yaml resources/weather-forecast-openapi-bad.yaml

/Users/laurent/Development/github/microcks-spectral-ruleset/resources/weather-forecast-openapi-bad.yaml
  18:12  warning  microcks-info-extension-valid                  x-microcks extension must be valid                                                                                                                                                                        info.x-microcks.labels.team
  30:16  warning  microcks-operation-extension-valid             x-microcks-operation extension must be valid                                                                                                                                                              paths./forecast/{region}.get.x-microcks-operation.delay
  49:11  warning  microcks-examples-in-required-parameter        Required param must have examples                                                                                                                                                                         paths./forecast/{region}.get.parameters[1]
  55:17  warning  microcks-examples-fragments-to-complete-mocks  🚨 Response example 'unknown' is incomplete, it has no matching input example. It requires at least one requestBody or parameter example with same name to be considered as valid mock for Microcks.      paths./forecast/{region}.get.responses
  95:27    error  oas3-valid-media-example                       "temp" property type must be number                                                                                                                                                                       paths./forecast/{region}.get.responses[200].content.application/json.examples.south.value.temp
 121:17  warning  microcks-examples-fragments-to-complete-mocks  ℹ️  Request body example 'north' is not used in any response. It requires to have a matching response example or a x-microcks-refs to be considered as valid mock for Microcks.                           paths./forecast/{region}.put.responses
 125:30  warning  microcks-examples-in-response-content          Response with content must have examples                                                                                                                                                                  paths./forecast/{region}.put.responses[200].content.application/json
 142:17  warning  microcks-examples-fragments-to-complete-mocks  🔗 Response has x-microcks-refs 'center-south' but it doesn't match input example. It requires at least one requestBody or parameter example with same name to be considered as valid mock for Microcks.  paths./forecast/{region}.delete.responses
 142:17  warning  microcks-examples-fragments-to-complete-mocks  ℹ️  Path parameter example 'center' is not used in any response. It requires to have a matching response example or a x-microcks-refs to be considered as valid mock for Microcks.                        paths./forecast/{region}.delete.responses

✖ 9 problems (1 error, 8 warnings, 0 infos, 0 hints)
```

If you'd like a more human-readable output of Microcks hints for a complete document, you can set the `MICROCKS_HINTS` environment variable to `true` when running spectral:

```shell
$ MICROCKS_HINTS=true spectral lint -r microcks-rules.yaml resources/weather-forecast-openapi-bad.yaml

🚨 Response example 'unknown' for 'paths./forecast/{region}.get' is incomplete, it has no matching input example.
   It requires at least one requestBody or parameter example with same name to be considered as valid mock for Microcks.

ℹ️  Request body example 'north' for 'paths./forecast/{region}.put' is not used in any response.
   It requires to have a matching response example or a x-microcks-refs to be considered as valid mock for Microcks.

🔗 Response has x-microcks-refs 'center-south' for 'paths./forecast/{region}.delete' but it doesn't match input example.
   It requires at least one requestBody or parameter example with same name to be considered as valid mock for Microcks.

ℹ️  Path parameter example 'center' for 'paths./forecast/{region}.delete' is not used in any response.
   It requires to have a matching response example or a x-microcks-refs to be considered as valid mock for Microcks.

/Users/laurent/Development/github/microcks-spectral-ruleset/resources/weather-forecast-openapi-bad.yaml
  18:12  warning  microcks-info-extension-valid                  x-microcks extension must be valid                                                                                                                                                                        info.x-microcks.labels.team

[...]
```

### Using Vacuum

We'll use the `microcks-vacuum-rules.yaml` ruleset definition file here:

```shell
$ vacuum lint -r microcks-vacuum-rules.yaml -f ./functions resources/weather-forecast-openapi-bad.yaml -d


██╗   ██╗ █████╗  ██████╗██╗   ██╗██╗   ██╗███╗   ███╗
██║   ██║██╔══██╗██╔════╝██║   ██║██║   ██║████╗ ████║
██║   ██║███████║██║     ██║   ██║██║   ██║██╔████╔██║
╚██╗ ██╔╝██╔══██║██║     ██║   ██║██║   ██║██║╚██╔╝██║
 ╚████╔╝ ██║  ██║╚██████╗╚██████╔╝╚██████╔╝██║ ╚═╝ ██║
  ╚═══╝  ╚═╝  ╚═╝ ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝     ╚═╝


version: 0.9.16 | compiled: Thu, 09 May 2024 19:57:46 UTC
🔗 https://quobix.com/vacuum | https://github.com/daveshanley/vacuum


 INFO  Located custom javascript function: 'aas-verify-mocks'
  ERROR   Failed to load function 'aas-verify-mocks': SyntaxError: SyntaxError: (anonymous): Line 16:1 Unexpected reserved word (and 8 more errors)
 INFO  Located custom javascript function: 'oas-verify-mocks-vacuum'
 INFO  Located custom javascript function: 'oas-verify-mocks'
  ERROR   Failed to load function 'oas-verify-mocks': SyntaxError: SyntaxError: (anonymous): Line 16:1 Unexpected reserved word (and 20 more errors)
 INFO  Loaded 3 custom function(s) successfully.
 INFO  Linting file 'resources/weather-forecast-openapi-bad.yaml' against 7 rules: https://quobix.com/vacuum/rulesets/no-rules

2024/05/21 14:17:56 
2024/05/21 14:17:56 🚨 Response example 'unknown' for 'GetForecast' is incomplete, it has no matching input example.
2024/05/21 14:17:56    It requires at least one requestBody or parameter example with same name to be considered as valid mock for Microcks.
2024/05/21 14:17:56 
2024/05/21 14:17:56 ℹ️  Request body example 'north' for 'SetForecast' is not used in any response.
2024/05/21 14:17:56    It requires to have a matching response example or a x-microcks-refs to be considered as valid mock for Microcks.
2024/05/21 14:17:56 
2024/05/21 14:17:56 🔗 Response has x-microcks-refs 'center-south' for 'DeleteForecast' but it doesn't match input example.
2024/05/21 14:17:56    It requires at least one requestBody or parameter example with same name to be considered as valid mock for Microcks.
2024/05/21 14:17:56 
2024/05/21 14:17:56 ℹ️  Path parameter example 'center' for 'DeleteForecast' is not used in any response.
2024/05/21 14:17:56    It requires to have a matching response example or a x-microcks-refs to be considered as valid mock for Microcks.

/Users/laurent/Development/github/microcks-spectral-ruleset/resources/weather-forecast-openapi-bad.yaml
-------------------------------------------------------------------------------------------------------
Location                                           | Severity | Message                                                                        | Rule                                          | Category   | Path
resources/weather-forecast-openapi-bad.yaml:15:5   | warning  | x-microcks extension must be valid                                             | microcks-info-extension-valid                 | Validation | $.info[0]
resources/weather-forecast-openapi-bad.yaml:24:7   | warning  | Response example 'unknown' is incomplete, it has no matching input example     | microcks-examples-fragments-to-complete-mocks | Validation | $.paths.*.*
resources/weather-forecast-openapi-bad.yaml:30:9   | warning  | x-microcks-operation extension must be valid                                   | microcks-operation-extension-valid            | Validation | $.paths.*.*[0]
resources/weather-forecast-openapi-bad.yaml:49:11  | info     | Parameters should have examples                                                | microcks-examples-in-parameter                | Validation | $..parameters[0][1]
resources/weather-forecast-openapi-bad.yaml:92:17  | warning  | expected number, but got string                                                | oas3-valid-schema-example                     | Examples   | $.paths['/forecast/{region}'].get.responses['200'].content['...
resources/weather-forecast-openapi-bad.yaml:108:7  | warning  | Request body example 'north' is not used in any response                       | microcks-examples-fragments-to-complete-mocks | Validation | $.paths.*.*
resources/weather-forecast-openapi-bad.yaml:126:15 | warning  | Response with content must have examples                                       | microcks-examples-in-response-content         | Validation | $.paths..responses..content.*
resources/weather-forecast-openapi-bad.yaml:129:7  | warning  | Response has x-microcks-refs 'center-south' but it doesn't match input example | microcks-examples-fragments-to-complete-mocks | Validation | $.paths.*.*
resources/weather-forecast-openapi-bad.yaml:129:7  | warning  | Path parameter example 'center' is not used in any response                    | microcks-examples-fragments-to-complete-mocks | Validation | $.paths.*.*

Category   | Errors | Warnings | Info
Validation | 0      | 7        | 1
Examples   | 0      | 1        | 0

                                                                     
          Linting passed, but with 8 warnings and 1 informs          
                                                                                                                                       
```

## Rules reference

### Microcks extensions

#### microcks-info-extension-valid

This rule will check that `info.x-microcks` is well-formed according to its schema information.

`x-microcks` OpenAPI and AsyncAPI extension allows you to provide `labels` for organizing your API and Services in Microcks. Labels are simple key/value pairs where keys and values are string.

**Severity:** `warn`

#### microcks-operation-extension-valid

This rule will check that `x-microcks-operation` provided for operation is well-formed according to its schema information.

`x-microcks-operation` OpenAPI and AsyncAPI extension allows you to provide custom dispatching rules and delays for your mocks. We'll check that attributes are known from Microcks to guarantee their application.

**Severity:** `warn`

### OpenAPI v3

#### Reused external rules

The Microcks ruleset imports the `oas3-valid-media-example` and `oas3-valid-schema-example` rules from the [Spectral OpenAPI Rules](https://meta.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules).

These rules check that the `examples` definitions are conformant to the schema definition with the API specification. Having incorrect values or types will not prevent Microcks to produce mocks but these ones will be totally useless for people wanted to have a high-fidelity simulation of the API.

**Severity:** `error`

#### microcks-examples-in-required-parameter

This rule will ask you to provide named `examples` for parameters marqued as required.

Putting named `examples` in parameters allows you to explicit values of parameters depending on different situation and then to later bind them with corresponding request body or response. This provide a better overview of the expected behavior of your API for people who will discover it. Not providing these examples prevents Microcks from producing correct and representative mocks.

**Severity:** `warn`

#### microcks-examples-in-optional-parameter

This rule will recommend you to provide named `examples` for parameters marqued as optional.

Putting named `examples` in parameters allows you to explicit values of parameters depending on different situation and then to later bind them with corresponding request body or response. This provide a better overview of the expected behavior of your API for people who will discover it.

**Severity:** `info`

#### microcks-examples-in-request-content

This rule will ask you to provide named `examples` within `requestBody.content.*`.

Putting named `examples` in request content allows you to explicit payload depending on different situation and then to later bind them with corresponding response. This provide a better overview of the expected behavior of your API for people who will discover it. Not providing these examples prevents Microcks from producing mocks.

**Severity:** `warn`

#### microcks-examples-in-response-content

This rule will ask you to provide named `examples` within `responses.*.content.*`.

Putting named `examples` in response content allows you to explicit payload depending on different situation and then to later bind them with corresponding request body or parameter values. This provide a better overview of the expected behavior of your API for people who will discover it. Not providing these examples prevents Microcks from producing mocks.

**Severity:** `warn`

#### microcks-examples-fragments-to-complete-mocks

This rule will check the coherence of different response, request and parameter examples to detect incomplete combination.

**Severity:** `warn`

### AsyncAPI v2.x

#### Reused external rules

The Microcks ruleset imports the `asyncapi-message-examples` from the [Spectral AsyncAPI Rules](https://docs.stoplight.io/docs/spectral/1e63ffd0220f3-async-api-rules).

This rule checks that the `examples` definitions are conformant to the schema definition with the API specification. Having incorrect values or types will not prevent Microcks to produce mocks but these ones will be totally useless for people wanted to have a high-fidelity simulation of the API.

**Severity:** `error`

#### microcks-aas-examples-in-message

This rule will ask you to provide named `examples` within `$.channels.*.[publish,subscribe].message`.

Putting named `examples` in message allows you to explicit payload depending on different situation and then optionally to later bind them with corresponding parameter values. This provide a better overview of the expected behavior of your API for people who will discover it. Not providing these examples prevents Microcks from producing mocks.

**Severity:** `warn`

#### microcks-aas-examples-in-parameter

This rule will ask you to provide named `examples` within `$.channels.*.parameters.*.schema`.

Putting named `examples` in channel parameters allows you to explicit values of parameters depending on different situation and then to later bind them with corresponding message content. This provide a better overview of the expected behavior of your API for people who will discover it. Not providing these examples prevents Microcks from producing correct and representative mocks.

**Severity:** `warn`

#### microcks-aas-examples-fragments-to-complete-mocks

This rule will check the coherence of different messages and parameter examples to detect incomplete combination.

**Severity:** `warn`
