import { expect, test } from '@playwright/test';

import { InstrumentsPage } from '../pages/instruments.page';

test.describe('Instruments Page', () => {
  let instrumentsPage: InstrumentsPage;

  test.beforeEach(async ({ page }) => {
    instrumentsPage = new InstrumentsPage(page);
    await instrumentsPage.navigateTo();
    await instrumentsPage.waitForPageReady();
  });

  test.describe('Page Structure and Data', () => {
    test('should display the instruments table with correct columns', async () => {
      await instrumentsPage.assertTableIsVisible();

      const count = await instrumentsPage.getInstrumentCount();
      expect(count).toBeGreaterThan(0);

      const headers = await instrumentsPage.getHeaders();
      expect(headers).toStrictEqual([
        'Symbol',
        'Name',
        'Current price',
        'Day change',
        'Volume',
        'Market Cap',
      ]);
    });

    test('should display valid data formatting', async () => {
      const prices = await instrumentsPage.getColumnText('Current price');
      const changes = await instrumentsPage.getColumnText('Day change');

      expect(prices.length).toBeGreaterThan(0);
      expect(prices.length).toBe(changes.length);

      for (let i = 0; i < Math.min(prices.length, 3); i++) {
        expect(prices[i]).toMatch(/[\d,.]+/);
        expect(changes[i]).toMatch(/%$/);
      }
    });
  });

  test.describe('Sorting', () => {
    test('should sort by Symbol', async () => {
      const initialSymbols =
        await instrumentsPage.getVisibleInstrumentSymbols();
      if (initialSymbols.length < 2) test.skip();

      // Click to sort by Symbol
      await instrumentsPage.clickTableHeader('Symbol');
      const sortedSymbols = await instrumentsPage.getVisibleInstrumentSymbols();

      // Symbols are sorted in descending order by default so now it should be ascending
      expect([...sortedSymbols].sort().reverse()).toStrictEqual(sortedSymbols);

      // Click again to reverse
      await instrumentsPage.clickTableHeader('Symbol');
      const reversedSymbols =
        await instrumentsPage.getVisibleInstrumentSymbols();

      expect(reversedSymbols).not.toStrictEqual(sortedSymbols);
    });

    test('should sort by Market Cap', async () => {
      const initialCaps = await instrumentsPage.getColumnText('Market Cap');
      if (initialCaps.length < 2) test.skip();

      // Click to sort by Market Cap
      await instrumentsPage.clickTableHeader('Market Cap');
      const sortedMarketCaps =
        await instrumentsPage.getColumnText('Market Cap');

      expect(
        sortedMarketCaps.toSorted((a, b) => {
          const numA = parseFloat(a.replace(/[^0-9.-]+/g, '')) || 0;
          const numB = parseFloat(b.replace(/[^0-9.-]+/g, '')) || 0;
          return numA - numB;
        })
      ).toStrictEqual(sortedMarketCaps);

      // Click again to reverse
      await instrumentsPage.clickTableHeader('Market Cap');
      const reversedMarketCaps =
        await instrumentsPage.getColumnText('Market Cap');

      expect(reversedMarketCaps).not.toStrictEqual(sortedMarketCaps);
    });
  });

  test.describe('Search and Filtering', () => {
    test('should search for a specific instrument by symbol', async () => {
      const symbols = await instrumentsPage.getVisibleInstrumentSymbols();
      if (symbols.length === 0) test.skip();
      const targetSymbol = symbols[0];

      await instrumentsPage.searchInstrument(targetSymbol);

      // Verify results contain the target
      const results = await instrumentsPage.getVisibleInstrumentSymbols();
      expect(results).toContain(targetSymbol);

      // Verify results are fewer than total
      expect(results.length).toBeLessThan(symbols.length);
    });

    test('should handle no results found', async () => {
      await instrumentsPage.searchInstrument('NON_EXISTENT_TICKER_123');
      const count = await instrumentsPage.getInstrumentCount();
      expect(count).toBe(0);
    });
  });

  test.describe('Watchlist Interaction', () => {
    test('should toggle watch status in table', async () => {
      await instrumentsPage.toggleWatchInTable(0);
    });
  });

  test.describe('Instrument Details Sheet', () => {
    test('should open sheet and display correct details', async () => {
      const names = await instrumentsPage.getVisibleInstrumentNames();
      const targetName = names[0];
      await instrumentsPage.clickInstrumentByIndex(0);
      await instrumentsPage.waitForSheetToAppear();
      await instrumentsPage.assertSheetContainsText(targetName);
      await instrumentsPage.assertSeeDetailsLink();
      await instrumentsPage.assertChartInSheet();
      await instrumentsPage.assertNewsInSheet();
    });

    test('should close sheet', async () => {
      await instrumentsPage.clickInstrumentByIndex(0);
      await instrumentsPage.waitForSheetToAppear();
      await instrumentsPage.closeSheet();
      expect(await instrumentsPage.isSheetOpen()).toBeFalsy();
    });
  });
});
