// frontend/src/App.js

import React, { Component } from "react";
import Modal from "./components/Modal";
import axios from "axios";
import Menu from "./Menu";

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
    console.log(filteredToDo);
    return filteredToDo;
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
   * Creates button to switch between completed and incomplete items
   */
  renderTabList = () => {
    return (
      <div className="my-5 tab-list">
        <span
          onClick={() => this.displayCompleted(true)}
          className={this.state.viewCompleted ? "active" : ""}
        >
          complete
        </span>
        <span
          onClick={() => this.displayCompleted(false)}
          className={this.state.viewCompleted ? "" : "active"}
        >
          Incomplete
        </span>
      </div>
    );
  };

  /**
   * Displays list of items
   */
  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.todoList.filter(
      item => item.completed === viewCompleted
    );
    return newItems.map(item => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${
            this.state.viewCompleted ? "completed-todo" : ""
          }`}
          title={item.description}
        >
          {item.title}
          {this.formatDate(item.reading_date)}
        </span>
        <span>
          <button
            onClick={() => this.viewReading(item)}
            className="btn btn-secondary mr-2"
          >
            View This Reading{" "}
          </button>

          <button
            onClick={() => this.editItem(item)}
            className="btn btn-secondary mr-2"
          >
            {" "}
            Edit{" "}
          </button>
          <button
            onClick={() => this.handleDelete(item)}
            className="btn btn-danger"
          >
            Delete{" "}
          </button>
        </span>
      </li>
    ));
  };

  /**
   *
   */
  toggle = () => {
    this.setState({ modal: !this.state.modal });
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
   * Deletes item
   */
  handleDelete = item => {
    axios
      .delete(`http://localhost:8000/api/todos/${item.id}`)
      .then(res => this.refreshList());
  };

  /**
   * Creates item with null fields
   */
  createItem = () => {
    const item = {
      title: "",
      description: "",
      completed: false,
      reading_date: ""
    };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  /**
   * Edit item
   */
  editItem = item => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  /**
   * Renders main page
   */
  render() {
    return (
      <main className="content">
        <Menu></Menu>
        <h1 className="text-white text-uppercase text-center my-4">
          Day By Day
        </h1>
        <div className="row ">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="">
                <button onClick={this.createItem} className="btn btn-primary">
                  Add task
                </button>
              </div>
              {this.renderTabList()}
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
    const d = new Date(dateString);
    const dtf = new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "2-digit"
    });
    const [{ value: mo }, , { value: da }, , { value: ye }] = dtf.formatToParts(
      d
    );
    return `${da}-${mo}-${ye}`;
  }

  /**
   * Stub
   */
  viewReading() {}
}
export default App;
