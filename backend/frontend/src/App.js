// frontend/src/App.js

import React, { Component } from "react";
import axios from "axios";
import logo from "./lym-rush-logo-white.png";
import DayByDayLogo from "./DayByDayLogo.svg";
import Nav from "./components/Nav";
import LoginForm from "./components/LoginForm";
import {
  LeftCircleOutlined,
  RightCircleOutlined,
  FacebookOutlined,
  InstagramOutlined,
  ReadOutlined,
  BulbOutlined,
  MessageOutlined,
} from "@ant-design/icons";

class App extends Component {
  constructor(props) {
    super(props);
    this.requiresLogin = false;
    this.isMobile = window.innerWidth > 600 ? false : true;
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
      logged_in:
        localStorage.getItem("token") || !this.requiresLogin ? true : false,
      username: "",
    };
    this.baseUrl = window.location.protocol + "//" + window.location.host;
  }

  componentDidMount() {
    if (this.state.logged_in) {
      if (this.requiresLogin) {
        fetch(`${this.baseUrl}/current_user/`, {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        })
          .then((res) => res.json())
          .then((json) => {
            this.setState({ username: json.username });
            this.refreshList();
            // this.getNewsItem();
          });
      } else {
        this.getReadingForToday();
        this.refreshList();
        // this.getNewsItem();
      }
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
        this.setState({ readingList: this.removeFutureReadings(readingList) });
        this.setState({ currentItem: this.getTodaysReading() });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          loginError: true,
          logged_in: this.requiresLogin || false,
          username: null,
          displayed_form: "login",
          currentItem: null,
        });
        localStorage.removeItem("token");
      });
  };

  getNewsItem = () => {
    axios
      .get(`${this.baseUrl}/api/news_items/`, {
        headers: {
          "Content-type": "application/json",
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const news_items = res.data;
        this.setState({ news_items });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          loginError: true,
          logged_in: this.requiresLogin || false,
          username: null,
          displayed_form: "login",
          currentItem: null,
        });
        localStorage.removeItem("token");
      });
  };

  getReadingForToday = () => {
    axios
      .get(`${this.baseUrl}/api/todays_reading/`, {
        headers: {
          "Content-type": "application/json",
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const reading = res.data;
        this.setState({ currentItem: reading[0] });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          loginError: true,
          logged_in: this.requiresLogin || false,
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
        // this.getNewsItem();
      })
      .catch((error) => {
        this.setState({
          loginError: true,
          logged_in: this.requiresLogin || true,
          username: null,
          displayed_form: "login",
          currentItem: null,
        });
        localStorage.removeItem("token");
      });
  };

  handle_logout = () => {
    localStorage.removeItem("token");
    this.setState({ logged_in: this.requiresLogin || false, username: "" });
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

  removeFutureReadings(readingList) {
    const today = new Date();
    const newReadings = readingList.filter((reading) => {
      return new Date(reading.reading_date) <= today;
    });

    return newReadings;
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

  getTodaysNewsItem = () => {
    const newsItems = this.state.news_items;
    if (!newsItems) return null;
    return this.getClosestNewsItemToToday(newsItems);
  };

  getClosestNewsItemToToday(list) {
    const today = new Date();
    list.sort(function(a, b) {
      var distancea = Math.abs(today - new Date(a.news_date));
      var distanceb = Math.abs(today - new Date(b.news_date));
      return distancea - distanceb; // sort a before b when the distance is smaller
    });
    if (!list[0]) return null;
    return list[0].news_item_text;
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
        <div key={item.id} className="reading-title">
          {item.title}
        </div>
        {this.createCircleIcon(
          <ReadOutlined
            style={{ fontSize: "30px", color: "#13395c" }}
            className={"circle-icon-logo"}
          />,
          "Read"
        )}
        {this.parseString(item.bible_text, "reading-item")}
        {this.createCircleIcon(
          <BulbOutlined
            style={{ fontSize: "30px", color: "#13395c" }}
            className={"circle-icon-logo"}
          />,
          "Engage"
        )}
        {this.parseString(item.question_text, "reading-item")}
        {this.createCircleIcon(
          <MessageOutlined
            style={{ fontSize: "30px", color: "#13395c" }}
            className={"circle-icon-logo"}
          />,
          "Pray"
        )}
        {this.parseString(item.prayer_text, "reading-item prayer-text")}
        {this.isMobile ? (
          <div className={"page-footer"}>
            {/* <InstagramOutlined onClick={this.handleIGClick} />
            <FacebookOutlined onClick={this.handleFBClick} /> */}
            {/* <img
              className={"logo"}
              src={logo}
              alt="lym-logo"
              onClick={this.handleLogoClick}
            /> */}
            <div className={"day-by-day-title"}>Day By Day</div>
          </div>
        ) : null}
      </div>
    );
  };

  parseString(string, className) {
    const stringArray = string.split("/n");
    return stringArray.map((string) => {
      return (
        <p key={string.slice(10)} className={className}>
          {this.parseSuperScript(string)}
        </p>
      );
    });
  }

  parseSuperScript(string) {
    if (
      string.indexOf("/^") === -1 &&
      string.indexOf("/b") === -1 &&
      string.indexOf("/i") === -1
    )
      return string;
    const strings = string.split(new RegExp("/"));

    const letters = [];
    strings.forEach((string) => {
      string.replace(/\//g, "");
      const firstSpaceIndex = string.indexOf(" ");
      if (firstSpaceIndex !== -1 && string[0] === "^") {
        letters.push(<sup>{string.slice(1, firstSpaceIndex)}</sup>);
        string = string.slice(firstSpaceIndex);
      } else if (firstSpaceIndex !== -1 && string[0] === "b") {
        letters.push(<b>{string.slice(1, firstSpaceIndex)}</b>);
        string = string.slice(firstSpaceIndex);
      } else if (firstSpaceIndex !== -1 && string[0] === "i") {
        letters.push(<i>{string.slice(1, firstSpaceIndex)}</i>);
        string = string.slice(firstSpaceIndex);
      }
      for (const letter of string) {
        letters.push(letter);
      }
    });

    return letters;
  }

  createCircleIcon(icon, text) {
    return (
      <div className={"header-dot"}>
        {icon}
        <div className={"header-text"}>{text}</div>
      </div>
    );
  }

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
      <div className={"main-div"}>
        <div className={"day-by-day-logo"}>
          <img
            className={"day-by-day-logo-img"}
            src={DayByDayLogo}
            alt="DayByDayLogo"
          ></img>
        </div>
        <div className={"arrow-container"}>
          <div className={"back-button"} onClick={this.backwardClick}>
            <LeftCircleOutlined style={{ fontSize: "25px" }} />
          </div>
          <div className="page-title">
            {this.formatDate(this.state.currentItem.reading_date)}
          </div>
          <div className={"forward-button"} onClick={this.forwardClick}>
            <RightCircleOutlined style={{ fontSize: "25px" }} />
          </div>
        </div>
        <div className={"sidebar-list-container"}>
          <ul className="sidebar-list">{this.renderSidebar()}</ul>
        </div>
        <ul className="list-group list-group-flush">{this.renderItems()}</ul>
        <div className={"news-bar"}>{this.getTodaysNewsItem()}</div>
      </div>
    );
  }

  handleLogoClick() {
    window.location.assign("https://www.lymingtonrushmore.org/");
  }

  handleFBClick() {
    window.location.assign("https://www.facebook.com/LRHolidays");
  }

  handleIGClick() {
    window.location.assign("https://www.instagram.com/lrholidays/");
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
        {!this.isMobile ? (
          <div className={"page-header"}>
            {/* <img
              className={"logo"}
              src={logo}
              alt="lym-logo"
              onClick={this.handleLogoClick}
            /> */}
          </div>
        ) : null}
        {this.requiresLogin ? (
          <Nav
            logged_in={this.state.logged_in}
            display_form={this.display_form}
            handle_logout={this.handle_logout}
          />
        ) : null}

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
      month: window.innerWidth > 600 ? "long" : "short",
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
