import React from "react";
import { render } from "react-dom";

import Home from "pages/Home";

const App = () => {
  return (
    <div>
      <Home />
    </div>
  );
};

render(<App />, document.querySelector("#app"));
