export async function checkVersion() {
  /**
   * check if a new version is available by comparing the version that stored in local storage and
   * the one that is in environment variables
   * It does not take any parameters.
   * @return {Boolean}
   */
  const storedVersion = localStorage.getItem("appVersion");
  const currentVersion = process.env.NEXT_PUBLIC_CURRENT_VERSION;

  if (storedVersion === null) {
    localStorage.setItem("appVersion", currentVersion);
  } else if (storedVersion !== currentVersion) {
    // Clear cache
    await caches.keys().then((cacheNames) => {
      cacheNames.forEach(async (cacheName) => {
        await caches.delete(cacheName);
      });
    });
    return true;
  } else {
    return false;
  }
}
