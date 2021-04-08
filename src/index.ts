import { EventEmitter } from "events";

export class LookAheadStore<K extends string, V> {
  public store: Map<K, V>;
  private eventBus: EventEmitter;
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
        this.eventBus.once(key, resolve);
      });
    }
  }
}
