import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { BsBootstrapFill } from 'react-icons/bs';

const ClickableIcon = ({
  customizedIcon,
  icon,
  text = '',
  onClick = () => {},
}) => {
  const iconRender = () => {
    if (customizedIcon) return customizedIcon;
    return (
      <div className="d-flex align-items-center">
        {icon}
        {text}
      </div>
    );
  };

  return (
    <Nav.Link onClick={onClick}>
      <Nav.Item>{iconRender()}</Nav.Item>
    </Nav.Link>
  );
};

const TopNav = ({ onPageChanged = () => {}, pageList = [] }) => {
  const getHandler = (p) => (e) => {
    e.preventDefault();
    onPageChanged(p);
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
      <Container>
        <Navbar.Brand>
          <BsBootstrapFill size={32} /> React on AppScript
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto align-items-start align-items-lg-center">
            {pageList.map((page, idx) => (
              <ClickableIcon
                key={`top-icon-${idx}`}
                icon={page.icon}
                text={page.label}
                customizedIcon={page.customizedIcon}
                onClick={getHandler(page)}
              />
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNav;

export const buildTopNav = ({ pages, defaultHandler }) => {
  const pageList = Object.keys(pages).map((k) => pages[k]);
  return <TopNav pageList={pageList} onPageChanged={defaultHandler} />;
};
