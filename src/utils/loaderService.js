let loaderCallback = null;

export const setLoaderCallback = (callback) => {
  loaderCallback = callback;
};

export const showLoader = (message) => {
  if (loaderCallback) {
    loaderCallback(true, message);
  }
};

export const hideLoader = () => {
  if (loaderCallback) {
    loaderCallback(false);
  }
};
