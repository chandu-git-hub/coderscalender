import React from "react";
import { Link, withRouter } from "react-router-dom";
function NavigationBar(props) {
  return (
    <div className="navigation">
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container">
          <Link
            className="navbar-brand"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Open Website"
          >
            Contests
          </Link>
          <div>
            <ul className="navbar-nav ml-auto">
              <li>
                <Link
                  className="nav-link"
                  to="/"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="See Contests"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="nav-link"
                  to="/Subscribe"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Subscribe/Unsubscribe Websites"
                >
                  Subscribe
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default withRouter(NavigationBar);
