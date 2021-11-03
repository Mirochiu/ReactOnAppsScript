import { RE_ACCOUNT, RE_PASSWORD } from './settings';
import { getUserSheet, findIndexInColumn } from './sheet';
import createJwt from './jwt';

export const COLUMN_IDX_OF_NAME = 0;
export const COLUMN_IDX_OF_PWD = 1;
export const COLUMN_IDX_OF_ACCESSTOKEN = 2;
export const COLUMN_IDX_OF_CONFIRMED = 3;

export function login(form) {
  const name = form.username;
  if (typeof name !== 'string' || !RE_ACCOUNT.test(name))
    throw new Error('帳號格式錯誤：應是E-mail');
  const { password } = form;
  if (typeof password !== 'string' || !RE_PASSWORD.test(password))
    throw new Error(
      '密碼格式錯誤：首字需為英文，其他為大小寫英數字，長度8到16之間'
    );
  const sheet = getUserSheet();
  const rowIdx = findIndexInColumn(name, COLUMN_IDX_OF_NAME, sheet);
  if (rowIdx < 0) throw new Error('帳號或密碼錯誤');
  const usrData = sheet
    .getRange(1 + rowIdx, 1, 1, sheet.getLastColumn())
    .getValues()[0];
  if (!usrData[COLUMN_IDX_OF_CONFIRMED])
    throw new Error('你已經註冊了，但是還沒點擊確認信，請查看你的信箱!');
  if (password !== usrData[COLUMN_IDX_OF_PWD])
    throw new Error('帳號或密碼錯誤');
  const accessToken = createJwt({
    privateKey: ScriptApp.getScriptId(), // 請改成你喜歡的
    expiresInHours: 1,
    data: {
      iss: name,
      user: { name, loginAt: new Date().getTime() },
      host: ScriptApp.getService().getUrl(),
    },
  });
  return { status: 201, message: '已成功登入', token: accessToken };
}

export function auth(token) {
  if (!token || typeof token !== 'string') throw new Error('token arg');
  const [header, payload, signature] = token.split('.');
  if (!header || !payload || !signature) throw new Error('invalid jwt');
  let json = {};
  try {
    const decoded = Utilities.base64DecodeWebSafe(payload);
    json = JSON.parse(Utilities.newBlob(decoded).getDataAsString());
  } catch (error) {
    Logger.log(error);
    throw new Error('payload');
  }
  if (json.host !== ScriptApp.getService().getUrl())
    throw new Error(`invalid host:${json.host}`);
  const nowTime = Date.now() / 1000;
  if (nowTime >= json.exp)
    throw new Error(`expired:${json.exp}, now:${nowTime}`);
  const base64Encode = text =>
    Utilities.base64EncodeWebSafe(text).replace(/=+$/, '');
  const computedSignature = base64Encode(
    Utilities.computeHmacSha256Signature(
      `${header}.${payload}`,
      ScriptApp.getScriptId() // 請改成你喜歡的
    )
  );
  if (signature !== computedSignature)
    throw new Error(`invalid signature: ${signature}, ${computedSignature}`);
  return json.user;
}
