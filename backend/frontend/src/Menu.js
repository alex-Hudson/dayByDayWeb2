// <!--    Made by Erik Terwan    -->
// <!--   24th of November 2015   -->
// <!--        MIT License        -->
import React, { Component } from "react";
import "./Menu.scss";

export default class Menu extends React.Component {
  render() {
    return (
      <nav role="navigation">
        <div id="menuToggle">
          {/* <!--
      A fake / hidden checkbox is used as click reciever,
      so you can use the :checked selector on it.
      --> */}
          <input type="checkbox" />

          {/* <!--
      Some spans to act as a hamburger.
      
      They are acting like a real hamburger,
      not that McDonalds stuff.
      --> */}
          <span></span>
          <span></span>
          <span></span>

          {/* <!--
      Too bad the menu has to be inside of the button
      but hey, it's pure CSS magic.
      --> */}
          <ul id="menu">
            <li>Home</li>
            <li>About</li>
            <li>Info</li>
            <li>Contact</li>
            <li>Show me more</li>
          </ul>
        </div>
      </nav>
    );
  }
}
