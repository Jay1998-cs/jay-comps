export type KeyType = string | number;
type ValueType = [number, any]; // [times, realValue]

const SPLIT = "%";

/**
 * @description connect key with 'SPLIT'
 */
export function pathKey(keys: KeyType[]) {
  return keys.join(SPLIT ?? "%");
}

/**
 * @description CacheEntity based on Map
 * @constructor (instanceId), entity identifier
 */
class CacheEntity {
  instanceId: string;
  constructor(instanceId: string) {
    this.instanceId = instanceId;
  }

  /** @private internal cache map, do not access directlt */
  private cache = new Map<string, ValueType>();

  opGet(keyPathStr: string): ValueType | null {
    return this.cache.get(keyPathStr) || null;
  }

  get(keys: KeyType[]): ValueType | null {
    return this.opGet(pathKey(keys));
  }

  opUpdate(
    keyPathStr: string,
    valueFn: (origin: ValueType | null) => ValueType | null
  ) {
    const prevValue = this.cache.get(keyPathStr)!;
    const nextValue = valueFn(prevValue);

    if (nextValue === null) {
      this.cache.delete(keyPathStr);
    } else {
      this.cache.set(keyPathStr, nextValue);
    }
  }

  update(
    keys: KeyType[],
    valueFn: (origin: ValueType | null) => ValueType | null
  ) {
    return this.opUpdate(pathKey(keys), valueFn);
  }
}

export default CacheEntity;
