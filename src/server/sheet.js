import { SHEET_URL } from './settings';

export function getSheetInUrl(url, name, option = {}) {
  if (
    typeof url !== 'string' ||
    typeof name !== 'string' ||
    typeof option !== 'object'
  ) {
    throw new TypeError(
      'params of getSheetInUrl() should be string,string[,object]'
    );
  }
  const book = SpreadsheetApp.openByUrl(url);
  if (!name && option.fallbackToFirst) {
    return book.getSheets()[0];
  }
  let sheet = book.getSheetByName(name);
  if (!sheet) {
    if (option.autoCreate) {
      sheet = book.insertSheet(name);
    }
  }
  return sheet;
}

export function getUserSheet() {
  return getSheetInUrl(SHEET_URL, '使用者', { autoCreate: true });
}

export function findIndexInColumn(name, column, sheet) {
  const list = sheet.getRange(1, 1 + column, sheet.getLastRow(), 1).getValues();
  return list.findIndex((r) => name === r[0]);
}

export function getContentSheet(sheetName) {
  return getSheetInUrl(SHEET_URL, sheetName, { fallbackToFirst: true });
}

export function getProductSheet() {
  return getSheetInUrl(SHEET_URL, '產品列表', { autoCreate: true });
}
