/**
 * Get the name of an enum, postfixed with '_enum'.
 *
 * @param name
 */
export function getEnumName(name: string): string {
  return `${name}_enum`;
}

/**
 * Generate a query to create an enum type in the db.
 *
 * @param name Name of the enum, in lowercase
 * @param enumObject The enum type itself
 */
export function generateEnumQuery(
  op: 'drop' | 'create',
  name: string,
  values?: string[]
): string {
  const enumName = getEnumName(name);

  if (op === 'drop') {
    return `DROP TYPE IF EXISTS ${enumName}`;
  }

  return `CREATE TYPE ${enumName} AS ENUM ('${values.join("', '")}');`;
}
