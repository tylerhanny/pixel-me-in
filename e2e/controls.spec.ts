import { expect, test, type Page } from '@playwright/test';

async function state(page: Page) {
  return JSON.parse(
    (await page.locator('#game canvas').getAttribute('data-debug')) ?? '{}',
  ) as Record<string, number>;
}

async function play(page: Page) {
  await page.goto('/?debug');
  await page.getByRole('button', { name: /play now/i }).click();
  await page.getByRole('button', { name: /Quick play/ }).click();
  await expect(page.locator('#hud')).toBeVisible({ timeout: 10000 });
  await expect.poll(async () => (await state(page)).speed).toBeGreaterThan(0);
}

test('quick play loads no face models; keyboard hop, double jump, fast fall and pause', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'keyboard');
  const models: string[] = [];
  page.on('request', (r) => {
    if (r.url().includes('/mediapipe/')) models.push(r.url());
  });
  await play(page);
  await page.keyboard.down('Space');
  await expect.poll(async () => (await state(page)).jumps, { intervals: [10] }).toBe(1);
  await page.waitForTimeout(120);
  await page.keyboard.up('Space');
  await expect.poll(async () => (await state(page)).vy, { intervals: [10] }).toBeGreaterThan(-280);
  await expect.poll(async () => (await state(page)).grounded).toBe(1);
  // A separate two-press sequence; don't put browser round-trip assertions inside it.
  await page.keyboard.down('Space');
  await page.waitForTimeout(120);
  await page.keyboard.up('Space');
  await page.waitForTimeout(60);
  await page.keyboard.down('Space');
  await expect.poll(async () => (await state(page)).doubles, { intervals: [10] }).toBe(1);
  await page.keyboard.up('Space');
  await page.keyboard.down('ArrowDown');
  await expect.poll(async () => (await state(page)).sliding).toBe(1);
  await page.waitForTimeout(1200);
  expect((await state(page)).sliding).toBe(1); // Periodic scale refresh must not release a hold.
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  const clock = (await state(page)).clock;
  await page.waitForTimeout(800);
  expect((await state(page)).clock).toBe(clock);
  await page.keyboard.up('ArrowDown');
  await page.getByRole('button', { name: /Resume/ }).click();
  await expect.poll(async () => (await state(page)).sliding).toBe(0);
  expect(models).toEqual([]);
});

test('touch buttons jump on press; a real downward swipe slides and cancellation releases', async ({
  page,
  isMobile,
  context,
}) => {
  test.skip(!isMobile, 'touch');
  await play(page);
  const cdp = await context.newCDPSession(page);
  const box = (await page.getByRole('button', { name: 'Jump', exact: true }).boundingBox())!;
  const x = box.x + box.width / 2,
    y = box.y + box.height / 2;
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x, y, id: 1 }],
  });
  await expect.poll(async () => (await state(page)).vy).toBeLessThan(-300);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
  await expect(page.getByRole('button', { name: 'Jump', exact: true })).not.toHaveClass(/down/);
  await expect.poll(async () => (await state(page)).grounded).toBe(1);
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: 200, y: 320, id: 2 }],
  });
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ x: 200, y: 380, id: 2 }],
  });
  await expect.poll(async () => (await state(page)).sliding).toBe(1);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
  await expect.poll(async () => (await state(page)).sliding).toBe(0);
});

test('rotation resizes the rendered camera and keeps landscape controls below the road', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'phone rotation');
  await play(page);
  // Chromium's window-resize protocol cannot resize an element-fullscreen window.
  await page.evaluate(async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
  });
  const density = await page.evaluate(() => Math.min(2, devicePixelRatio));
  for (const [width, height] of [
    [915, 412],
    [360, 740],
    [915, 412],
  ]) {
    await page.setViewportSize({ width, height });
    await expect.poll(async () => (await state(page)).viewportW).toBe(width * density);
    await expect.poll(async () => (await state(page)).viewportH).toBe(height * density);
    if (width > height) {
      const jump = (await page.getByRole('button', { name: 'Jump', exact: true }).boundingBox())!;
      await expect
        .poll(async () => (await state(page)).groundScreen / density)
        .toBeLessThan(jump.y);
    }
  }
});
