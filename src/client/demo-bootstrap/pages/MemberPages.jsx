import React from 'react';
import {
  BsHouseDoorFill,
  BsListUl,
  BsFillGridFill,
  BsDoorOpenFill,
} from 'react-icons/bs';
import Home from './Home';
import LinkLister from './LinkLister';
import DirveLister from './DirveLister';
import CartIcon from '../components/CartIcon';

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
    label: '檔案列表',
    icon: <BsFillGridFill />,
    comp: <DirveLister />,
  },
  cart: {
    action: 'show-cart',
    customizedIcon: <CartIcon />,
  },
  logout: {
    action: 'logout',
    label: '登出',
    icon: <BsDoorOpenFill />,
  },
};

export default MemberPages;
