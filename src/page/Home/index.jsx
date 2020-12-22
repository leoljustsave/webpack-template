import React from "react";

import "./index.scss";

const Home = () => {
  return (
    <div className="home-wrap">
      <h3 className="title">Todo 12</h3>
      <section className="btn-group">
        <input type="text" />
        <input type="button" value="more" />
      </section>
      <section className="todo-list">
        <p className="todo-item"></p>
      </section>
    </div>
  );
};

export default Home;
