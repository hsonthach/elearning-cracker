export type Optional<T> = T | null;

export type Immutable<T> = {
  readonly [K in keyof T]: Immutable<T[K]>;
};

export type CheckFunc<T> = (value: T) => boolean;

export type Struct = {
  [any: string]: any;
};
