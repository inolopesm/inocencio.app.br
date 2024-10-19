export function getItemOrThrow<T>(array: T[], index: number): T {
  const item = array[index];
  if (item === undefined) throw new Error("Index out of bounds");
  return item;
}
