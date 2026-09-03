import { test, expect } from '@playwright/test';
import { launchApp, freshUserDataDir } from './helpers';

test('launches with a blank editor', async () => {
  const userDataDir = freshUserDataDir();
  const app = await launchApp(userDataDir);
  const window = await app.firstWindow();

  const textarea = window.locator('textarea');
  await expect(textarea).toBeVisible();
  await expect(textarea).toHaveValue('');

  await app.close();
});

test('typed content persists as a draft across restart', async () => {
  const userDataDir = freshUserDataDir();

  const app1 = await launchApp(userDataDir);
  const window1 = await app1.firstWindow();
  await window1.locator('textarea').fill('INT. HOUSE - DAY');
  await window1.waitForTimeout(500); // let debounced draft-save fire
  await app1.close();

  const app2 = await launchApp(userDataDir);
  const window2 = await app2.firstWindow();
  await expect(window2.locator('textarea')).toHaveValue('INT. HOUSE - DAY');
  await app2.close();
});

test('preview renders parsed content', async () => {
  const userDataDir = freshUserDataDir();
  const app = await launchApp(userDataDir);
  const window = await app.firstWindow();

  await window.locator('textarea').fill('INT. HOUSE - DAY');
  await window.getByText('Preview', { exact: false }).click();

  await expect(window.locator('h3')).toContainText('INT. HOUSE - DAY');

  await app.close();
});

test('theme toggle switches and persists', async () => {
  const userDataDir = freshUserDataDir();

  const app1 = await launchApp(userDataDir);
  const window1 = await app1.firstWindow();
  await window1.getByLabel('Toggle theme').click();
  await window1.waitForTimeout(200);
  await app1.close();

  const app2 = await launchApp(userDataDir);
  const window2 = await app2.firstWindow();
  const html = window2.locator('html');
  await expect(html).not.toHaveClass(/dark/); // assuming default was dark, toggled to light
  await app2.close();
});