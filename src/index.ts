// type ResolveMethod = new (value: string | PromiseLike<string>) => void;

interface LookAhead extends Record<string, unknown> {
  putValue: (key: number, value: string) => void;
  getValue: (key: number) => Promise<string>;
}

interface LookAheadStore extends Record<string, unknown> {
  [index: number]: string | ((value: string | PromiseLike<string>) => void);
}

export const lookAheadFactory = (): LookAhead => {
  const byKey: LookAheadStore = {};

  const putValue = (key: number, value: string) => {
    // console.log(`putValue ${key} :: ${value}`);
    if (byKey[key]) {
      if (typeof byKey[key] === 'string') {
        throw new Error(`key [${key}] already in store`);
      } else {
        const resolve = byKey[key] as (value: string | PromiseLike<string>) => void;
        resolve(value);
      }
    }
    byKey[key] = value;
  };

  const getValue = (key: number): Promise<string> => {
    // console.log(`getValue key: ${key} byKey[key]: ${byKey[key]}`);

    if (typeof byKey[key] === 'string') {
      // console.log("byKey[key] typeof string");
      return new Promise<string>((resolve) => {
        // console.log(`------------ resolve ${key} :: ${byKey[key]}`);
        resolve(byKey[key] as string);
      });
    }

    return new Promise<string>((resolve) => {
      // console.log("+++++++++++++");
      byKey[key] = resolve;
    });
  };

  return { putValue, getValue };
};
