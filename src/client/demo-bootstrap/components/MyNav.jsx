import React from 'react';
import { Navbar, Nav, NavItem, Container } from 'react-bootstrap';
import {
  BsBootstrapFill,
  BsHouseDoorFill,
  BsListUl,
  BsFillGridFill,
  BsFillCloudUploadFill,
  BsPersonCircle,
} from 'react-icons/bs';
import IconNavLink, { ButtomIconNavLink } from './IconNavLink';
import useAuth from '../hooks/useAuth';

const haventAuthed = ({ authed }) => !authed;

const AllLinks = {
  home: { path: '/home', label: '首頁', icon: <BsHouseDoorFill /> },
  link_lister: { path: '/link-lister', label: '連結列表', icon: <BsListUl /> },
  drive_lister: {
    path: '/drive-lister',
    label: 'Drive檔案列表',
    icon: <BsFillGridFill />,
    disableIf: haventAuthed,
  },
  upload_html: {
    path: '/upload-html',
    label: '上傳',
    icon: <BsFillCloudUploadFill />,
    disableIf: haventAuthed,
  },
  login: {
    path: '/login',
    label: '登入',
    labelForAuth: '登出',
    icon: <BsPersonCircle />,
  },
};

const LinksForTop = Object.keys(AllLinks).map(key => AllLinks[key]);

const LinksForBottom = [AllLinks.home, AllLinks.link_lister, AllLinks.login];

export const BottomNav = () => {
  const { authed } = useAuth();
  return (
    <Navbar
      fixed="bottom"
      variant="light"
      className="bottom-tab-nav d-block d-md-none"
    >
      <Nav className="d-flex flex-row justify-content-around w-100">
        {LinksForBottom.map((link, idx) => (
          <NavItem key={`bottom-menu-${idx}`}>
            <ButtomIconNavLink linkTo={link.path} iconComp={link.icon}>
              {authed ? link.labelForAuth || link.label : link.label}
            </ButtomIconNavLink>
          </NavItem>
        ))}
      </Nav>
    </Navbar>
  );
};

// read more on https://react-bootstrap.github.io/components/navbar/

const MyNav = () => {
  const { authed } = useAuth();
  return (
    <Navbar collapseOnSelect expand="md" bg="primary" variant="dark">
      <Container>
        <Navbar.Brand>
          <BsBootstrapFill size={32} /> React on AppScript
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {LinksForTop.reduce((prev, link, idx) => {
              if (
                typeof link.disableIf === 'function' &&
                link.disableIf({ authed })
              )
                return prev;
              prev.push(
                <IconNavLink
                  key={`main-menu-${idx}`}
                  linkTo={link.path}
                  iconComp={link.icon}
                >
                  {authed ? link.labelForAuth || link.label : link.label}
                </IconNavLink>
              );
              return prev;
            }, [])}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNav;
