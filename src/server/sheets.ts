let spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet | null = null;

const getActiveSpreadsheet = (
  sheetId?: string
): GoogleAppsScript.Spreadsheet.Spreadsheet => {
  if (spreadSheet !== null) {
    return spreadSheet;
  }
  if (typeof sheetId === 'string' && sheetId.length > 0) {
    spreadSheet = SpreadsheetApp.openById(sheetId);
  } else {
    spreadSheet = SpreadsheetApp.getActive();
  }
  if (spreadSheet === null) {
    throw new Error(
      'Unable to open the spreadsheet. Please verify that a correct sheetId is provided and that you have access permissions.'
    );
  }
  return spreadSheet;
};

// init once
// use the external spreadsheet
spreadSheet = getActiveSpreadsheet(
  PropertiesService.getScriptProperties().getProperty('sheetId')
);
// spreadSheet = getActiveSpreadsheet(); // use the bounded spreadsheet

const getSheets = () => getActiveSpreadsheet().getSheets();

const getActiveSheetName = () => getActiveSpreadsheet().getSheetName();

export const getSheetsData = () => {
  const activeSheetName = getActiveSheetName();
  const sheets = getSheets();
  return sheets.map((sheet, index) => {
    const name = sheet.getName();
    return {
      name,
      index,
      isActive: name === activeSheetName,
    };
  });
};

export const addSheet = (sheetTitle: string) => {
  getActiveSpreadsheet().insertSheet(sheetTitle);
  return getSheetsData();
};

export const deleteSheet = (sheetIndex: number) => {
  const sheets = getSheets();
  getActiveSpreadsheet().deleteSheet(sheets[sheetIndex]);
  return getSheetsData();
};

export const setActiveSheet = (sheetName: string) => {
  getActiveSpreadsheet().getSheetByName(sheetName).activate();
  return getSheetsData();
};
