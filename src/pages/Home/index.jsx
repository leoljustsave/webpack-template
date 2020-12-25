import React from "react";
import { isIOS } from "@/utils";

import "./index.scss";

const ios = isIOS();

const Home = () => {
  return <div className={`box ${ios ? "jpg" : "webp"}`}></div>;
};

export default Home;
