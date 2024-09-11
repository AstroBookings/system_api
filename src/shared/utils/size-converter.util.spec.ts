import { convertToKB } from './size-converter.util';

describe('convertToKB', () => {
  it('should return bytes when less than or equal to 1024', () => {
    expect(convertToKB(0)).toBe('0 B');
    expect(convertToKB(1)).toBe('1 B');
    expect(convertToKB(1024)).toBe('1024 B');
  });

  it('should convert to KB when more than 1024 bytes', () => {
    expect(convertToKB(1025)).toBe('1.00 KB');
    expect(convertToKB(2048)).toBe('2.00 KB');
    expect(convertToKB(1536)).toBe('1.50 KB');
  });

  it('should round to two decimal places', () => {
    expect(convertToKB(1500)).toBe('1.46 KB');
    expect(convertToKB(2000)).toBe('1.95 KB');
    expect(convertToKB(3072)).toBe('3.00 KB');
  });

  it('should handle large numbers', () => {
    expect(convertToKB(1048576)).toBe('1024.00 KB');
    expect(convertToKB(1073741824)).toBe('1048576.00 KB');
  });
});
