import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import {
  BsBootstrapFill,
  BsHouseDoorFill,
  BsListUl,
  BsFillGridFill,
  BsFillCloudUploadFill,
  BsPersonCircle,
} from 'react-icons/bs';
import IconNavLink from './IconNavLink';
import useAuth from '../hooks/useAuth';

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
            <IconNavLink linkTo="/home" iconComp={<BsHouseDoorFill />}>
              首頁
            </IconNavLink>
            <IconNavLink linkTo="/link-lister" iconComp={<BsListUl />}>
              連結列表
            </IconNavLink>
            {authed && (
              <IconNavLink linkTo="/drive-lister" iconComp={<BsFillGridFill />}>
                Drive檔案列表
              </IconNavLink>
            )}
          </Nav>
          <Nav>
            {authed && (
              <IconNavLink
                linkTo="/upload-html"
                iconComp={<BsFillCloudUploadFill />}
              >
                上傳
              </IconNavLink>
            )}
            <IconNavLink linkTo="/login" iconComp={<BsPersonCircle />}>
              {authed ? '登出' : '登入'}
            </IconNavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNav;
