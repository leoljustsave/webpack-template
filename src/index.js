import React from "react";
import { render } from "react-dom";

// routes
import { HashRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import routes from "@/routes";

render(<HashRouter>{renderRoutes(routes)}</HashRouter>, document.querySelector("#app"));
