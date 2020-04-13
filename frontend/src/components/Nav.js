import React from "react";
import PropTypes from "prop-types";

function Nav(props) {
  const logged_out_nav = (
    <div onClick={() => props.display_form("login")}>Login</div>
  );

  const logged_in_nav = (
    <div className={"logout-container"} onClick={props.handle_logout}>
      Logout
    </div>
  );
  return <div>{props.logged_in ? logged_in_nav : logged_out_nav}</div>;
}

export default Nav;

Nav.propTypes = {
  logged_in: PropTypes.bool.isRequired,
  display_form: PropTypes.func.isRequired,
  handle_logout: PropTypes.func.isRequired
};
