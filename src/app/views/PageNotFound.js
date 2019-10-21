import React from 'react';
import { Link } from 'react-router';

const PageNotFound = () => (
  <div>
    <section className="hero is-danger is-medium is-bold">
      <div className="hero-body container">
        <h2 className="title">Sorry</h2>
        <h3 className="subtitle">The server is Unreachable</h3>
      </div>
    </section>
    <div className="row expanded">
      <div className="columns large-12 top-buffer text-right details">
        <h4 className="subtitle">
          <Link to="/login">Login here</Link>
        </h4>
      </div>
    </div>
  </div>
);

export default PageNotFound;
