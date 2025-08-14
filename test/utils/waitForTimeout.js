const waitForTimeout = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, 3000);
  });
};

export default waitForTimeout;
