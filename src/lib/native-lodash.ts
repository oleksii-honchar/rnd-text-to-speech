import type { StringIndex } from 'types';

function pick(object: StringIndex, keys: string[]) {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // @ts-expect-error - We know this is a valid StringIndex
      obj[key] = object[key];
    }
    return obj;
  }, {});
}

type Settable = StringIndex | unknown[];
type Key = string | number;

function set(object: Settable, path: string, value: unknown): void {
  const keys = path.split('.');
  let current: Settable = object;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i] as Key;
    if (!(key! in current)) {
      // Check if the next key is a number
      const nextKey = keys[i + 1] as Key;
      // @ts-expect-error - We know this is a valid StringIndex or array
      current[key] = /^\d+$/.test(nextKey) ? [] : {};
    }
    // @ts-expect-error - We know this is a valid StringIndex or array
    current = current[key];
  }

  const lastKey = keys[keys.length - 1] as Key;
  // @ts-expect-error - We know this is a valid StringIndex or array
  current[lastKey] = value;
}

function get(obj: Settable, path: string, defaultValue = undefined) {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      // @ts-expect-error - We know this is a valid StringIndex or array
      .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : result;
}

export const nl = {
  pick,
  get,
  set,
};
