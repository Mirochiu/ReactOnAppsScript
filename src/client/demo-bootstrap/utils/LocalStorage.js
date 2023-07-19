const createMemoryStorage = () => ({
  data: {},
  getItem(n) {
    return this.data[n];
  },
  setItem(n, v) {
    if (n !== undefined) this.data[n] = v;
  },
  removeItem(n) {
    this.setItem(n, undefined);
  },
});

const createLocalStorage = () => ({
  getItem: (n) => window.localStorage.getItem(n),
  setItem: (n, v) => window.localStorage.setItem(n, v),
  removeItem: (n) => window.localStorage.removeItem(n),
});

const isLocalStorageAvaiable = () => {
  const TEST_ITEM_NAME = 'reactonappscript.test-local-storage';

  if (typeof window.localStorage === 'undefined') {
    console.warn('localStorage not available');
    return false;
  }

  try {
    window.localStorage.setItem(TEST_ITEM_NAME, '~!@#$%^`1234567890');
    window.localStorage.getItem(TEST_ITEM_NAME);
    window.localStorage.removeItem(TEST_ITEM_NAME);
    return true;
  } catch (e) {
    console.warn(`localStorage access failed ${e.message}`);
  }

  return false;
};

const getStorage = () => {
  if (isLocalStorageAvaiable()) {
    return createLocalStorage();
  }

  return createMemoryStorage();
};

const LocalStorage = getStorage();

export default LocalStorage;
