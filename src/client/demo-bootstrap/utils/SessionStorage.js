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

const createSessionStorage = () => ({
  getItem: (n) => window.sessionStorage.getItem(n),
  setItem: (n, v) => window.sessionStorage.setItem(n, v),
  removeItem: (n) => window.sessionStorage.removeItem(n),
});

const isSessionStorageAvaiable = () => {
  const TEST_ITEM_NAME = 'reactonappscript.test-session-storage';

  if (!navigator.cookieEnabled) {
    console.warn('cookie disabled');
    return false;
  }

  if (typeof window.sessionStorage === 'undefined') {
    console.warn('sessionStorage not available');
    return false;
  }

  try {
    window.sessionStorage.setItem(TEST_ITEM_NAME, '~!@#$%^`1234567890');
    window.sessionStorage.getItem(TEST_ITEM_NAME);
    window.sessionStorage.removeItem(TEST_ITEM_NAME);
    return true;
  } catch (e) {
    console.warn(`sessionStorage access failed ${e.message}`);
  }

  return false;
};

const getStorage = () => {
  let storage;
  if (isSessionStorageAvaiable()) {
    storage = createSessionStorage();
    storage.allowReloading = true; // workaround for login
    return storage;
  }

  return createMemoryStorage();
};

const SessionStorage = getStorage();

export default SessionStorage;
