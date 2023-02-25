const Sentry = require("@sentry/node");
const { ENVIRONMENT } = require("./config");

if (ENVIRONMENT === "production") {
  Sentry.init({
    dsn: "",
    environment: "server",
  });
}

function capture(err) {
  if (Sentry && err) {
    console.log("capture", err);
    Sentry.captureException(err);
  }
}

module.exports = {
  capture,
};
