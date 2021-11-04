import * as publicWebFunctions from './web';
import * as driveFunctions from './drive';
import * as userFunctions from './user';
import * as contentFunctions from './content';

// Expose public functions by attaching to `global`
global.doGet = publicWebFunctions.doGet;
global.getServerUrl = publicWebFunctions.getServerUrl;
global.uploadHtmlFile = contentFunctions.uploadHtmlFile;
global.listFilesInDriveFolder = driveFunctions.listFilesInDriveFolder;
global.loginUser = userFunctions.login;
global.authLogin = userFunctions.auth;
