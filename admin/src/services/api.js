import URI from "urijs";
import { apiURL } from "../config";
import fetchRetry from "fetch-retry";
import "isomorphic-fetch";

let fetch = window.fetch;

class ApiService {
  constructor() {
    this.token = "";
  }

  setToken(token) {
    this.token = token;
  }

  getUrl = (path, query = {}) => {
    return new URI().origin(apiURL).path(path).setSearch(query).toString();
  };

  execute = async ({ method, path = "", body = null, query = {}, headers = {} } = {}) => {
    try {
      const options = {
        method,
        credentials: "include",
        mode: "cors",
        headers: {
          ...headers,
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `JWT ${this.token}`,
        },
        retries: 3,
        retryDelay: 1000,
      };

      if (body) options.body = JSON.stringify(body);

      const url = this.getUrl(path, query);
      // console.log("url", url);
      const response = await fetch(url, options);

      if (!response.ok && response.status === 401) {
        if (this.logout) this.logout("401");
      }

      try {
        const res = await response.json();
        return res;
      } catch (errorFromJson) {
        console.log({ errorFromJson });
      }
      return response;
    } catch (errorExecuteApi) {
      console.log({ errorExecuteApi });
    }
    return {
      ok: false,
      error: "Une erreur est survenue, l'équipe technique est prévenue, veuillez nous en excuser.",
    };
  };

  post = (args) => this.execute({ method: "POST", ...args });
  get = async (args) => this.execute({ method: "GET", ...args });
  put = (args) => this.execute({ method: "PUT", ...args });
  delete = (args) => this.execute({ method: "DELETE", ...args });

  uploadFile(path, files, properties) {
    console.log("files", files);
    let formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("video", files[i], "video");
    }
    console.log("formData,", formData);
    // formData.append("body", JSON.stringify({ ...properties }));
    return new Promise((resolve, reject) => {
      try {
        fetch(this.getUrl(path), {
          retries: 3,
          retryDelay: 1000,
          retryOn: [502, 503, 504],
          mode: "cors",
          method: "POST",
          credentials: "include",
          body: formData,
        })
          .then((res) => res.json())
          .then(resolve);
      } catch (e) {
        reject(e);
      }
    });
  }
}

function initApi() {
  fetch = fetchRetry(window.fetch);
}

const API = new ApiService();
export default API;

export { initApi };
