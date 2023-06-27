import { RE_ACCOUNT, RE_PASSWORD, SERVER_URL } from './settings';
import { getUserSheet, findIndexInColumn, log } from './sheet';
import { createJwt, decodeJwt } from './jwt';
import templates from './templates';

export const COLUMN_IDX_OF_NAME = 0;
export const COLUMN_IDX_OF_PWD = 1;
export const COLUMN_IDX_OF_ACCESSTOKEN = 2;
export const COLUMN_IDX_OF_CONFIRMED = 3;
export const COLUMN_IDX_OF_BIND_GOOGLE = 4;
export const COLUMN_IDX_OF_BIND_LINE_NOTIFY = 5;
export const COLUMN_IDX_OF_BIND_IMGUR = 6;

const createToken = ({ name, openId }) => {
  return createJwt({
    privateKey: ScriptApp.getScriptId(), // 請改成你喜歡的
    expiresInHours: 1,
    data: {
      iss: name,
      user: { name, loginAt: new Date().getTime() },
      host: ScriptApp.getService().getUrl(),
      openId,
    },
  });
};

export const loginByOAuth = (uid, from) => {
  Logger.log(`loginByOAuth ${uid} from ${from}`);
  const sheet = getUserSheet();
  // TODO: finding uid in column should derived from 'from'
  const rowIdx = findIndexInColumn(uid, COLUMN_IDX_OF_NAME, sheet);
  if (rowIdx < 0) {
    Logger.log(`new account ${uid} from ${from}`);
    const newAccount = [];
    newAccount[COLUMN_IDX_OF_NAME] = uid;
    newAccount[COLUMN_IDX_OF_CONFIRMED] = new Date();
    sheet.appendRow(newAccount); // 新增OAuth使用者
  }
  return {
    status: 201,
    message: '已成功登入',
    token: createToken({ name: uid }),
  };
};

export const loginByOpenId = (openId, provider) => {
  let providerColumnIdx = -1;
  switch (provider) {
    case 'Google':
      providerColumnIdx = COLUMN_IDX_OF_BIND_GOOGLE;
      break;
    default:
  }
  if (providerColumnIdx < 0) throw new Error(`未知的登入提供者${provider}`);
  const sheet = getUserSheet();
  const rowIdx = findIndexInColumn(openId, providerColumnIdx, sheet);
  if (rowIdx < 0) return null;
  const uid = sheet.getRange(1 + rowIdx, 1 + COLUMN_IDX_OF_NAME).getValue();
  return {
    status: 201,
    message: '已成功登入',
    token: createToken({ name: uid }),
  };
};

const loginByAccount = (name, password) => {
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
  return {
    status: 201,
    message: '已成功登入',
    token: createToken({ name }),
  };
};

export function login(form) {
  const name = form.username;
  if (typeof name !== 'string' || !RE_ACCOUNT.test(name))
    throw new Error('帳號格式錯誤：應是E-mail');
  const { password } = form;
  if (typeof password !== 'string' || !RE_PASSWORD.test(password))
    throw new Error(
      '密碼格式錯誤：首字需為英文，其他為大小寫英數字，長度8到16之間'
    );
  return loginByAccount(name, password);
}

export function auth(token) {
  if (!token || typeof token !== 'string') throw new Error('token arg');
  const [header, payload, signature] = token.split('.');
  if (!header || !payload || !signature) throw new Error('invalid jwt');
  const json = decodeJwt(token);
  if (json.host !== ScriptApp.getService().getUrl())
    throw new Error(`invalid host:${json.host}`);
  const nowTime = Date.now() / 1000;
  if (nowTime >= json.exp)
    throw new Error(`expired:${json.exp}, now:${nowTime}`);
  const base64Encode = (text) =>
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

export function validateUploadPermission(notThrow) {
  const e = Session.getEffectiveUser();
  const a = Session.getActiveUser();
  const result = e?.getEmail() === a?.getEmail();
  if (!notThrow && !result)
    throw new Error(`您沒有權限上傳檔案，請確認你已經登入Google帳號`);
  return result;
}

function addUser(name, pwd) {
  const sheet = getUserSheet();
  const rowIdx = findIndexInColumn(name, COLUMN_IDX_OF_NAME, sheet);
  if (rowIdx >= 0) {
    const confirmed = sheet
      .getRange(1 + rowIdx, 1 + COLUMN_IDX_OF_CONFIRMED)
      .getValue();
    if (confirmed) throw new Error('你已經註冊過囉!');
    throw new Error('你已經註冊了，但是還沒點擊確認信，請查看你的信箱!');
  }
  const accessToken = createJwt({
    privateKey: ScriptApp.getScriptId(), // 請改成你喜歡的
    expiresInHours: 24,
    data: { iss: name },
  });
  sheet.appendRow([name, pwd, accessToken]);
  const url = `${SERVER_URL}?show=confirmToken&name=${accessToken}`;
  GmailApp.sendEmail(name, '確認註冊', '', {
    noReply: true,
    name: '註冊系統',
    htmlBody: `<p>您的註冊時間: ${new Date().toString()}</p>
          <p>請點擊此連結以確認<a href="${url}">${url}</a></p>`,
  });
  SpreadsheetApp.flush();
  return { status: 201, message: '已註冊成功，請查看您的信箱!' };
}

export function register(form) {
  const { username, password } = form;
  if (typeof username !== 'string' || !RE_ACCOUNT.test(username))
    throw new Error('帳號格式錯誤：應是E-mail');
  if (password !== form['confim-password']) throw new Error('兩次密碼不同');
  if (typeof password !== 'string' || !RE_PASSWORD.test(password))
    throw new Error(
      '密碼格式錯誤：首字需為英文，其他為大小寫英數字，長度8到16之間'
    );
  return addUser(username, password);
}

function handleConfirm(token) {
  let json;
  try {
    json = decodeJwt(token);
  } catch (error) {
    Logger.log(`轉換失敗${error.stack}`);
    throw new Error('確認註冊資訊錯誤');
  }
  const sheet = getUserSheet();
  const rowIdx = findIndexInColumn(json.iss, COLUMN_IDX_OF_NAME, sheet);
  if (rowIdx < 0) {
    Logger.log(`用戶${json.iss}尚未註冊`);
    throw new Error('尚未註冊');
  }
  const range = sheet.getRange(1 + rowIdx, 1 + COLUMN_IDX_OF_ACCESSTOKEN, 1, 2);
  const [accessToken, confirmed] = range.getValues()[0];
  if (confirmed) return { status: 200, message: '註冊已確認' };
  if (token !== accessToken) {
    Logger.log(`token不吻合 ${token} != ${accessToken}`);
    throw new Error('確認失敗');
  }
  range.setValues([[accessToken, new Date()]]);
  SpreadsheetApp.flush();
  return { status: 200, message: '註冊已確認' };
}

export function confirmRegistration(token) {
  let content;
  try {
    handleConfirm(token);
    content = '註冊確認成功';
  } catch (error) {
    Logger.log(`註冊確認失敗${error.stack}`);
    content = `註冊確認失敗 ${error.message}`;
  }
  return HtmlService.createHtmlOutput(content);
}

export const createGoogleBinding = (email, openId) => {
  const sheet = getUserSheet();
  const rowIdx = findIndexInColumn(email, COLUMN_IDX_OF_NAME, sheet);
  if (rowIdx < 0) {
    return null; // 沒找到既有Email帳號
  }
  const bindRange = sheet.getRange(1 + rowIdx, 1 + COLUMN_IDX_OF_BIND_GOOGLE);
  const bindId = bindRange.getValue();
  if (bindId && !(typeof bindId === 'string' && bindId.startsWith('ey'))) {
    throw new Error('已榜定');
  }
  const token = createToken({
    name: email,
    openId: { id: openId, provider: 'Google' },
  });
  bindRange.setValue(token);
  return token;
};

function handleOpenIdConfirm(token) {
  let json;
  try {
    json = decodeJwt(token);
  } catch (error) {
    Logger.log(`解碼JWT失敗${error.stack}`);
    throw new Error('榜定資訊錯誤');
  }
  if (!json.openId) {
    Logger.log(`找不到OpenID ${JSON.stringify(json)}`);
    throw new Error('無法榜定未知的使用者ID');
  }
  const sheet = getUserSheet();
  const rowIdx = findIndexInColumn(json.iss, COLUMN_IDX_OF_NAME, sheet);
  if (rowIdx < 0) {
    Logger.log(`用戶${json.iss}尚未註冊`);
    throw new Error('尚未註冊');
  }
  let providerColumnIdx = -1;
  switch (json.openId.provider) {
    case 'Google':
      providerColumnIdx = COLUMN_IDX_OF_BIND_GOOGLE;
      break;
    default:
  }
  if (providerColumnIdx < 0) {
    throw new Error(`未知的榜定提供者${json.openId.provider}`);
  }
  const tokenRange = sheet.getRange(1 + rowIdx, 1 + providerColumnIdx);
  const accessToken = tokenRange.getValue();
  if (token !== accessToken) {
    Logger.log(`榜定token不同 ${token} != ${accessToken}`);
    throw new Error('榜定失敗');
  }
  tokenRange.setValue(json.openId.id);
  SpreadsheetApp.flush();
  return json.openId;
}

export function confirmOpenIdBinding(token) {
  try {
    const openId = handleOpenIdConfirm(token);
    const openIdLogin = loginByOpenId(openId.id, openId.provider);
    if (!openIdLogin) throw new Error('登入失敗');
    return templates.getSuccess({
      token: openIdLogin.token,
      id: openId.id,
      provider: openId.provider,
    });
  } catch (error) {
    Logger.log(`榜定失敗${error.stack}`);
    return templates.getFailure({
      error: '榜定失敗',
      desc: `${error.message}`,
    });
  }
}

const getOauthToken = (userToken, idx) => {
  const user = auth(userToken);
  const sheet = getUserSheet();
  const rowIdx = findIndexInColumn(user.name, COLUMN_IDX_OF_NAME, sheet);
  if (rowIdx < 0) throw new Error(`no found user with name:${user.name}`);
  const range = sheet.getRange(1 + rowIdx, 1 + idx);
  return [range.getValue(), range];
};

export const getLineNotifyToken = (userToken) =>
  getOauthToken(userToken, COLUMN_IDX_OF_BIND_LINE_NOTIFY);

export const bindUserWithLineNotify = (userToken, bindToken) => {
  if (!bindToken) throw new Error('should give bindToken');
  const [hasToken, range] = getLineNotifyToken(userToken);
  if (hasToken) throw new Error('could not bind the line notify twice');
  range.setValue(bindToken);
  SpreadsheetApp.flush();
  return true;
};

export const hasLineNotify = (userToken) => {
  if (!userToken) throw new Error('should give bindToken');
  const [hasToken] = getLineNotifyToken(userToken);
  return !!hasToken;
};

export const getImgurToken = (userToken) => {
  const [stringfyToken] = getOauthToken(userToken, COLUMN_IDX_OF_BIND_IMGUR);
  if (!stringfyToken) {
    throw new Error('no token');
  }
  return JSON.parse(stringfyToken).access_token;
};

export const bindUserWithImgur = (userToken, bindToken) => {
  if (!bindToken) throw new Error('should give bindToken');
  const [hasToken, range] = getImgurToken(userToken);
  if (hasToken) throw new Error('could not bind the imgur twice');
  range.setValue(bindToken);
  SpreadsheetApp.flush();
  return true;
};
