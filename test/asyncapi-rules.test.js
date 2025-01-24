const { retrieveDocument, setupSpectral, getErrors } = require('@jamietanna/spectral-test-harness')

describe('AsyncAPI v3', () => {
  test('Bad AsyncAPI document analysis', async () => {
    const spectral = await setupSpectral('microcks-rules.yaml')
    // spectral-test-harness expects document in test/testdata, we have to go up twice.
    const document = retrieveDocument('../../resources/petstore-asyncapi-v3-bad.yaml')

    const results = await spectral.run(document)
    const errors = getErrors(results)
    //const warnings = resultsForSeverity(results, 1)

    expect(results).toHaveLength(3)
    expect(errors).toHaveLength(0)
  })

  test('Valid AsyncAPI document analysis', async () => {
    const spectral = await setupSpectral('microcks-rules.yaml')
    // spectral-test-harness expects document in test/testdata, we have to go up twice.
    const document = retrieveDocument('../../resources/petstore-asyncapi-v3.yaml')

    const results = await spectral.run(document)
    
    expect(results).toHaveLength(0)
  })
})
