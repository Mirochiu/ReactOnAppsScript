import React from 'react';
import {
  BsHouseDoorFill,
  BsListUl,
  BsFillGridFill,
  BsAward,
  BsDoorOpenFill,
} from 'react-icons/bs';
import Home from './Home';
import LinkLister from './LinkLister';
import DirveLister from './DirveLister';
import CartIcon from '../components/CartIcon';
import SingleProduct from './SingleProuct';

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
  single_product: {
    action: 'single_product',
    label: '主打產品',
    icon: <BsAward />,
    comp: <SingleProduct productId="12340" />,
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
