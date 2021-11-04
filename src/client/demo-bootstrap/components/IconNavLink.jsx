import React from 'react';
import { Nav } from 'react-bootstrap';
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
