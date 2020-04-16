import React from "react";
import PropTypes from "prop-types";

class LoginForm extends React.Component {
  state = {
    username: "",
    password: ""
  };

  handle_change = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevstate => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });
  };

  render() {
    return (
      <form
        className={"login-form"}
        onSubmit={e => this.props.handle_login(e, this.state)}
      >
        <label className="login-label" htmlFor="username">
          Username
          <input
            type="text"
            name="username"
            value={this.state.username}
            className="login-input"
            onChange={this.handle_change}
          />
        </label>
        <label className="login-label" htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            value={this.state.password}
            className="login-input"
            onChange={this.handle_change}
          />
        </label>
        <br />
        <input className="login-submit" type="submit" />
      </form>
    );
  }
}

export default LoginForm;

LoginForm.propTypes = {
  handle_login: PropTypes.func.isRequired
};
