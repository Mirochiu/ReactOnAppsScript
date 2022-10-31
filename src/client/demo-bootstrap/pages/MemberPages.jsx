import React from 'react';
import {
  BsHouseDoorFill,
  BsListUl,
  BsFillGridFill,
  BsFillCloudUploadFill,
  BsDoorOpenFill,
} from 'react-icons/bs';
import Home from './Home';
import LinkLister from './LinkLister';
import DirveLister from './DirveLister';
import UploadHtml from './UploadHtml';

const MemberPages = {
  home: {
    action: 'home',
    label: '首頁',
    icon: <BsHouseDoorFill />,
    comp: <Home />,
  },
  link_lister: {
    action: 'link-lister',
    label: '連結列表',
    icon: <BsListUl />,
    comp: <LinkLister />,
  },
  drive_lister: {
    action: 'drive-lister',
    label: 'Drive檔案列表',
    icon: <BsFillGridFill />,
    comp: <DirveLister />,
  },
  upload_html: {
    action: 'upload-html',
    label: '上傳HTML',
    icon: <BsFillCloudUploadFill />,
    comp: <UploadHtml />,
  },
  logout: {
    action: 'logout',
    label: '登出',
    icon: <BsDoorOpenFill />,
  },
};

export default MemberPages;
