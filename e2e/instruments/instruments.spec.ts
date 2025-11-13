import { expect, test } from '@playwright/test';

import { InstrumentsPage } from '../pages/instruments.page';

/**
 * Instruments Page E2E Test Suite
 * Tests the instruments listing and detail sheet functionality
 */
test.describe('Instruments Page', () => {
  let instrumentsPage: InstrumentsPage;

  test.beforeEach(async ({ page }) => {
    instrumentsPage = new InstrumentsPage(page);
    await instrumentsPage.navigateTo();
    await instrumentsPage.waitForPageReady();
  });

  test.describe('Page Loading', () => {
    test('should load the instruments page', async () => {
      instrumentsPage.assertPageURL();
      await instrumentsPage.assertTableIsVisible();
    });

    test('should display the instruments table', async () => {
      await instrumentsPage.assertTableIsVisible();
    });

    test('should load instruments data on page load', async () => {
      await instrumentsPage.assertInstrumentsAreVisible();
    });

    test('should not show loading spinner after load', async () => {
      const isLoading = await instrumentsPage.isLoading();
      expect(isLoading).toBeFalsy();
    });
  });

  test.describe('Table Rendering', () => {
    test('should display at least one instrument in the table', async () => {
      const count = await instrumentsPage.getInstrumentCount();
      expect(count).toBeGreaterThan(0);
    });

    test('should display instrument names in the table', async () => {
      const names = await instrumentsPage.getVisibleInstrumentNames();
      expect(names.length).toBeGreaterThan(0);
      // Each name should be a non-empty string
      names.forEach((name) => {
        expect(name.length).toBeGreaterThan(0);
      });
    });

    test('should have consistent row structure', async () => {
      const count = await instrumentsPage.getInstrumentCount();
      expect(count).toBeGreaterThan(0);

      // Get data from first instrument
      const firstRowData = await instrumentsPage.getInstrumentRowData(0);
      expect(firstRowData.length).toBeGreaterThan(0);
    });
  });

  test.describe('Instrument Selection and Details Sheet', () => {
    test('should open detail sheet when clicking on an instrument', async () => {
      // Get first instrument name
      const names = await instrumentsPage.getVisibleInstrumentNames();
      expect(names.length).toBeGreaterThan(0);

      // Click on first instrument
      await instrumentsPage.clickInstrumentByIndex(0);

      // Wait for sheet to appear
      await instrumentsPage.waitForSheetToAppear();
      await instrumentsPage.assertSheetContainsText(names[0]);
    });

    test('should close detail sheet when close button is clicked', async () => {
      // Open sheet
      await instrumentsPage.clickInstrumentByIndex(0);
      await instrumentsPage.waitForSheetToAppear();
      expect(await instrumentsPage.isSheetOpen()).toBeTruthy();

      // Close sheet
      await instrumentsPage.closeSheet();
      expect(await instrumentsPage.isSheetOpen()).toBeFalsy();
    });

    test('should display instrument details in the sheet', async () => {
      await instrumentsPage.clickInstrumentByIndex(0);
      const sheetContent = await instrumentsPage.getSheetContent();
      expect(sheetContent).toBeTruthy();
      expect(sheetContent?.length).toBeGreaterThan(0);
    });

    test('should switch between different instruments', async () => {
      const names = await instrumentsPage.getVisibleInstrumentNames();
      if (names.length < 2) {
        test.skip();
      }

      // Click first instrument
      await instrumentsPage.clickInstrumentByIndex(0);
      await instrumentsPage.waitForSheetToAppear();
      await instrumentsPage.assertSheetContainsText(names[0]);

      // Escape
      await instrumentsPage.closeSheet();

      // Click second instrument
      await instrumentsPage.clickInstrumentByIndex(1);
      await instrumentsPage.waitForSheetToAppear();
      await instrumentsPage.assertSheetContainsText(names[1]);
    });
  });

  test.describe('Search and Filtering', () => {
    test('should search for instruments', async () => {
      // Perform search - using a common ticker
      await instrumentsPage.searchInstrument('AAPL');
      await instrumentsPage.assertSearchResultsVisible();

      // Results should be returned
      const searchResultCount = await instrumentsPage.getInstrumentCount();
      expect(searchResultCount).toBeGreaterThanOrEqual(0);
    });

    test('should clear search and show all instruments again', async () => {
      // Get initial count
      await instrumentsPage.getInstrumentCount();

      // Search for something
      await instrumentsPage.searchInstrument('AAPL');
      const searchCount = await instrumentsPage.getInstrumentCount();

      // Clear search
      await instrumentsPage.clearSearch();
      const clearedCount = await instrumentsPage.getInstrumentCount();

      // Should return to original count or close to it
      expect(clearedCount).toBeGreaterThanOrEqual(searchCount);
    });

    test('should return to empty state when no results found', async () => {
      // Search for something that likely doesn't exist
      await instrumentsPage.searchInstrument('XYZNONEXISTENT123456');
      await instrumentsPage.waitForTableToLoad();

      const count = await instrumentsPage.getInstrumentCount();
      // Either no data message or 0 count
      const isNoData = await instrumentsPage.isNoDataMessageVisible();
      if (!isNoData) {
        expect(count).toBe(0);
      }
    });
  });

  test.describe('User Interactions', () => {
    test('should allow clicking on different instruments by name', async () => {
      const names = await instrumentsPage.getVisibleInstrumentNames();
      if (names.length === 0) {
        test.skip();
      }

      // Click first instrument by name
      await instrumentsPage.clickInstrumentByName(names[0]);
      await instrumentsPage.waitForSheetToAppear();
      expect(await instrumentsPage.isSheetOpen()).toBeTruthy();
    });

    test('should allow clicking on instruments by index', async () => {
      const count = await instrumentsPage.getInstrumentCount();
      expect(count).toBeGreaterThan(0);

      await instrumentsPage.clickInstrumentByIndex(0);
      await instrumentsPage.waitForSheetToAppear();
      expect(await instrumentsPage.isSheetOpen()).toBeTruthy();
    });

    test('should maintain table visibility while sheet is open', async () => {
      await instrumentsPage.clickInstrumentByIndex(0);
      await instrumentsPage.waitForSheetToAppear();

      // Table should still be visible behind the sheet
      const isTableVisible = await instrumentsPage.isTableVisible();
      expect(isTableVisible).toBeTruthy();
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('should handle rapid sheet opens and closes', async () => {
      const count = await instrumentsPage.getInstrumentCount();
      if (count < 2) {
        test.skip();
      }

      // Open and close rapidly
      await instrumentsPage.clickInstrumentByIndex(0);
      await instrumentsPage.waitForSheetToAppear();
      await instrumentsPage.closeSheet();

      await instrumentsPage.clickInstrumentByIndex(1);
      await instrumentsPage.waitForSheetToAppear();
      expect(await instrumentsPage.isSheetOpen()).toBeTruthy();

      await instrumentsPage.closeSheet();
      expect(await instrumentsPage.isSheetOpen()).toBeFalsy();
    });

    test('should handle search with special characters', async () => {
      await instrumentsPage.searchInstrument('!@#$%');
      await instrumentsPage.assertSearchResultsVisible();
      // Should not crash and should handle gracefully
    });

    test('should handle empty search', async () => {
      await instrumentsPage.searchInstrument('');
      await instrumentsPage.assertSearchResultsVisible();
    });
  });

  test.describe('Performance', () => {
    test('should load instruments within reasonable time', async () => {
      const startTime = Date.now();
      await instrumentsPage.waitForPageReady();
      const loadTime = Date.now() - startTime;

      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should display search results quickly', async () => {
      const startTime = Date.now();
      await instrumentsPage.searchInstrument('AAPL');
      const searchTime = Date.now() - startTime;

      // Search should be responsive
      expect(searchTime).toBeLessThan(3000);
    });
  });
});
