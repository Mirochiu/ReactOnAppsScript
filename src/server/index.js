import * as publicWebFunctions from './web';
import * as driveFunctions from './drive';

// Expose public functions by attaching to `global`
global.doGet = publicWebFunctions.doGet;
global.getServerUrl = publicWebFunctions.getServerUrl;
global.listFilesInDriveFolder = driveFunctions.listFilesInDriveFolder;
