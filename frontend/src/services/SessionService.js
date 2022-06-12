import axios from "axios";

class Session {
  constructor() {
    this.SESSION_AUTH = "csp-session-auth";
    this.SESSION_DATA = "csp-session-data";
    this.SESSION_REPORT_DATA = "csp-last-report";
    this.api_url = process.env.ENV_API_URL || "localhost:8080";
  }

  _get(k) {
    return JSON.parse(localStorage.getItem(k));
  }

  _set(k, v) {
    localStorage.setItem(k, JSON.stringify(v));
    window.dispatchEvent(new Event("session-event"));
  }

  logged_in() {
    return this._get(this.SESSION_AUTH) != null;
  }

  log_out() {
    this._set(this.SESSION_DATA, null);
    this._set(this.SESSION_AUTH, null);
  }

  set_report_data(session_data) {
    this._set(this.SESSION_REPORT_DATA, session_data);
  }

  set_session_data(session_data) {
    this._set(this.SESSION_DATA, session_data);
  }

  session_data() {
    return this._get(this.SESSION_DATA);
  }

  report_data() {
    return this._get(this.SESSION_REPORT_DATA);
  }

  set_login(basic_authentication) {
    this._set(this.SESSION_AUTH, basic_authentication);
  }

  _get_base_url() {
    return "http://" + this.api_url;
  }
    
    async get_raw(url) {
        var payload = {
            headers: {
                authorization: this._get(this.SESSION_AUTH),
            },
        };         
        return axios.get(url, payload);
    }

  async get(endpoint, params_ = {}, urlParams = {}, custom = false) {
    var payload = {
      headers: {
        authorization: this._get(this.SESSION_AUTH),
      },
    };
    if (Object.keys(params_).length > 0) {
      payload["params"] = params_;
    }
    var url =
      this._get_base_url() + (custom ? "/customapi" : "/api") + "/" + endpoint;
    if (Object.keys(urlParams).length > 0) {
      const queryString = urlParams.toString();
      url += queryString.length > 0 ? "?" + queryString : "";
    }
    return axios.get(url, payload);
  }

  async delete(endpoint, params_, urlParams, custom) {
    var payload = {
      headers: {
        authorization: this._get(this.SESSION_AUTH),
      },
    };
    if (Object.keys(params_).length > 0) {
      payload["params"] = params_;
    }
    var url =
      this._get_base_url() + (custom ? "/customapi" : "/api") + "/" + endpoint;
    if (Object.keys(urlParams).length > 0) {
      const queryString = urlParams.toString();
      url += queryString.length > 0 ? "?" + queryString : "";
    }

    return axios.delete(url, payload);
  }
  /**
   * Creates a post request
   * @param {*} endpoint
   * @param {*} body E.g., format this as {description: 'Spyder'}, etc
   * @param {*} urlParams
   * @param {*} custom
   * @returns
   */
  async post(endpoint, body, urlParams, custom) {
    var payload = {
      headers: {
        authorization: this._get(this.SESSION_AUTH),
        "Content-Type": "application/json",
      },
    };

    var url =
      this._get_base_url() + (custom ? "/customapi" : "/api") + "/" + endpoint;
    if (Object.keys(urlParams).length > 0) {
      const queryString = urlParams.toString();
      url += queryString.length > 0 ? "?" + queryString : "";
    }

    return axios.post(url, body, payload);
  }

  async post_with_prefix(endpoint, body, urlParams, prefix) {
    var payload = {
      headers: {
        authorization: this._get(this.SESSION_AUTH),
        "Content-Type": "application/json",
      },
    };

    var url =
      this._get_base_url() + prefix + "/" + endpoint;
    if (Object.keys(urlParams).length > 0) {
      const queryString = urlParams.toString();
      url += queryString.length > 0 ? "?" + queryString : "";
    }

    return axios.post(url, body, payload);
  }

  async put(endpoint, body, urlParams, custom) {
    var payload = {
      headers: {
        authorization: this._get(this.SESSION_AUTH),
        "Content-Type": "application/json",
      },
    };

    var url =
      this._get_base_url() + (custom ? "/customapi" : "/api") + "/" + endpoint;
    if (Object.keys(urlParams).length > 0) {
      const queryString = urlParams.toString();
      url += queryString.length > 0 ? "?" + queryString : "";
    }

    return axios.put(url, body, payload);
  }

  async patch(endpoint, body, urlParams, custom) {
    var payload = {
      headers: {
        authorization: this._get(this.SESSION_AUTH),
        "Content-Type": "application/json",
      },
    };

    var url =
      this._get_base_url() + (custom ? "/customapi" : "/api") + "/" + endpoint;
    if (Object.keys(urlParams).length > 0) {
      const queryString = urlParams.toString();
      url += queryString.length > 0 ? "?" + queryString : "";
    }

    return axios.patch(url, body, payload);
  }
}

export default Session;
