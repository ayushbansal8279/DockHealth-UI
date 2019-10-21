import React from 'react';
import { Link } from 'react-router';

const NavLink = ({ to, children }) => (
  <li>
    <Link activeClassName="is-active" className="nav-item is-tab" to={to}>
      <svg className="icon medium-2" />
      {children}
    </Link>
  </li>
);

const LinksDefault = ({ className }) => (
  <ul className={className}>
    <NavLink to="/">Home</NavLink>
  </ul>
);

const NavBarAuth = () => (
  <nav>
    <div className="row">
      <div className="large-12 columns">
        <ul className="menu float-left" />
        <LinksDefault className="menu float-right" />
      </div>
    </div>
  </nav>
);

export default NavBarAuth;
