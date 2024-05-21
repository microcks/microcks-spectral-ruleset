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
  function aasVerifyMocks(channel, options, context) {
    const results = [];

    const hints = (process.env.MICROCKS_HINTS === 'true') || false;

    // Only if channel has parameters.
    if (channel.parameters) {

      // Collect prerequisites elements.
      let parametersExamples = collectParameterExampleNames(channel);

      // Now see if we can build complete messages.
      let messagesExamples = collectMessageExampleNames(channel);

      // Consider the responses with content.
      messagesExamples.forEach(example => {
        if (!parametersExamples.includes(example)) {

          results.push({
            message: `\ud83d\udea8 Message example '${example}' is incomplete, it has no matching parameter example. It requires at least one with same name to be considered as valid mock for Microcks.`,
            path: [...context.path, 'parmaeters']
          })

          if (hints) {
            console.warn(`\n\ud83d\udea8 Message example '${example}' for '${context.path.join('.')}' is incomplete, it has no matching parameter example.`);
            console.warn('  It requires at least one with same name to be considered as valid mock for Microcks.');
          }
        }
      });

      // Do reverse thing, check parameter examples that may not be used in message.
      parametersExamples.forEach(param => {
        if (!messagesExamples.includes(param)) {

          results.push({
            message: `\u2139\ufe0f  Path parameter example '${param}' is not used in any message. It requires to have a matching message example to be considered as valid mock for Microcks.`,
            path: [...context.path, 'messages']
          })

          if (hints) {
            console.warn(`\n\u2139\ufe0f  Path parameter example '${param}' for '${context.path.join('.')}' is not used in any message.`)
            console.warn('   It requires to have a matching message example to be considered as valid mock for Microcks.');
          }
        }
      });
    }
    
    return results;
  },
);

/** Extract all message examples names for channel. */
function collectMessageExampleNames(channel) {
  let messagesExamples = [];
  
  // First collect operations.
  let operations = [];
  if (channel.subscribe) {
    operations.push(channel.subscribe);
  }
  if (channel.publish) {
    operations.push(channel.publish);
  } 

  operations.forEach(operation => {
    if (operation.message.examples) {
      let examples = operation.message.examples;

      examples.forEach(example => {
        if (example.name) {
          messagesExamples.push(example.name);
        }
      })
    }
  });

  return messagesExamples;
}

/** Extract all parameters examples names for channel. */
function collectParameterExampleNames(channel) {
  let parametersExamples = [];

  Object.keys(channel.parameters).forEach(parameterName => {
    
    let parameter = channel.parameters[parameterName];

    if (parameter.schema && parameter.schema.examples) {
      Object.keys(parameter.schema.examples).forEach(example => {
        parametersExamples.push(example);
      })
    }
  });

  return parametersExamples;
}