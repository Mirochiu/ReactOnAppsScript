import * as publicWebFunctions from './web';
import * as driveFunctions from './drive';
import * as userFunctions from './user';
import * as contentFunctions from './content';
import * as secretFunctions from './oauth/oauthURLs';
import * as productFunctions from './products';
import { SERVER_URL } from './settings';
import LineNotifyApi from './api/lineNotify';
import googleCalendarApi from './api/googleCalendar';
import ImgurApi from './api/imgUr';
import onTriggered, { setupTrigger } from './trigger';

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
global.searchByNameInUploadedHtml = contentFunctions.searchHtmlName;
global.getAllProducts = productFunctions.getAllProducts;
global.getProductById = productFunctions.getProductById;
global.getGoogleLoginURL = secretFunctions.getGoogleLoginURL;
global.getLineLoginURL = secretFunctions.getLineLoginURL;
global.getLineNotifyURL = secretFunctions.getLineNotifyURL;
global.getImgurURL = secretFunctions.getImgurURL;
global.getGoogleCalendarURL = secretFunctions.getGoogleCalendarURL;
global.getImgurToken = ImgurApi.getToken;
global.hasLineNotify = LineNotifyApi.hasBound;
global.doLineNotify = LineNotifyApi.notify;
global.hasGoogleCalendarToken = googleCalendarApi.hasBound;
global.listTodayEventsOnGoogleCanlendar = googleCalendarApi.listTodayEvents;
global.listCalendarsOnGoogleCalendar = googleCalendarApi.listCalendars;
global.onTriggered = onTriggered;
global.setupTrigger = setupTrigger;
global.ConcernedCalendars = (userToken, list) => {
  if (list == null) return googleCalendarApi.getConcernedCalendars(userToken);
  return googleCalendarApi.setConcernedCalendars(userToken, list);
};
