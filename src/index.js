// import React from "react";
// import { render } from "react-dom";

// import Home from "./page/Home/index.jsx";

// const App = () => {
//   return (
//     <div>
//       <Home />
//     </div>
//   );
// };

// render(<App />, document.querySelector("#app"));

import App from "./page/App";

const app = new App({
  target: document.body,
});

export default app;
