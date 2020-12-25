export function* dataFaker<F extends string>(fields: F[], maxSuffix: number = 100): Generator<{ [k in F]: string }>  {
  while (true) {
    const entries = fields.map(field => [field, fakeFieldValue(field, maxSuffix)])
    yield Object.fromEntries(entries)
  }
}

function fakeFieldValue(field: string, maxSuffix: number): string {
  return `${field}${Math.floor(Math.random() * maxSuffix)}`
}
