import * as publicWebFunctions from './web';
import * as driveFunctions from './drive';
import * as userFunctions from './user';

// Expose public functions by attaching to `global`
global.doGet = publicWebFunctions.doGet;
global.getServerUrl = publicWebFunctions.getServerUrl;
global.listFilesInDriveFolder = driveFunctions.listFilesInDriveFolder;
global.loginUser = userFunctions.login;
global.authLogin = userFunctions.auth;
