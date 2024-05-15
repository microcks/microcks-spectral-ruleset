# Microcks Spectral ruleset

A set of rules for Spectral that allows linting OpenAPI and AsyncAPI spec for Microcks conventions.

[![License](https://img.shields.io/github/license/microcks/microcks-testcontainers-java?style=for-the-badge&logo=apache)](https://www.apache.org/licenses/LICENSE-2.0)
[![Project Chat](https://img.shields.io/badge/discord-microcks-pink.svg?color=7289da&style=for-the-badge&logo=discord)](https://microcks.io/discord-invite/)

## Build Status

Latest released version is `0.0.1`.

Current development version is `0.0.2`.

## How to use it?


```shell
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