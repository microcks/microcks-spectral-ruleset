const { retrieveDocument, setupSpectral, getErrors } = require('@jamietanna/spectral-test-harness')

describe('OpenAPI v3', () => {
  test('Bad OpenAPI document analysis', async () => {
    const spectral = await setupSpectral('microcks-rules.yaml')
    // spectral-test-harness expects document in test/testdata, we have to go up twice.
    const document = retrieveDocument('../../resources/weather-forecast-openapi-bad.yaml')

    const results = await spectral.run(document)
    const errors = getErrors(results)
    //const warnings = resultsForSeverity(results, 1)

    expect(results).toHaveLength(9)
    expect(errors).toHaveLength(1)
  })

  test('Valid OpenAPI document analysis', async () => {
    const spectral = await setupSpectral('microcks-rules.yaml')
    // spectral-test-harness expects document in test/testdata, we have to go up twice.
    const document = retrieveDocument('../../resources/weather-forecast-openapi.yaml')

    const results = await spectral.run(document)
    
    expect(results).toHaveLength(0)
  })
})
