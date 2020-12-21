const portfinder = require("portfinder");

module.export.getRightPort = async (basePort = 8000) => {
  portfinder.basePort = basePort;

  try {
    await portfinder.getPortPromise();
  } catch {
    throw new Error("> portfinder lib has some trouble during find nice port");
  }
};
