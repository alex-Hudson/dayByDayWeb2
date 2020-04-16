// frontend/src/App.js

import React, { Component } from "react";
import axios from "axios";
import logo from "./lym-rush-logo-white.png";
import arrowRight from "./arrow-right.png";
import arrowLeft from "./arrow-left.png";
import Nav from "./components/Nav";
import LoginForm from "./components/LoginForm";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted: false,
      activeItem: {
        title: "",
        description: "",
        completed: false,
        reading_date: "",
      },
      readingList: [],
      displayed_form: "",
      logged_in: localStorage.getItem("token") ? true : false,
      username: "",
    };
    this.baseUrl = window.location.protocol + "//" + window.location.host;
  }

  componentDidMount() {
    if (this.state.logged_in) {
      fetch(`${this.baseUrl}/current_user/`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          this.setState({ username: json.username });
          this.refreshList();
        });
    }
  }

  /**
   * Gets all reading Items in database
   */
  refreshList = () => {
    axios
      .get(`${this.baseUrl}/api/readings/`, {
        headers: {
          "Content-type": "application/json",
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const readingList = res.data;
        this.setState({ readingList: readingList });
        this.setState({ currentItem: this.getTodaysReading() });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          loginError: true,
          logged_in: false,
          username: null,
          displayed_form: "login",
          currentItem: null,
        });
        localStorage.removeItem("token");
      });
  };

  getCookie(name) {
    if (!document.cookie) {
      return null;
    }

    const xsrfCookies = document.cookie
      .split(";")
      .map((c) => c.trim())
      .filter((c) => c.startsWith(name + "="));

    if (xsrfCookies.length === 0) {
      return null;
    }
    return decodeURIComponent(xsrfCookies[0].split("=")[1]);
  }

  handle_login = (e, data) => {
    const csrfCookie = this.getCookie("csrftoken");
    this.setState({ loginError: false });
    e.preventDefault();
    fetch(`${this.baseUrl}/token-auth/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFTOKEN": csrfCookie,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((json) => {
        localStorage.setItem("token", json.token);
        this.setState({
          logged_in: true,
          displayed_form: "",
          username: json.user.username,
        });
        this.refreshList();
      })
      .catch((error) => {
        this.setState({
          loginError: true,
          logged_in: false,
          username: null,
          displayed_form: "login",
          currentItem: null,
        });
        localStorage.removeItem("token");
      });
  };

  handle_logout = () => {
    localStorage.removeItem("token");
    this.setState({ logged_in: false, username: "" });
  };

  display_form = (form) => {
    this.setState({
      displayed_form: form,
    });
  };

  renderLoginError() {
    return <div className="login-failed">Incorrect username or password</div>;
  }

  /**
   *
   */
  sortDyDate(readingList) {
    readingList.forEach((item) => {
      item.reading_date = new Date(item.reading_date);
    });
    const sortedActivities = readingList.sort((a, b) => {
      const dateA = new Date(a.reading_date);
      const dateB = new Date(b.reading_date);
      return dateA - dateB;
    });
    return sortedActivities;
  }

  /**
   * Returns readings recording for today
   */
  getTodaysReading = () => {
    const readingList = this.state.readingList;
    const currentItem = this.getClosestReadingToToday([...readingList]);
    this.setState({ currentItem });
    return currentItem;
  };

  getClosestReadingToToday(list) {
    const today = new Date();
    list.sort(function(a, b) {
      var distancea = Math.abs(today - new Date(a.reading_date));
      var distanceb = Math.abs(today - new Date(b.reading_date));
      return distancea - distanceb; // sort a before b when the distance is smaller
    });
    return list[0];
  }

  /**
   * Displays completed items
   */
  displayCompleted = (status) => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }
    return this.setState({ viewCompleted: false });
  };

  /**
   * Sets state to clicked item in the list
   * @param {Object} item
   */
  handleSidebarItemClick(item) {
    this.setState({ currentItem: item });
  }

  /**
   * Displays list of items
   */
  renderItems = () => {
    const item = this.state.currentItem;
    if (!item) return null;
    return (
      <div className={"items"} key={item.id}>
        <li
          key={item.id}
          className="d-flex justify-content-between align-items-center"
        >
          <span className={`reading-title mr-2`}>{item.title}</span>
        </li>
        <p className={"reading-item"}>{item.bible_text}</p>
        <p className={"reading-item"}>{item.question_text}</p>
        <p className={"reading-item prayer-text"}>{item.prayer_text}</p>
      </div>
    );
  };

  renderSidebar() {
    const items = this.state.readingList;
    if (!items) return null;
    return items.map((item) => (
      <li
        key={item.id}
        className="sidebar-item"
        value={item.id}
        onClick={() => {
          this.handleSidebarItemClick(item);
        }}
      >
        <span className={`siderbar-title`}>
          {item.title}
          <p>{this.formatDate(item.reading_date)}</p>
        </span>
      </li>
    ));
  }

  renderApp() {
    if (!this.state.currentItem) return null;

    return (
      <main className="content">
        <div className={"arrow-container"}>
          <div className={"back-button"} onClick={this.backwardClick}>
            <img className={"arrow-left"} src={arrowLeft} alt="back" />
          </div>
          <div className="text-black my-4 page-title">
            {this.formatDate(this.state.currentItem.reading_date)}
          </div>
          <div className={"forward-button"} onClick={this.forwardClick}>
            <img className={"arrow-right"} src={arrowRight} alt="forward" />
          </div>
        </div>
        <div className={"sidebar-list-container"}>
          <ul className="sidebar-list">{this.renderSidebar()}</ul>
        </div>
        <ul className="list-group list-group-flush">{this.renderItems()}</ul>
      </main>
    );
  }

  /**
   * Renders main page
   */
  render() {
    const form = this.state.logged_in ? null : (
      <LoginForm handle_login={this.handle_login} />
    );
    const loginErrorMsg = this.state.loginError
      ? this.renderLoginError()
      : null;

    return (
      <div className="App">
        <div className={"page-header"}>
          <img className={"logo"} src={logo} alt="lym-logo" />
        </div>
        <Nav
          logged_in={this.state.logged_in}
          display_form={this.display_form}
          handle_logout={this.handle_logout}
        />
        {form}
        {loginErrorMsg}
        {this.state.logged_in ? this.renderApp() : null}
      </div>
    );
  }

  /**
   * Formats date from server into human readable
   * @param {string} dateString
   */
  formatDate(dateString) {
    if (!dateString) return null;
    const d = new Date(dateString);
    const formattedDateString = d.toLocaleDateString("en-UK", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

    return formattedDateString;
  }

  forwardClick = (e) => {
    const currentIndex = this.state.readingList.findIndex(
      (item) => item.id === this.state.currentItem.id
    );
    this.setState({
      currentItem:
        this.state.readingList[currentIndex - 1] || this.state.currentItem,
    });
  };

  backwardClick = (e) => {
    const currentIndex = this.state.readingList.findIndex(
      (item) => item.id === this.state.currentItem.id
    );
    this.setState({
      currentItem:
        this.state.readingList[currentIndex + 1] || this.state.currentItem,
    });
  };
}
export default App;
