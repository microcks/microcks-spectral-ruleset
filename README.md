# Microcks Spectral ruleset

A set of rules for [Spectral](https://github.com/stoplightio/spectral) that allows linting OpenAPI and AsyncAPI spec for Microcks conventions.

Microcks conventions for [OpenAPI](https://microcks.io/documentation/using/openapi/) and [AsyncAPI](https://microcks.io/documentation/using/asyncapi/) specification files can be sometime a little boring to apply and debug. This set of rules allows you to use your favorite linter to detect if some of the conventions are missing or are incomplete so that Microcks will be able to import comprehensive mocks 😉

This ruleset is initially targeting the [Spectral](https://github.com/stoplightio/spectral) linter but we also added a compatibility layer for [Vacuum](https://github.com/daveshanley/vacuum). As this is not our primary focus, we'll see what it means to support this layer in the long-term...

[![License](https://img.shields.io/github/license/microcks/microcks-testcontainers-java?style=for-the-badge&logo=apache)](https://www.apache.org/licenses/LICENSE-2.0)
[![Project Chat](https://img.shields.io/badge/discord-microcks-pink.svg?color=7289da&style=for-the-badge&logo=discord)](https://microcks.io/discord-invite/)

## Build Status

Latest released version is `0.0.1`.

Current development version is `0.0.2`.

## How to use it?

`TO BE COMPLETED AFTER 1ST RELEASE`

## What results to expect?

To illustrate the results of applying the ruleset, let's have a look at the [Weather Forecast API](./resources/weather-forecast-openapi-bad.yaml) OpenAPI specification. Eventhough everything looks nice at a first look, some issues will prevent Microcks to collect and build comprhensive mocks from the spec elements:

1. [L30](./resources/weather-forecast-openapi-bad.yamlL30): `unknown` is an expected response (see L96) but no value has been defined for this parameter. Microcks will not be able to associate response with parameter value, 
2. [L45](./resources/weather-forecast-openapi-bad.yamlL45): `apiKey` parameter is required but no examples are provided. The mock will not be representative of expected API behavior,
3. [L86](./resources/weather-forecast-openapi-bad.yamlL86): `temp` has been defined as a number in the schema but we provided a string. The mock will not be consistent with the API types definition,
3. [L99](./resources/weather-forecast-openapi-bad.yamlL99): the `SetForecast` operation defines no examples for both the request and the response. Microcks will not be able to guess mock values for these one,
4. [L124](./resources/weather-forecast-openapi-bad.yamlL124): the `DeleteForecast` operation defines an example for a region `center` and there's no response for this region. Microcks will not be able to find a suitable response,
5. [L130](./resources/weather-forecast-openapi-bad.yamlL130): the `DeleteForecast` operation is a no-content response so it uses `x-microcks-ref` to tell to what response elements it should bind the response. However, the `center-south` value has not be defined as a valid parameter value... Microcks will not be able to bind to a matching request.

Debugging evertyhing by hand can be tedious... So here's how to detect those issues and get some hints on what's going wrong.

### Using Spectral

We'll use the `microcks-rules.yaml` ruleset definition file here:

```shell
$ spectral --version
6.11.1

$ spectral lint -r microcks-rules.yaml resources/weather-forecast-openapi-bad.yaml

🚨 Response example 'unknown' for 'paths./forecast/{region}.get' is incomplete, it has no matching input example.
   It requires at least one requestBody or parameter example with same name to be considered as valid mock for Microcks.

🔗 Response has x-microcks-ref 'center-south' for 'paths./forecast/{region}.delete' but it doesn't match input example.
   It requires at least one requestBody or parameter example with same name to be considered as valid mock for Microcks.

ℹ️  Path parameter example 'center' for 'paths./forecast/{region}.delete' is not used in any response.
   It requires to have a matching response example or a x-microcks-ref to be considered as valid mock for Microcks.

/Users/laurent/Development/github/microcks-spectral-ruleset/resources/weather-forecast-openapi-bad.yaml
  40:11  warning  microcks-examples-in-required-parameter        Required param must have examples                                              paths./forecast/{region}.get.parameters[1]
  46:17  warning  microcks-examples-fragments-to-complete-mocks  Response example 'unknown' is incomplete, it has no matching input example     paths./forecast/{region}.get.responses
  86:27    error  oas3-valid-media-example                       "temp" property type must be number                                            paths./forecast/{region}.get.responses[200].content.application/json.examples.south.value.temp
 102:28  warning  microcks-examples-in-request-content           Request with content must have examples                                        paths./forecast/{region}.put.requestBody.content.application/json
 109:30  warning  microcks-examples-in-response-content          Response with content must have examples                                       paths./forecast/{region}.put.responses[200].content.application/json
 126:17  warning  microcks-examples-fragments-to-complete-mocks  Response has x-microcks-ref 'center-south' but it doesn't match input example  paths./forecast/{region}.delete.responses
 126:17  warning  microcks-examples-fragments-to-complete-mocks  Path parameter example 'center' is not used in any response                    paths./forecast/{region}.delete.responses

✖ 7 problems (1 error, 6 warnings, 0 infos, 0 hints)
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


 INFO  Located custom javascript function: 'oas-verify-mocks-vacuum'
 INFO  Located custom javascript function: 'oas-verify-mocks'
  ERROR   Failed to load function 'oas-verify-mocks': SyntaxError: SyntaxError: (anonymous): Line 16:1 Unexpected reserved word (and 17 more errors)
 INFO  Loaded 2 custom function(s) successfully.
 INFO  Linting file 'resources/weather-forecast-openapi-bad.yaml' against 5 rules: https://quobix.com/vacuum/rulesets/no-rules

2024/05/15 13:59:33 
2024/05/15 13:59:33 🚨 Response example 'unknown' for 'GetForecast' is incomplete, it has no matching input example.
2024/05/15 13:59:33    It requires at least one requestBody or parameter example with same name to be considered as valid mock for Microcks.
2024/05/15 13:59:33 
2024/05/15 13:59:33 🔗 Response has x-microcks-ref 'center-south' for 'DeleteForecast' but it doesn't match input example.
2024/05/15 13:59:33    It requires at least one requestBody or parameter example with same name to be considered as valid mock for Microcks.
2024/05/15 13:59:33 
2024/05/15 13:59:33 ℹ️  Path parameter example 'center' for 'DeleteForecast' is not used in any response.
2024/05/15 13:59:33    It requires to have a matching response example or a x-microcks-ref to be considered as valid mock for Microcks.

/Users/laurent/Development/github/microcks-spectral-ruleset/resources/weather-forecast-openapi-bad.yaml
-------------------------------------------------------------------------------------------------------
Location                                           | Severity | Message                                                                       | Rule                                          | Category   | Path
resources/weather-forecast-openapi-bad.yaml:17:7   | warning  | Response example 'unknown' is incomplete, it has no matching input example    | microcks-examples-fragments-to-complete-mocks | Validation | $.paths.*.*
resources/weather-forecast-openapi-bad.yaml:40:11  | info     | Parameters should have examples                                               | microcks-examples-in-parameter                | Validation | $..parameters[0][1]
resources/weather-forecast-openapi-bad.yaml:83:17  | warning  | expected number, but got string                                               | oas3-valid-schema-example                     | Examples   | $.paths['/forecast/{region}'].get.responses['200'].content['...
resources/weather-forecast-openapi-bad.yaml:103:13 | warning  | Request with content must have examples                                       | microcks-examples-in-request-content          | Validation | $.paths..requestBody..content.*
resources/weather-forecast-openapi-bad.yaml:110:15 | warning  | Response with content must have examples                                      | microcks-examples-in-response-content         | Validation | $.paths..responses..content.*
resources/weather-forecast-openapi-bad.yaml:113:7  | warning  | Response has x-microcks-ref 'center-south' but it doesn't match input example | microcks-examples-fragments-to-complete-mocks | Validation | $.paths.*.*
resources/weather-forecast-openapi-bad.yaml:113:7  | warning  | Path parameter example 'center' is not used in any response                   | microcks-examples-fragments-to-complete-mocks | Validation | $.paths.*.*

Category   | Errors | Warnings | Info
Validation | 0      | 5        | 1
Examples   | 0      | 1        | 0

                                                                     
          Linting passed, but with 6 warnings and 1 informs          
                                                                     
```

## Rules reference

### Reused excternal rules

THe Microcks ruleset imports the `oas3-valid-media-example` and `oas3-valid-schema-example` rules from the [Spectral OpenAPI Rules](https://meta.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules).

These rules check that the `examples` definitions are conformant to the schema definition with the API specification. Having incorrect values or types will not prevent Microcks to produce mocks but these ones will be totally useless for people wanted to have a high-felidelitty simulation of the API.

**Severity:** `error`

### microcks-examples-in-required-parameter

This rule will ask you to provide named `examples` for parameters marqued as required.

Putting named `examples` in parameters allows you to explicit values of parameters depending on different situation and then to later bind them with corresponding request body or response. This provide a better overview of the expected behavior of your API for people who will discover it. Not providing these examples prevents Microcks from producing correct and representative mocks.

**Severity:** `warn`

### microcks-examples-in-optional-parameter

This rule will recommend you to provide named `examples` for parameters marqued as optional.

Putting named `examples` in parameters allows you to explicit values of parameters depending on different situation and then to later bind them with corresponding request body or response. This provide a better overview of the expected behavior of your API for people who will discover it.

**Severity:** `info`

### microcks-examples-in-request-content

This rule will ask you to provide named `examples` within `requestBody.content.*`.

Putting named `examples` in request content allows you to explicit payload depending on different situation and then to later bind them with corresponding response. This provide a better overview of the expected behavior of your API for people who will discover it. Not providing these examples prevents Microcks from producing mocks.

**Severity:** `warn`

### microcks-examples-in-response-content

This rule will ask you to provide named `examples` within `responses.*.content.*`.

Putting named `examples` in response content allows you to explicit payload depending on different situation and then to later bind them with corresponding request body or parameter values. This provide a better overview of the expected behavior of your API for people who will discover it. Not providing these examples prevents Microcks from producing mocks.

**Severity:** `warn`

### microcks-examples-fragments-to-complete-mocks

**Severity:** `warn`

This rule will check the coherence of different response, request and parameter examples to detect incomplete combination.