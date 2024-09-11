import { convertToKB } from './size-converter.util';

describe('convertToKB', () => {
  it('should return bytes when less than or equal to 1024', () => {
    expect(convertToKB(0)).toBe('0Bs');
    expect(convertToKB(1)).toBe('1Bs');
    expect(convertToKB(1024)).toBe('1024Bs');
  });

  it('should convert to KB when more than 1024 bytes', () => {
    expect(convertToKB(1025)).toBe('1.00KBs');
    expect(convertToKB(2048)).toBe('2.00KBs');
    expect(convertToKB(1536)).toBe('1.50KBs');
  });

  it('should round to two decimal places', () => {
    expect(convertToKB(1500)).toBe('1.46KBs');
    expect(convertToKB(2000)).toBe('1.95KBs');
    expect(convertToKB(3072)).toBe('3.00KBs');
  });

  it('should handle large numbers', () => {
    expect(convertToKB(1048576)).toBe('1024.00KBs');
    expect(convertToKB(1073741824)).toBe('1048576.00KBs');
  });
});
