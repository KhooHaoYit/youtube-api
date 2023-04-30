import {
  ZodArray,
  ZodBoolean,
  ZodEnum,
  ZodNull,
  ZodNumber,
  ZodObject,
  ZodString,
  ZodTuple,
  ZodTypeAny,
  ZodUnion,
  z,
} from "zod";
import '@total-typescript/ts-reset';

export type DeepReadOnly<T> = { readonly [key in keyof T]: DeepReadOnly<T[key]> };
export type DeepMutable<T> = { -readonly [key in keyof T]: DeepMutable<T[key]> };

type Callback = (data: unknown) => ZodTypeAny;
type Options =
  | Callback
  | { [property: string]: Callback | undefined };

export function buildSchema(data: unknown, options: Options = {}): ZodTypeAny {
  if (typeof options === 'function') {
    return options(data);
  }
  if (typeof data === 'boolean') return z.boolean();
  if (typeof data === 'string') return z.string();
  if (typeof data === 'number') return z.number();
  if (data === null) return z.null();
  if (Array.isArray(data)) {
    const schemas: ZodTypeAny[] = [];
    for (const val of data) {
      // if (schemas.some(schema => schema.safeParse(val).success)) continue;
      // Might need to access options[]
      schemas.push(buildSchema(val, options));
    }
    return z.tuple(schemas as [] | [ZodTypeAny, ...ZodTypeAny[]]);
    // if (schemas.length === 0)
    //   return z.tuple([]);
    // if (schemas.length === 1)
    //   return schemas[0].array();
    // return z.union(schemas as [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]]).array();
  }
  if (typeof data === 'object') {
    const output = {} as Record<string, ZodTypeAny>;
    for (const [k, v] of Object.entries(data)) {
      const newOption = options[k] || Object.fromEntries(
        Object.entries(options)
          .map(([property, option]) => {
            if (property.startsWith(k))
              return [property.replace(k, '').replace(/^\./, ''), option];
            return null;
          })
          .filter(Boolean)
      ) as Options;
      output[k] = buildSchema(v, newOption);
    }
    return z.object(output);
  }
  throw typeof data;
}

export function schemaToCode(data: ZodTypeAny): string {
  if (data instanceof ZodBoolean) return 'boolean';
  if (data instanceof ZodString) return 'string';
  if (data instanceof ZodNumber) return 'number';
  if (data instanceof ZodNull) return 'null';
  if (data instanceof ZodTuple)
    return `readonly [\n${data.items.map((item: ZodTypeAny) => schemaToCode(item)).join(',\n') || ''}\n]`;
  if (data instanceof ZodObject) {
    const output = [] as string[];
    for (const [k, v] of Object.entries(data.shape) as [string, ZodTypeAny][]) {
      output.push(`readonly ${/[\- @:]/.test(k) ? `'${k}'` : k}: ${schemaToCode(v)}`);
    }
    return `{\n${output.join(',\n')}\n}`;
  }
  // if (data instanceof ZodArray) {
  //   return `${schemaToCode(data.element)}[]`;
  // }
  // if (data instanceof ZodUnion) {
  //   return `(${data.options.map((option: ZodTypeAny) => schemaToCode(option)).join('|\n')})`;
  // }
  // if (data instanceof ZodEnum) {
  //   const enums = data.options as string[];
  //   return `(${enums.map(e => JSON.stringify(e)).join('|\n')})`;
  // }
  throw data;
}
