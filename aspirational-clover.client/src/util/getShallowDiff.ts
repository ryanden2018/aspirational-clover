export function getShallowDiff<T extends object>(initial: T, target: T): Partial<T> {
  const patch: Partial<T> = {};
  const allKeys = new Set<string>(...Object.keys(initial), ...Object.keys(target)) as Set<keyof T>;
  for (const key of allKeys) {
    if (target[key] !== initial[key]) {
      patch[key] = target[key];
    }
  }
  return patch;
}
