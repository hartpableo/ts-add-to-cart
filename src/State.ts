class State {
  #data: Record<string, any> = {}

  get = (key: string): any => {
    return this.#data[key] ?? null
  }

  set = (key: string, value: any): void => {
    this.#data[key] = value
  }

  all = (): Record<string, any> => {
    return this.#data
  }
}

export {State}