import Ajv from 'ajv/dist/2020.js'

const ajv = new Ajv.default()
const schema = {
  type: 'array'
, items: {
    type: 'string'
  }
}

export function validateList(data: unknown): asserts data is string[] {
  const valid = ajv.validate(schema, data)
  if (!valid) throw new Error(ajv.errorsText())
}
