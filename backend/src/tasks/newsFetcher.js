import { fetchAndProcessNews } from '../services/newsService.js';

let fetchInterval = null;

export const startNewsFetcherScheduler = () => {
  const intervalMinutes = parseInt(process.env.NEWS_FETCH_INTERVAL_MINUTES || '15', 10);
  const intervalMs = intervalMinutes * 60 * 1000;

  console.log(`[Scheduler] Initializing background news fetcher (Interval: ${intervalMinutes} minutes)...`);

  // Run immediately on boot
  fetchAndProcessNews().catch(err => {
    console.error('[Scheduler] Initial news fetch error:', err.message);
  });

  // Schedule periodic background execution
  fetchInterval = setInterval(() => {
    console.log('[Scheduler] Executing scheduled background news check...');
    fetchAndProcessNews().catch(err => {
      console.error('[Scheduler] Scheduled news fetch error:', err.message);
    });
  }, intervalMs);
};

export const stopNewsFetcherScheduler = () => {
  if (fetchInterval) {
    clearInterval(fetchInterval);
    console.log('[Scheduler] Background news fetcher stopped.');
  }
};
