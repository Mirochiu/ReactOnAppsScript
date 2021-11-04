import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import {
  BsBootstrapFill,
  BsHouseDoorFill,
  BsFillGridFill,
  BsPersonCircle,
} from 'react-icons/bs';
import IconNavLink from './IconNavLink';

// read more on https://react-bootstrap.github.io/components/navbar/

const MyNav = () => {
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
            <IconNavLink linkTo="/drive-lister" iconComp={<BsFillGridFill />}>
              Drive檔案列表
            </IconNavLink>
          </Nav>
          <Nav>
            <IconNavLink linkTo="/login" iconComp={<BsPersonCircle />}>
              登入
            </IconNavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNav;
