/**
 * Converts bytes to KB when more than 1024
 * @param bytes - The number of bytes to convert
 * @returns A string representation of the size in B or KB
 */
export function convertToKB(bytes: number): string {
  if (bytes > 1024) {
    return `${(bytes / 1024).toFixed(2)}KBs`;
  }
  return `${bytes}Bs`;
}
