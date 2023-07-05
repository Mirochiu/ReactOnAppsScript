import { sheetQuery } from 'sheetquery';
import { SHEET_URL } from './settings';

const getMainSpreadsheet = () => {
  return SpreadsheetApp.openByUrl(SHEET_URL);
};

export function getSheetInUrl(url, name, options = {}) {
  if (
    typeof url !== 'string' ||
    (name != null && typeof name !== 'string') ||
    typeof options !== 'object'
  ) {
    throw new TypeError(
      'params of getSheetInUrl() should be string,string|null[,object]'
    );
  }

  const book = SpreadsheetApp.openByUrl(url);
  if (!name) {
    if (options.fallbackToFirst) {
      return book.getSheets()[0];
    }
    return null;
  }

  const sheet = book.getSheetByName(name);
  if (!sheet) {
    if (options.autoCreate) {
      return book.insertSheet(name);
    }
    if (options.fallbackToFirst) {
      return book.getSheets()[0];
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

export function log(...args) {
  const sheet = getSheetInUrl(SHEET_URL, '紀錄檔', { autoCreate: true });
  if (sheet) sheet.appendRow(Array.prototype.concat(new Date(), args));
}

// given a list of fields, check base on this list and retrieve all the rows in the data table where these fields are not empty.
export function getRowsByNonEmptyColumns(columnList, sheet) {
  if (!Array.isArray(columnList)) throw new Error('columnList');
  const NUM_ROWS = sheet.getLastRow();
  const NUM_COLS = sheet.getLastColumn();
  const rows = sheet.getRange(1, 1, NUM_ROWS, NUM_COLS).getValues();
  return rows.filter((row) => {
    let isNonEmpty = true;
    for (let i = columnList.length - 1; i >= 0; i -= 1) {
      const c = columnList[i];
      if (!row[c]) {
        isNonEmpty = false;
        break;
      }
    }
    return isNonEmpty;
  });
}

export const getConfig = (key) => {
  const query = sheetQuery(getMainSpreadsheet()).from('設定檔');
  // eslint-disable-next-line eqeqeq
  const result = query.where((row) => row.key == key).getRows();
  if (!result || result.length < 1) {
    return '';
  }
  return result[0].val;
};

export const setConfig = (key, val) => {
  // eslint-disable-next-line eqeqeq
  const query = sheetQuery(getMainSpreadsheet())
    .from('設定檔')
    .where((row) => row.key == key);
  const rows = query.getRows();
  log('#debug-setConfig', rows.length);
  if (rows.length) {
    log('#debug-setConfig', 'update');
    query.updateRows((row) => {
      // eslint-disable-next-line no-param-reassign
      row.val = val;
    });
  } else {
    log('#debug-setConfig', 'insert');
    query.insertRows([{ key, val }]);
  }
};
