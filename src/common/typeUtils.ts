
export type OneOfKey<T extends Record<string, any>> = {
  [K in keyof T]:
  & Partial<Record<Exclude<keyof T, K>, undefined>>
  & Record<K, T[K]>
}[keyof T]

export type OneOfKeyWithEmpty<T extends Record<string, any>> =
  | OneOfKey<T>
  | Partial<Record<keyof T, undefined>>;
