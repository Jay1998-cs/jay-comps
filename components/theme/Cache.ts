export type KeyType = string | number;
export type ValueType = [number, any]; // [times, realValue]
export type ValueFnType = (origin: ValueType | null) => ValueType | null;

const SPLIT = "%";

/**
 * @description connect key with 'SPLIT'
 */
export function genPathKey(keys: KeyType[]) {
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

  private opGet(keyPathStr: string): ValueType | null {
    return this.cache.get(keyPathStr) || null;
  }

  get(keys: KeyType[]): ValueType | null {
    return this.opGet(genPathKey(keys));
  }

  private opUpdate(keyPathStr: string, valueFn: ValueFnType) {
    const prevValue = this.cache.get(keyPathStr)!;
    const nextValue = valueFn(prevValue);

    if (nextValue === null) {
      this.cache.delete(keyPathStr);
      console.error("删除缓存：", this.cache);
    } else {
      this.cache.set(keyPathStr, nextValue);
    }
  }

  update(
    keys: KeyType[],
    valueFn: (origin: ValueType | null) => ValueType | null
  ) {
    return this.opUpdate(genPathKey(keys), valueFn);
  }
}

export default CacheEntity;
