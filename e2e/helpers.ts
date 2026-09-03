import { _electron as electron, ElectronApplication } from 'playwright';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function freshUserDataDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'fountain-editor-e2e-'));
}

export async function launchApp(
  userDataDir: string,
): Promise<ElectronApplication> {
  return electron.launch({
    args: [
      path.join(__dirname, '../dist-electron/main.js'),
      `--user-data-dir=${userDataDir}`,
    ],
  });
}
