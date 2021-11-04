import { FOLDER_ID } from './settings';

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
