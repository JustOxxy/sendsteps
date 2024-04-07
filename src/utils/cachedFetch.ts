const CACHE = new Map<string, unknown>();

export const cachedFetch = <T extends object>(input: string | URL, init?: RequestInit | undefined) => {
  if (CACHE.has(input.toString())) {
    return new Promise<T>((resolve) => resolve(CACHE.get(input.toString()) as T));
  }

  return new Promise<T>((resolve, reject) => {
    fetch(input, init)
      .then((resp) => resp.json() as T)
      .then((data) => {
        CACHE.set(input.toString(), data);
        return resolve(data);
      })
      .catch((error) => reject(error));
  });
};
