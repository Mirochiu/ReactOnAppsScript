import { getContentSheet, findIndexInColumn } from './sheet';
import * as User from './user';
import { SERVER_URL } from './settings';

export const COLUMN_IDX_OF_NAME = 0; // 第一個直欄，又稱A欄，用來儲存名稱
export const COLUMN_IDX_OF_CONTENT = 1; // 第二個直欄，又稱B欄，用來儲存內容

export function setContentToSheet(name, content, sheetName) {
  const sheet = getContentSheet(sheetName);
  const rowIdx = findIndexInColumn(name, COLUMN_IDX_OF_NAME, sheet);
  if (rowIdx < 0) {
    sheet.appendRow([name, content]);
  } else {
    sheet.getRange(1 + rowIdx, 1 + COLUMN_IDX_OF_CONTENT).setValue(content); // 設定一個儲存格內容
  }
}

const name2link = (name) => ({
  name,
  url: `${SERVER_URL}?show=html&name=${encodeURIComponent(name)}`,
});

export function uploadHtmlFile(form) {
  User.validateUploadPermission();
  const FILE_SIZE_LIMIT = 10 * 1042 * 1024; // 10MB
  const name = form['the-name'];
  const file = form['the-file'];
  if (!name || !file || file.size <= 0) throw new Error('名稱或檔案大小有問題');
  if (file.length > FILE_SIZE_LIMIT)
    throw new Error(`檔案超出限制>${FILE_SIZE_LIMIT}位元組`);
  if (file.type !== 'text/html' && typeof file.contents !== 'string')
    throw new Error(`檔案類型錯誤:${file.type}`);
  setContentToSheet(name, file.contents);
  return name2link(name);
}

// TODO: limit the length of output
export function searchHtmlName(name) {
  if (typeof name !== 'string' || name.length < 1) return [];
  const target = name.toLowerCase();
  try {
    const sheet = getContentSheet();
    return sheet
      .getRange(1, 1 + COLUMN_IDX_OF_NAME, sheet.getLastRow(), 1)
      .getValues()
      .filter((r) => r && r[0] != null && r[0].length > 0)
      .map((r) => r[0].toLowerCase())
      .filter((htmlName) => htmlName.indexOf(target) > -1);
  } catch (error) {
    // we do not record this error
  }
  return [];
}

export function getLinkList() {
  const validator = (row) => row && row[0] != null && row[0].length > 0;
  try {
    const sheet = getContentSheet();
    return sheet
      .getRange(1, 1 + COLUMN_IDX_OF_NAME, sheet.getLastRow(), 1)
      .getValues()
      .filter(validator)
      .map((e) => name2link(e[0]));
  } catch (error) {
    Logger.log(`getLinkList error:${error.stack || error}`);
  }
  return [[]];
}

export function getContentByName(name) {
  Logger.log(`getContentByName ${name}`);
  const DEFAULT_RESPONSE = `找不到${name}內容`;
  try {
    const sheet = getContentSheet();
    const rowIdx = findIndexInColumn(name, COLUMN_IDX_OF_NAME, sheet);
    if (rowIdx < 0) return DEFAULT_RESPONSE;
    const content = sheet
      .getRange(1 + rowIdx, 1 + COLUMN_IDX_OF_CONTENT)
      .getValue(); // 取一個儲存格內容
    return content == null ? DEFAULT_RESPONSE : content;
  } catch (error) {
    Logger.log(`getContentByName error:${error.stack || error}`);
  }
  return DEFAULT_RESPONSE;
}

export function deleteContentByName(name) {
  User.validateUploadPermission();
  const sheet = getContentSheet();
  const rowIdx = findIndexInColumn(name, COLUMN_IDX_OF_NAME, sheet);
  if (rowIdx > 0) sheet.deleteRow(1 + rowIdx);
  return { deleted: rowIdx >= 0 };
}
