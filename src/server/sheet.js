import { SHEET_URL } from './settings';

export function getUserSheet() {
  const USERS_SHEET_NAME = '使用者';
  const book = SpreadsheetApp.openByUrl(SHEET_URL);
  let sheet = book.getSheetByName(USERS_SHEET_NAME);
  if (!sheet) sheet = book.insertSheet(USERS_SHEET_NAME);
  return sheet;
}

export function findIndexInColumn(name, column, sheet) {
  const list = sheet
    .getRange(1, 1 + column, 1 + sheet.getLastRow(), 1)
    .getValues();
  return list.findIndex(r => name === r[column]);
}

export function getContentSheet(sheetName) {
  const book = SpreadsheetApp.openByUrl(SHEET_URL);
  const sheet =
    sheetName == null ? book.getSheets()[0] : book.getSheetByName(sheetName);
  return sheet;
}
