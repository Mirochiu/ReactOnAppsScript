import { doGet } from './web';
import { uploadImageFile, listFilesInDriveFolder } from './drive';
import { loginUser, authLogin, register, hasLineNotify, getImgurToken } from './user';
import { uploadHtmlFile, getLinkList, deleteContentByName as deleteContentFromSheet, searchHtmlName as searchByNameInUploadedHtml } from './content';
import { getGoogleLoginURL, getLineLoginURL, getLineNotifyURL, getImgurURL } from './oauthURLs';
import { getAllProducts, getProductById } from './products';
import { SERVER_URL } from './settings';
import doLineNotify from './api/lineNotify';

const getServerUrl = () => SERVER_URL;

export {
  doGet,
  uploadImageFile, listFilesInDriveFolder,
  loginUser, authLogin, register, hasLineNotify, getImgurToken,
  uploadHtmlFile, getLinkList, deleteContentFromSheet, searchByNameInUploadedHtml,
  getGoogleLoginURL, getLineLoginURL, getLineNotifyURL, getImgurURL,
  getAllProducts, getProductById,
  getServerUrl,
  doLineNotify,
};
