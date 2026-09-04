import { Fountain } from 'fountain-js';

export interface ScriptStats {
  wordCount: number;
  sceneCount: number;
  estimatedPages: number;
  estimatedMinutes: number;
}

const fountain = new Fountain();
const LINES_PER_PAGE = 55; // standard screenplay formatting heuristic

export function computeStats(source: string): ScriptStats {
  const wordCount = source.trim() ? source.trim().split(/\s+/).length : 0;

  const output = fountain.parse(source, true); // include tokens
  const sceneCount = (output.tokens ?? []).filter(
    (t) => t.type === 'scene_heading',
  ).length;

  // Approximate rendered line count from the script body text (strip HTML tags).
  const plainScript = output.html.script.replace(/<[^>]+>/g, '\n');
  const lineCount = plainScript
    .split('\n')
    .filter((l) => l.trim().length > 0).length;

  const estimatedPages =
    Math.max(1, Math.round(lineCount / LINES_PER_PAGE)) || 0;
  const estimatedMinutes = estimatedPages; // 1 page ≈ 1 minute, standard heuristic

  return {
    wordCount,
    sceneCount,
    estimatedPages: source.trim() ? estimatedPages : 0,
    estimatedMinutes: source.trim() ? estimatedMinutes : 0,
  };
}
