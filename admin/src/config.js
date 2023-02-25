const forceProd = false;

const environment = getEnvironment();

let apiURL = "https://api.selego.com";

if (environment === "staging") apiURL = "https://api-staging.selego.fr";
if (environment === "development") apiURL = "http://localhost:3000";

const S3PREFIX = "https://datadvise.s3.eu-west-3.amazonaws.com/app";
const SENTRY_URL = "";

function getEnvironment() {
  if (window.location.href.indexOf("app-staging") !== -1) return "staging";
  if (window.location.href.indexOf("localhost") !== -1 || window.location.href.indexOf("127.0.0.1") !== -1) return "development";
  return "production";
}

export { apiURL, S3PREFIX, SENTRY_URL, environment };
