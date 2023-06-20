import { fileURLToPath } from "url";
import { basename, dirname } from "path";

export const __dirnameFromImportMeta = (
  meta: ImportMeta,
) => dirname(fileURLToPath(meta.url));
export const __filenameFromImportMeta = (
  meta: ImportMeta,
) => basename(fileURLToPath(meta.url));

export async function prismaUpsertRetry<
  T extends {
    upsert: (...args: any[]) => Promise<any>,
  },
>(model: T, ...args: Parameters<T['upsert']>): Promise<Awaited<ReturnType<T['upsert']>>> {
  while (true) {
    const result = await model.upsert(...args)
      .catch((err: Error) => err);
    if (
      result instanceof Error
      && 'code' in result
      && typeof result.code === 'string'
      && [ // https://www.prisma.io/docs/reference/api-reference/error-reference
        'P2002', // "Unique constraint failed on the {constraint}"
        'P2003', // "Foreign key constraint failed on the field: {field_name}"
        'P2024', // "A constraint failed on the database: {database_error}"
      ].indexOf(result.code) !== -1
    ) continue;
    if (result instanceof Error)
      throw result;
    return result as Awaited<ReturnType<T['upsert']>>;
  }
}
