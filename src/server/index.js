import * as publicWebFunctions from './web';

// Expose public functions by attaching to `global`
global.doGet = publicWebFunctions.doGet;
global.getServerUrl = publicWebFunctions.getServerUrl;
