import { expect, test } from '@playwright/test';

import { InstrumentsPage } from '../pages/instruments.page';
import { InstrumentDetailsPage } from '../pages/instrument-details.page';

test.describe('Instrument Details', () => {
  let instrumentsPage: InstrumentsPage;
  let instrumentDetailsPage: InstrumentDetailsPage;

  // Use a commonly traded instrument
  const TEST_TICKER = 'AAPL';

  test.beforeEach(async ({ page }) => {
    instrumentsPage = new InstrumentsPage(page);
    instrumentDetailsPage = new InstrumentDetailsPage(page);
    await page.goto('/');
  });

  test('should open instrument list, search for instrument, open details, verify chart and news', async ({
    page,
  }) => {
    // Step 1: Navigate to instruments list
    await instrumentsPage.navigateTo();
    await instrumentsPage.waitForPageReady();

    // Verify table is visible
    await instrumentsPage.assertTableIsVisible();

    // Step 2: Search for the instrument
    await instrumentsPage.searchInstrument(TEST_TICKER);

    // Verify search results contain the ticker
    const symbols = await instrumentsPage.getVisibleInstrumentSymbols();
    expect(symbols).toContain(TEST_TICKER);

    // Step 3: Click on the instrument to open details sheet
    const tickerIndex = symbols.indexOf(TEST_TICKER);
    await instrumentsPage.clickInstrumentByIndex(
      tickerIndex >= 0 ? tickerIndex : 0
    );

    // Wait for sheet to appear
    await instrumentsPage.waitForSheetToAppear();

    // Verify sheet contains instrument info
    await instrumentsPage.assertSheetContainsText(TEST_TICKER);

    // Verify chart is displayed in sheet
    await instrumentsPage.assertChartInSheet();

    // Verify news section is displayed in sheet
    await instrumentsPage.assertNewsInSheet();

    // Step 4: Click "See Details" link to navigate to full details page
    await instrumentsPage.assertSeeDetailsLink();
    await page.getByRole('link', { name: /see details|details/i }).click();

    // Wait for navigation to instrument details page
    await page.waitForURL(`/instruments/${TEST_TICKER}`);
    await instrumentDetailsPage.waitForPageReady();

    // Step 5: Verify chart is available on the details page
    await instrumentDetailsPage.assertChartVisible();
    await instrumentDetailsPage.assertInstrumentHeader(TEST_TICKER);
    await instrumentDetailsPage.assertCurrentPriceDisplayed();

    // Step 6: Verify initial chart type (default is line)
    const initialChartType = await instrumentDetailsPage.getChartType();
    expect(['line', 'candlestick']).toContain(initialChartType);

    // Step 7: Switch chart type
    if (initialChartType === 'line') {
      // Switch to candlestick
      await instrumentDetailsPage.switchToCandlestickChart();

      // Verify chart type changed
      const newChartType = await instrumentDetailsPage.getChartType();
      expect(newChartType).toBe('candlestick');

      // Switch back to line
      await instrumentDetailsPage.switchToLineChart();
      const finalChartType = await instrumentDetailsPage.getChartType();
      expect(finalChartType).toBe('line');
    } else {
      // Switch to line
      await instrumentDetailsPage.switchToLineChart();

      // Verify chart type changed
      const newChartType = await instrumentDetailsPage.getChartType();
      expect(newChartType).toBe('line');

      // Switch back to candlestick
      await instrumentDetailsPage.switchToCandlestickChart();
      const finalChartType = await instrumentDetailsPage.getChartType();
      expect(finalChartType).toBe('candlestick');
    }

    // Step 8: Verify news section is displayed
    await instrumentDetailsPage.assertNewsSectionVisible();
    await instrumentDetailsPage.assertNewsDisplayed();
  });

  test('should display chart with different intervals', async () => {
    // Navigate directly to instrument details
    await instrumentDetailsPage.navigateTo(TEST_TICKER);
    await instrumentDetailsPage.waitForPageReady();

    // Verify chart is visible
    await instrumentDetailsPage.assertChartVisible();

    // Test different intervals
    const intervals = ['Hour', 'Day', 'Week'];

    for (const interval of intervals) {
      await instrumentDetailsPage.selectInterval(interval);

      // Verify chart still visible after interval change
      await instrumentDetailsPage.assertChartVisible();
    }
  });

  test('should toggle between line and candlestick chart types', async () => {
    // Navigate directly to instrument details
    await instrumentDetailsPage.navigateTo(TEST_TICKER);
    await instrumentDetailsPage.waitForPageReady();

    // Verify chart is visible
    await instrumentDetailsPage.assertChartVisible();

    // Get initial chart type
    const initialType = await instrumentDetailsPage.getChartType();

    // Toggle to the other type
    if (initialType === 'line') {
      await instrumentDetailsPage.switchToCandlestickChart();
      expect(
        await instrumentDetailsPage.isCandlestickChartActive()
      ).toBeTruthy();
    } else {
      await instrumentDetailsPage.switchToLineChart();
      expect(await instrumentDetailsPage.isLineChartActive()).toBeTruthy();
    }

    // Chart should still be visible
    await instrumentDetailsPage.assertChartVisible();

    // Toggle back
    if (initialType === 'line') {
      await instrumentDetailsPage.switchToLineChart();
      expect(await instrumentDetailsPage.isLineChartActive()).toBeTruthy();
    } else {
      await instrumentDetailsPage.switchToCandlestickChart();
      expect(
        await instrumentDetailsPage.isCandlestickChartActive()
      ).toBeTruthy();
    }
  });

  test('should display news section with articles or unavailable message', async () => {
    // Navigate directly to instrument details
    await instrumentDetailsPage.navigateTo(TEST_TICKER);
    await instrumentDetailsPage.waitForPageReady();

    // Verify news section is visible
    await instrumentDetailsPage.assertNewsSectionVisible();

    // Verify news content (either articles or empty state)
    await instrumentDetailsPage.assertNewsDisplayed();

    // Get news count
    const newsCount = await instrumentDetailsPage.getNewsCount();

    // News count should be >= 0 (either has news or shows empty state)
    expect(newsCount).toBeGreaterThanOrEqual(0);
  });
});
