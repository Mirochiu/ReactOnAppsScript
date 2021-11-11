import React from 'react';
import { Nav, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import PropTypes from 'prop-types';

const IconNavLink = ({ iconComp, linkTo, children }) => {
  return (
    <LinkContainer to={linkTo}>
      <Nav.Link>
        <div className="d-flex align-items-center">
          {iconComp} {children}
        </div>
      </Nav.Link>
    </LinkContainer>
  );
};

IconNavLink.propTypes = {
  iconComp: PropTypes.element,
  linkTo: PropTypes.string,
  children: PropTypes.element,
};

export default IconNavLink;

export const ButtomIconNavLink = ({ iconComp, linkTo, children }) => {
  return (
    <LinkContainer to={linkTo}>
      <Nav.Link className="bottom-nav-link">
        <Row className="d-flex align-items-center flex-column justify-content-center">
          {iconComp}
          <small>
            <small>{children}</small>
          </small>
        </Row>
      </Nav.Link>
    </LinkContainer>
  );
};

ButtomIconNavLink.propTypes = {
  iconComp: PropTypes.element,
  linkTo: PropTypes.string,
  children: PropTypes.element,
};
