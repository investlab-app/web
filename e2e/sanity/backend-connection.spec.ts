import { expect, test } from '@playwright/test';
import { BACKEND_BASE_URL } from 'e2e/constants';

test.describe('backend connection sanity check', () => {
  test('should return 200 from /api/status', async ({ request }) => {
    const response = await request.get(`${BACKEND_BASE_URL}/api/status`);
    expect(
      response.status(),
      `Expected backend at ${BACKEND_BASE_URL} to respond with HTTP 200`
    ).toBe(200);
  });
});
