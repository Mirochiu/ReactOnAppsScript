import { API_KEYS } from '../settings';

const postToTinyPNG = (fileBlob) => {
  const response = UrlFetchApp.fetch('https://api.tinify.com/shrink', {
    headers: {
      Authorization:
        'Basic ' +
        Utilities.base64Encode(
          'api:' + API_KEYS.TinyPNG,
          Utilities.Charset.UTF_8
        ),
    },
    method: 'post',
    contentType: 'application/octet-stream',
    payload: fileBlob.getBytes(),
  });
  return {
    code: response.getResponseCode(),
    url: response.getHeaders().Location,
    date: response.getHeaders().Date,
    json: JSON.parse(response.getContentText()),
    /*
    {
        "output": {
            "width": 750,
            "size": 96642,
            "type": "image/jpeg",
            "url": "https://api.tinify.com/output/...",
            "ratio": 0.4039,
            "height": 1091
        },
        "input": {
            "size": 239251,
            "type": "image/jpeg"
        }
    }
    */
  };
};

const BIN_PREFIX = ';base64,';

const upload = (form) => {
  const { name, content } = form;
  const offset = content.indexOf(BIN_PREFIX);
  const contentType = content.substring(5, offset); // e.g. data:image/png;base64,

  const fileB64 = content.substring(offset + BIN_PREFIX.length);
  const data = Utilities.base64Decode(fileB64, Utilities.Charset.UTF_8);
  const fileBlob = Utilities.newBlob(data, contentType, name);

  const response = postToTinyPNG(fileBlob);
  response.name = name;
  return response;
};

const TinyPNGApi = {
  upload,
};

export default TinyPNGApi;
