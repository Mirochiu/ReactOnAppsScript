// from https://www.labnol.org/code/json-web-token-201128

export const createJwt = ({ privateKey, expiresInHours, data = {} }) => {
  // Sign token using HMAC with SHA-256 algorithm
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const now = Date.now();
  const expires = new Date(now);
  expires.setHours(expires.getHours() + expiresInHours);

  // iat = issued time, exp = expiration time
  const payload = {
    exp: Math.round(expires.getTime() / 1000),
    iat: Math.round(now / 1000),
  };

  // add user payload
  Object.keys(data).forEach((key) => {
    payload[key] = data[key];
  });

  const base64Encode = (text, json = true) => {
    const d = json ? JSON.stringify(text) : text;
    return Utilities.base64EncodeWebSafe(d).replace(/=+$/, '');
  };

  const toSign = `${base64Encode(header)}.${base64Encode(payload)}`;
  const signatureBytes = Utilities.computeHmacSha256Signature(
    toSign,
    privateKey
  );
  const signature = base64Encode(signatureBytes, false);
  return `${toSign}.${signature}`;
};

export default createJwt;

export const decodeJwt = (token, notThrow) => {
  try {
    const payload = token.split('.')[1];
    const decoded = Utilities.base64DecodeWebSafe(payload);
    return JSON.parse(Utilities.newBlob(decoded).getDataAsString());
  } catch (error) {
    if (notThrow) return null;
    throw error;
  }
};
