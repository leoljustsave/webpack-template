import React, { useEffect } from "react";

import pic from "./1.jpg";

import "./index.scss";

const Home = () => {
  useEffect(() => {
    window.scrollTo({
      top: 100,
    });
  }, []);

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
      <section>
        <img src={pic} alt="" />
      </section>
    </div>
  );
};

export default Home;
