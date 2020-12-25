export function* take<T>(gen: Generator<T>, count: number): Generator<T> {
  let done = false
  while (count --> 0 && !done) {
    const next = gen.next()
    done = !!next.done
    yield next.value
  }
}
