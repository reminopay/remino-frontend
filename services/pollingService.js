export const pollData = async (getData, shouldContinuePolling) => {
  /**
   * poll the data based on the polling limit and interval until  should continue polling condition is not true any more
   * @param {Function} getData
   * @param {Boolean} shouldContinuePolling
   * @return {Promise}
   */
  let pollingCount = 0;
  const pollingLimit = 20;
  const intervalDuration = 3000;

  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const data = await getData();
        pollingCount++;

        if (!shouldContinuePolling(data) || pollingCount >= pollingLimit) {
          clearInterval(interval);
          resolve(data);
        }
      } catch (error) {
        clearInterval(interval);
        reject(error);
      }
    }, intervalDuration);
  });
};
