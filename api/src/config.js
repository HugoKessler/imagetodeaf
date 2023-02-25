const ENVIRONMENT = getEnvironment();
const MONGO_URL = process.env.DB_ENDPOINT || "";
const PORT = process.env.PORT || 3000;
const secret = process.env.SECRET || "not-so-secret";

let APP_URL = "";

if (ENVIRONMENT === "development") {
  APP_URL = "http://localhost:8083";
}

if (ENVIRONMENT === "production") {
  APP_URL = "http://snu-app-production.eba-urmwmjyu.eu-west-3.elasticbeanstalk.com";
}

module.exports = {
  PORT,
  MONGO_URL,
  secret,
  APP_URL,
  ENVIRONMENT,
};

function getEnvironment() {
  return process.env.DEV === "true" ? "development" : "production";
}
