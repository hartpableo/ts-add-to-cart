export class State<T extends object> {
  #data: Partial<T> = {};

  get<K extends keyof T>(key: K): T[K] | undefined {
    return this.#data[key];
  }

  set<K extends keyof T>(key: K, value: T[K]): void {
    this.#data[key] = value;
  }

  all(): Readonly<Partial<T>> {
    return { ...this.#data };
  }
}
