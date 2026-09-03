import { describe, it, expect } from 'vitest';
import { parseFountain } from './parse';

describe('parseFountain', () => {
  it('extracts the title from title-page metadata', () => {
    const source = 'Title: My Script\nAuthor: Jane Doe\n\nFADE IN:';
    const result = parseFountain(source);
    expect(result.title).toBe('My Script');
  });

  it('renders a scene heading as an h3', () => {
    const result = parseFountain('INT. HOUSE - DAY');
    expect(result.html).toContain('<h3>');
    expect(result.html).toContain('INT. HOUSE - DAY');
  });

  it('renders a transition right-aligned via h2', () => {
    const result = parseFountain('CUT TO:');
    expect(result.html).toContain('<h2>');
  });

  it('returns empty html for empty input', () => {
    const result = parseFountain('');
    expect(result.html).toBe('');
  });
});
