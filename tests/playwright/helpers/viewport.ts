import { Page } from '@playwright/test';

/**
 * Checks if the current viewport is mobile based on width
 * @param page - Playwright page object
 * @returns true if viewport width is less than 768px (mobile), false otherwise
 */
export const isMobileViewport = async (page: Page): Promise<boolean> => {
  const viewport = page.viewportSize();
  return viewport ? viewport.width < 768 : false;
};

/**
 * Gets the device label based on viewport size
 * @param page - Playwright page object
 * @returns 'Mobile' or 'Desktop' based on viewport
 */
export const getDeviceLabel = async (page: Page): Promise<string> => {
  const isMobile = await isMobileViewport(page);
  return isMobile ? 'Mobile' : 'Desktop';
};
