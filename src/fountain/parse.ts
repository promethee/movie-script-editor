import { Fountain } from 'fountain-js';

export interface ParsedScript {
  title: string;
  html: string;
  titlePageHtml: string;
}

const fountain = new Fountain();

export function parseFountain(source: string): ParsedScript {
  const output = fountain.parse(source);
  return {
    title: output.title || '',
    html: output.html.script,
    titlePageHtml: output.html.title_page || '',
  };
}
