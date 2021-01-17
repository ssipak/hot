export function * range (start: number, end: number, step = 1): Generator<number> {
  if (step <= 0) {
    throw new Error('Step must be a positive number');
  }
  while (start < end) {
    yield start;
    start += step;
  }
}

export function debounce (fn: () => void, delay: number): () => void {
  let timeout: null | number = null;
  return function (...args: unknown[]) {
    if (timeout === null) {
      timeout = window.setTimeout(() => {
        timeout = null;
        fn.apply(args);
      }, delay);
    }
  };
}

export function deepCopy<T> (data: T): T {
  if (Array.isArray(data)) {
    return data.map(deepCopy) as unknown as T;
  } else if (typeof data === 'object') {
    if (data === null) {
      return data;
    }
    const entries = Object.entries(data)
      .map(([key, value]) => [key, deepCopy(value)] as [string, unknown]);

    return Object.fromEntries(entries) as unknown as T;
  } else {
    return data;
  }
}

export function deepEqual (a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }

    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) {
        return false;
      }
    }

    return true;
  }

  if (typeof a === 'object' && typeof b === 'object') {
    if (a === null || b === null) {
      return false;
    }

    const aKeys = new Set(Object.keys(a));
    const bKeys = new Set(Object.keys(b));

    if (aKeys.size !== bKeys.size) {
      return false;
    }

    const allKeys = new Set([...aKeys, ...bKeys]);

    if (allKeys.size !== aKeys.size) {
      return false;
    }

    for (const key of allKeys) {
      const aValue = (a as Record<string, unknown>)[key];
      const bValue = (b as Record<string, unknown>)[key];
      if (!deepEqual(aValue, bValue)) {
        return false;
      }
    }

    return true;
  }

  return false;
}
