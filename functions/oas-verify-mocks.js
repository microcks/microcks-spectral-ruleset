/*
 * Copyright The Microcks Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { createRulesetFunction } from '@stoplight/spectral-core';

export default createRulesetFunction(
  {
    input: null,
    options: null,
  },
  function oasVerifyMocks(operation, options, context) {
    const results = [];

    // Collection prerequisites elements.
    let requestsExamples = collectRequestExampleNames(operation);
    let pathParametersExamples = collectParameterExampleNames(operation, 'path');
    let queryParametersExamples = collectParameterExampleNames(operation, 'query');
    let headerParametersExamples = collectParameterExampleNames(operation, 'header');

    // Now see if we can build complete responses.
    let responsesExamples = collectResponseExampleNames(operation);
    
    // Consider the responses with content.
    responsesExamples.forEach(example => {
      if (!requestsExamples.includes(example) && !pathParametersExamples.includes(example) && 
          !queryParametersExamples.includes(example) && !headerParametersExamples.includes(example)) {

        results.push({
          message: `Response example '${example}' is incomplete, it has no matching input example`,
          path: [...context.path, 'responses']
        })

        console.warn(`\n\ud83d\udea8 Response example '${example}' for '${context.path.join('.')}' is incomplete, it has no matching input example.`);
        console.warn('   It requires at least one requestBody or parameter example with same name to be considered as valid mock for Microcks.');
      }
    });

    // Now consider the responses that may have no content checking the x-microcks-ref.
    if (operation.responses) {
      Object.keys(operation.responses).forEach(code => {
        
        if (!operation.responses[code].content && operation.responses[code]['x-microcks-ref']) {
          operation.responses[code]['x-microcks-ref'].forEach(microcksRef => {
            
            if (!requestsExamples.includes(microcksRef) && !pathParametersExamples.includes(microcksRef) && 
                !queryParametersExamples.includes(microcksRef) && !headerParametersExamples.includes(microcksRef)) {
            
              results.push({
                message: `Response has x-microcks-ref '${microcksRef}' but it doesn't match input example`,
                path: [...context.path, 'responses']
              })

              console.warn(`\n\ud83d\udd17 Response has x-microcks-ref '${microcksRef}' for '${context.path.join('.')}' but it doesn't match input example.`)
              console.warn('   It requires at least one requestBody or parameter example with same name to be considered as valid mock for Microcks.');
            }
          })
        } 
      });
    }

    // Do reverse thing, check parameter examples that may not be used in response.
    pathParametersExamples.forEach(param => {
      if (!responsesExamples.includes(param)) {

        results.push({
          message: `Path parameter example '${param}' is not used in any response`,
          path: [...context.path, 'responses']
        })

        console.warn(`\n\u2139\ufe0f  Path parameter example '${param}' for '${context.path.join('.')}' is not used in any response.`)
        console.warn('   It requires to have a matching response example or a x-microcks-ref to be considered as valid mock for Microcks.');
      }
    });

    return results;
  },
);

/** Extract all response examples names for operation. */
function collectResponseExampleNames(operation) {
  let responsesExamples = [];
  if (operation.responses) {
    Object.keys(operation.responses).forEach(code => {

      if (operation.responses[code].content) {
        Object.keys(operation.responses[code].content).forEach(content => {

          if (operation.responses[code].content[content].examples) {
            let responseExamples = operation.responses[code].content[content].examples;

            Object.keys(responseExamples).forEach(example => {
              responsesExamples.push(example);
            });
          }
        })
      }
    });
  }
  return responsesExamples;
}

/** Extract all parameters examples names for operation. */
function collectParameterExampleNames(operation, type) {
  let parametersExamples = [];

  if (operation.parameters) {
    operation.parameters.forEach(parameter => {
      if (parameter.in === type && parameter.examples) {

        Object.keys(parameter.examples).forEach(example => {
          parametersExamples.push(example);
        })
      }
    })
  }
  return parametersExamples;
}

/** Extract all request bodies examples names for operation. */
function collectRequestExampleNames(operation) {
  let requestBodiesExamples = [];

  if (operation.requestBody) {
    Object.keys(operation.requestBody).forEach(content => {

      if (operation.requestBody[content].examples) {
        let requestBodiesExamples = operation.requestBody[content].examples;

        Object.keys(requestBodiesExamples).forEach(example => {
          requestBodiesExamples.push(example);
        });
      }
    });
  }
  return requestBodiesExamples;
}