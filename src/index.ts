import { EventEmitter } from "events";

export class LookAheadStore<K extends string, V = unknown> {
  public store: Map<K, V>;
  protected eventBus: EventEmitter;
  public unresolved: Set<K> = new Set();

  constructor() {
    this.store = new Map();
    this.eventBus = new EventEmitter();
    this.eventBus.setMaxListeners(0);
  }

  public put(key: K, value: V): void {
    if (value === undefined) {
      throw new Error(`LookAheadStore.put id: ${key} value is undefined`);
    }

    if (this.store.has(key)) {
      throw new Error(`key [${key}] already in store`);
    } else {
      this.store.set(key, value);
      this.eventBus.emit(key, value);
    }
  }

  public async get(key: K): Promise<V> {
    if (this.store.has(key)) {
      return this.store.get(key) as V;
    } else {
      return new Promise(resolve => {
        this.unresolved.add(key);
        this.eventBus.once(key, val => {
          this.unresolved.delete(key);
          resolve(val);
        });
      });
    }
  }

  /**
   * Force resolve any hanging promises,
   * @param resolveValue defaults to `undefined`
   */
  public forceResolve(resolveValue?: unknown): void {
    this.unresolved.forEach(key => this.eventBus.emit(key, resolveValue))
  }
}
