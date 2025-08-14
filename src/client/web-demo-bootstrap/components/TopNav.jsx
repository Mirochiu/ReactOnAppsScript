import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';

const ClickableIcon = ({
  customizedIcon,
  icon,
  label = '',
  onClick = () => {},
}) => {
  const iconRender = () => {
    if (customizedIcon) return customizedIcon;
    return (
      <div className="d-flex align-items-center">
        {icon}
        {label}
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
          <img
            className="me-3"
            src="https://storage.googleapis.com/react-on-apps-script/website-logo.png"
            alt="Website-Logo"
            width={32}
            height={32}
            style={{ filter: 'drop-shadow(2px 2px 2px #222)' }}
            // https://developer.mozilla.org/en-US/docs/Web/CSS/filter#drop-shadow()
          />
          React on AppScript
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="align-items-start align-items-lg-center">
            {pageList.map((page, idx) => (
              <ClickableIcon
                {...page}
                key={`top-icon-${idx}`}
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
