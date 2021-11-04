import { getContentSheet, findIndexInColumn } from './sheet';
import * as User from './user';

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
  return { name, url: `?show=html&name=${name}` };
}
