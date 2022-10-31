import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ClickableIcon = ({ icon, text = '', onClick = () => {} }) => {
  return (
    <Nav.Link onClick={onClick}>
      <Nav.Item>
        <Row>{icon}</Row>
        <Row>
          <span className="text-center small">{text}</span>
        </Row>
      </Nav.Item>
    </Nav.Link>
  );
};

const BottomNav = ({
  onPageChanged = () => {},
  pageList = [],
  pageFooter = false,
  isInvisible = false,
}) => {
  const getHandler = (p) => (e) => {
    e.preventDefault();
    onPageChanged(p);
  };

  const className = isInvisible
    ? 'invisible d-block d-md-none bg-light'
    : 'd-block d-md-none bg-light';

  return (
    <Navbar
      as={Row}
      variant="light"
      className={className}
      fixed={pageFooter ? undefined : 'bottom'}
    >
      <Nav as={Col} className="justify-content-around w-100">
        {pageList.map((page, idx) => (
          <ClickableIcon
            key={`${pageFooter ? 'footer' : 'bottom'}-icon-${idx}`}
            icon={page.icon}
            text={page.label}
            onClick={getHandler(page)}
          />
        ))}
      </Nav>
    </Navbar>
  );
};

export default BottomNav;

export const buildBottomNav = ({ pages, defaultHandler }) => {
  const pageList = [pages.home, pages.link_lister, pages.logout];
  return <BottomNav pageList={pageList} onPageChanged={defaultHandler} />;
};
