// frontend/src/App.js

import React, { Component } from "react";
import Modal from "./components/Modal";
import axios from "axios";

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
        this.setState({ todoList: this.getTodaysReading() });
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
    console.log(toDoList);
    const filteredToDo = [];
    toDoList.forEach(toDoItem => {
      if (isToday(new Date(toDoItem.reading_date))) filteredToDo.push(toDoItem);
    });
    console.log(filteredToDo, [filteredToDo[0]]);
    return [filteredToDo[0]];
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
    const items = this.state.todoList;
    return items.map(item => (
      <div key={item.id}>
        <li
          key={item.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <span className={`todo-title mr-2`}>{item.title}</span>
        </li>
        <p className={"todo-item"}>{item.bible_text}</p>
        <p className={"todo-item"}>{item.question_text}</p>
        <p className={"todo-item"}>{item.prayer_text}</p>
      </div>
    ));
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
    console.log(this.state.todoList);

    return (
      <main className="content">
        <h1 className="text-white text-center my-4">
          {this.formatDate(
            this.state.todoList[0] && this.state.todoList[0].reading_date
          )}
        </h1>
        <div className="row ">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <ul className="list-group list-group-flush">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
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
}
export default App;
