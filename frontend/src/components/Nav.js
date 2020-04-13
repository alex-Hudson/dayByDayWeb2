import React from "react";
import PropTypes from "prop-types";

function Nav(props) {
  const logged_in_nav = (
    <div className={"logout-container"} onClick={props.handle_logout}>
      Logout
    </div>
  );
  return <div>{props.logged_in ? logged_in_nav : null}</div>;
}

export default Nav;

Nav.propTypes = {
  logged_in: PropTypes.bool.isRequired,
  display_form: PropTypes.func.isRequired,
  handle_logout: PropTypes.func.isRequired
};
