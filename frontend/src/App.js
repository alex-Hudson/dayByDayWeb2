// frontend/src/App.js

import React, { Component } from "react";
import axios from "axios";
import logo from "./lym-rush-logo-white.png";
import arrowRight from "./arrow-right.png";
import arrowLeft from "./arrow-left.png";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted: false,
      activeItem: {
        title: "",
        description: "",
        completed: false,
        reading_date: ""
      },
      todoList: []
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  /**
   * Gets all ToDo Items in database
   */
  refreshList = () => {
    axios
      .get("http://localhost:8000/api/todos/")
      .then(res => {
        const toDoList = res.data;
        this.setState({ todoList: toDoList });
        this.setState({ currentItem: this.getTodaysReading() });
      })
      .catch(err => console.log(err));
  };

  /**
   *
   */
  sortDyDate(toDoList) {
    toDoList.forEach(item => {
      item.reading_date = new Date(item.reading_date);
    });
    const sortedActivities = toDoList.sort((a, b) => {
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
    const toDoList = this.state.todoList;
    const currentItem = this.getClosestReadingToToday([...toDoList]);
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
  displayCompleted = status => {
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
          <span className={`todo-title mr-2`}>{item.title}</span>
        </li>
        <p className={"todo-item"}>{item.bible_text}</p>
        <p className={"todo-item"}>{item.question_text}</p>
        <p className={"todo-item prayer-text"}>{item.prayer_text}</p>
      </div>
    );
  };

  renderSidebar() {
    const items = this.state.todoList;
    if (!items) return null;
    return items.map(item => (
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

  /**
   * Renders main page
   */
  render() {
    if (!this.state.currentItem) return null;
    return (
      <main className="content">
        <div className={"page-header"}>
          <img className={"logo"} src={logo} alt="lym-logo" />
        </div>
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
   * Formats date from server into human readable
   * @param {string} dateString
   */
  formatDate(dateString) {
    if (!dateString) return null;
    const d = new Date(dateString);
    const formattedDateString = d.toLocaleDateString("en-UK", {
      weekday: "long",
      month: "long",
      day: "numeric"
    });

    return formattedDateString;
  }

  forwardClick = e => {
    const currentIndex = this.state.todoList.findIndex(
      item => item.id === this.state.currentItem.id
    );
    this.setState({
      currentItem:
        this.state.todoList[currentIndex - 1] || this.state.currentItem
    });
  };

  backwardClick = e => {
    const currentIndex = this.state.todoList.findIndex(
      item => item.id === this.state.currentItem.id
    );
    this.setState({
      currentItem:
        this.state.todoList[currentIndex + 1] || this.state.currentItem
    });
  };
}
export default App;
