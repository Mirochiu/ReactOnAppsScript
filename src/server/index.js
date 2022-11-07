import * as publicWebFunctions from './web';
import * as driveFunctions from './drive';
import * as userFunctions from './user';
import * as contentFunctions from './content';
import * as secretFunctions from './secrets';
import { SERVER_URL } from './settings';

// Expose public functions by attaching to `global`
global.doGet = publicWebFunctions.doGet;
global.getServerUrl = () => SERVER_URL;
global.uploadHtmlFile = contentFunctions.uploadHtmlFile;
global.uploadImageFile = driveFunctions.uploadImageFile;
global.listFilesInDriveFolder = driveFunctions.listFilesInDriveFolder;
global.loginUser = userFunctions.login;
global.authLogin = userFunctions.auth;
global.getLinkList = contentFunctions.getLinkList;
global.deleteContentFromSheet = contentFunctions.deleteContentByName;
global.register = userFunctions.register;
global.searchByNameInUploadedHtml = contentFunctions.seachHtmlName;
global.getGoogleLoginURL = secretFunctions.getGoogleLoginURL;
global.getLineLoginURL = secretFunctions.getLineLoginURL;
