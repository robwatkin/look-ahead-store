// type ResolveMethod = new (value: string | PromiseLike<string>) => void;

interface Store extends Record<string, unknown> {
  [index: string]: unknown | ((value: unknown | PromiseLike<unknown>) => void);
}

export class LookAheadStore<V> {
  public store: Store;

  constructor() {
    this.store = {};
  }

  public put(key: string, value: V): void {
    if (value === undefined) {
      throw new Error(`LookAheadStore.put id: ${key} value is undefined`);
    }

    if (this.store[key]) {
      if (typeof this.store[key] === "string") {
        throw new Error(`key [${key}] already in store`);
      } else {
        const resolve = this.store[key] as (value: V | PromiseLike<V>) => void;
        resolve(value);
      }
    }
    this.store[key] = value;
  }

  public async get(key: string): Promise<V> {
    if (typeof this.store[key] === "string") {
      // console.log("byKey[key] typeof string");
      return new Promise<V>(resolve => {
        // console.log(`------------ resolve ${key} :: ${byKey[key]}`);
        resolve(this.store[key] as V);
      });
    }

    return new Promise<V>(resolve => {
      // console.log("+++++++++++++");
      this.store[key] = resolve;
    });
  }
}
