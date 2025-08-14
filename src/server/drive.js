import { FOLDER_ID } from './settings';
import * as User from './user';

function encodeBlob(blob) {
  if (!blob) return null;
  const type = blob.getContentType();
  const base64 = Utilities.base64Encode(blob.getBytes());
  return `data:${type};base64,${base64}`;
}

function getFileInfo(file) {
  return {
    id: file.getId(),
    type: file.getMimeType(),
    name: file.getName(),
    thumbnail: encodeBlob(file.getThumbnail()),
    size: file.getSize(),
    url: file.getDownloadUrl(),
  };
}

export function listFilesInDriveFolder() {
  const fileList = [];
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const fileItr = folder.getFiles();
  while (fileItr.hasNext()) {
    const file = fileItr.next();
    fileList.push(getFileInfo(file));
  }
  return fileList;
}

// https://blog.mirochiu.page/2021/10/appscriptsheet5.html
function getTypeAndData(dataURL, name) {
  // https://en.wikipedia.org/wiki/Data_URI_scheme
  const target = ';base64,';
  const offset = dataURL.indexOf(target);
  if (offset < 0) {
    throw new Error(
      `not supported DataURL starts with:${dataURL.substring(0, 30)}`
    );
  }
  const mimeType = dataURL.substring(5, offset); // e.g. data:image/png;base64,
  const base64 = dataURL.substring(offset + target.length);
  const data = Utilities.base64Decode(base64, Utilities.Charset.UTF_8);
  return {
    type: mimeType,
    blob: Utilities.newBlob(data, mimeType, name),
  };
}

export function uploadImageFile(form) {
  User.validateUploadPermission();
  const FILE_SIZE_LIMIT = 10 * 1042 * 1024; // 10MB
  const name = form['the-name'];
  const dataURL = form['the-data'];
  if (!name || !dataURL) throw new Error('名稱或檔案大小有問題');
  if (dataURL.length > FILE_SIZE_LIMIT)
    throw new Error(`檔案編碼後大小超出限制>${FILE_SIZE_LIMIT}位元組`);
  const { type, blob } = getTypeAndData(dataURL, name);
  if (type.indexOf('image/') < 0) {
    throw new Error(`檔案類型錯誤:${type}`);
  }
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const file = folder.createFile(blob);
  // 任何知道連結的人都可以開啟得權限設定
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return getFileInfo(file);
}

export default listFilesInDriveFolder;
