import { Fountain } from 'fountain-js';

export interface ParsedScript {
  title: string;
  html: string;
}

const fountain = new Fountain();

export function parseFountain(source: string): ParsedScript {
  const output = fountain.parse(source); // no token flag needed anymore
  return {
    title: output.title,
    html: output.html.script,
  };
}
