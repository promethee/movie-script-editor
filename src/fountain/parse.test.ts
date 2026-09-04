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

describe('parseFountain - title page separation', () => {
  const source = [
    'Title: My Script',
    'Credit: written by',
    'Author: Jane Doe',
    'Source: based on a story by John Smith',
    'Notes: A tense thriller about betrayal and loyalty.',
    '',
    'FADE IN:',
    '',
    'INT. HOUSE - DAY',
    '',
    'A quiet room.',
  ].join('\n');

  it('places title-page fields only in titlePageHtml, never in script html', () => {
    const { html, titlePageHtml } = parseFountain(source);

    expect(titlePageHtml).toContain('My Script');
    expect(titlePageHtml).toContain('Jane Doe');
    expect(titlePageHtml).toContain('betrayal and loyalty');

    expect(html).not.toContain('My Script');
    expect(html).not.toContain('Jane Doe');
    expect(html).not.toContain('betrayal and loyalty');
  });

  it('still renders script body content in html', () => {
    const { html } = parseFountain(source);
    expect(html).toContain('INT. HOUSE - DAY');
    expect(html).toContain('A quiet room.');
  });

  it('extracts the title separately for filename use', () => {
    const { title } = parseFountain(source);
    expect(title).toBe('My Script');
  });
});
