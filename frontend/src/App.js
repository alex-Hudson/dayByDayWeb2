// frontend/src/App.js

import React, { Component } from "react";
import Modal from "./components/Modal";
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
      .then(res => this.setState({ todoList: res.data }))
      .then(() => {
        this.setState({ currentItem: this.getTodaysReading() });
      })
      .catch(err => console.log(err));
  };

  /**
   * Returns readings recording for today
   */
  getTodaysReading = () => {
    const toDoList = this.state.todoList;
    const isToday = someDate => {
      const today = new Date();
      return (
        someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear()
      );
    };
    const filteredToDo = [];
    toDoList.forEach(toDoItem => {
      if (isToday(new Date(toDoItem.reading_date))) filteredToDo.push(toDoItem);
    });
    this.setState({ currentItem: filteredToDo[0] });
    return filteredToDo[0];
  };

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
   * Displays list of items
   */
  renderItems = () => {
    const item = this.state.currentItem;
    if (!item) return null;
    console.log(item);
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
        <p className={"todo-item"}>{item.prayer_text}</p>
      </div>
    );
  };

  /**
   * Handles sumbit when creating new item
   */
  handleSubmit = item => {
    this.toggle();
    if (item.id) {
      axios
        .put(`http://localhost:8000/api/todos/${item.id}/`, item)
        .then(res => this.refreshList());
      return;
    }
    axios
      .post("http://localhost:8000/api/todos/", item)
      .then(res => this.refreshList());
  };

  /**
   * Renders main page
   */
  render() {
    return (
      <main className="content">
        <div className={"page-header"}>
          <img className={"logo"} src={logo} alt="lym-logo"></img>
        </div>
        <div>
          <div className={"back-button"} onClick={this.backwardClick}>
            <img className={"arrow-left"} src={arrowLeft} alt="back"></img>
          </div>
          <div className="text-black my-4 page-title">
            {this.formatDate(
              this.state.todoList[0] && this.state.todoList[0].reading_date
            )}
          </div>
          <div className={"forward-button"} onClick={this.forwardClick}>
            <img className={"arrow-right"} src={arrowRight} alt="forward"></img>
          </div>
        </div>

        <ul className="list-group list-group-flush">{this.renderItems()}</ul>

        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
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
    console.log(e);
  };

  backwardClick = e => {
    console.log(e);
    console.log(this.state);
  };
}
export default App;
