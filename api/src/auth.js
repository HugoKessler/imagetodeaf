const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { capture } = require("./sentry");

const config = require("./config");
const { validatePassword } = require("./utils");

const EMAIL_OR_PASSWORD_INVALID = "EMAIL_OR_PASSWORD_INVALID";
const PASSWORD_INVALID = "PASSWORD_INVALID";
const EMAIL_AND_PASSWORD_REQUIRED = "EMAIL_AND_PASSWORD_REQUIRED";
const PASSWORD_TOKEN_EXPIRED_OR_INVALID = "PASSWORD_TOKEN_EXPIRED_OR_INVALID";
const PASSWORDS_NOT_MATCH = "PASSWORDS_NOT_MATCH";
const SERVER_ERROR = "SERVER_ERROR";
const USER_ALREADY_REGISTERED = "USER_ALREADY_REGISTERED";
const PASSWORD_NOT_VALIDATED = "PASSWORD_NOT_VALIDATED";
const ACOUNT_NOT_ACTIVATED = "ACOUNT_NOT_ACTIVATED";
const USER_NOT_EXISTS = "USER_NOT_EXISTS";

const mailservice = require("./emails");

mailservice.init("contact@datadvise.com", "contact");

const COOKIE_MAX_AGE = 2592000000;
const JWT_MAX_AGE = 86400;

class Auth {
  constructor(model) {
    this.model = model;
  }

  async signin(req, res) {
    let { password, email } = req.body;
    email = (email || "").trim().toLowerCase();

    //@todo
    const user = { email, password };
    const token = jwt.sign({ _id: "5e3043a9ae27be6d1b7ec5ce" }, config.secret, { expiresIn: JWT_MAX_AGE });
    const opts = { maxAge: COOKIE_MAX_AGE, secure: config.ENVIRONMENT === "development" ? false : true, httpOnly: false };
    res.cookie("jwt", token, opts);
    return res.status(200).send({ ok: true, token, user });

    if (!email || !password) return res.status(400).send({ ok: false, code: EMAIL_AND_PASSWORD_REQUIRED });

    try {
      const user = await this.model.findOne({ email });
      if (!user) return res.status(401).send({ ok: false, code: USER_NOT_EXISTS });

      // simplify
      const match = await user.comparePassword(password);
      if (!match) return res.status(401).send({ ok: false, code: EMAIL_OR_PASSWORD_INVALID });

      user.set({ last_login_at: Date.now() });
      await user.save();

      const token = jwt.sign({ _id: user.id }, config.secret, { expiresIn: JWT_MAX_AGE });
      const opts = { maxAge: COOKIE_MAX_AGE, secure: config.ENVIRONMENT === "development" ? false : true, httpOnly: false };
      res.cookie("jwt", token, opts);

      return res.status(200).send({ ok: true, token, user });
    } catch (error) {
      capture(error);
      return res.status(500).send({ ok: false, code: SERVER_ERROR });
    }
  }

  async signup(req, res) {
    try {
      const { password, email, name } = req.body;

      if (!validatePassword(password)) return res.status(200).send({ ok: false, user: null, code: PASSWORD_NOT_VALIDATED });

      const user = await this.model.create({ name, password, email });
      const token = jwt.sign({ _id: user._id }, config.secret, { expiresIn: JWT_MAX_AGE });
      const opts = { maxAge: COOKIE_MAX_AGE, secure: config.ENVIRONMENT === "development" ? false : true, httpOnly: false };
      res.cookie("jwt", token, opts);

      return res.status(200).send({ user, token, ok: true });
    } catch (error) {
      if (error.code === 11000) return res.status(409).send({ ok: false, code: USER_ALREADY_REGISTERED });
      capture(error);
      return res.status(500).send({ ok: false, code: SERVER_ERROR });
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie("jwt");
      return res.status(200).send({ ok: true });
    } catch (error) {
      capture(error);
      return res.status(500).send({ ok: false, error });
    }
  }

  async signinToken(req, res) {
    try {
      const { user } = req;
      user.set({ last_login_at: Date.now() });
      const u = await user.save();
      // console.log(u.email, user.email);
      res.send({ user, token: req.cookies.jwt, ok: true });
    } catch (error) {
      capture(error);
      return res.status(500).send({ ok: false, code: SERVER_ERROR });
    }
  }

  async resetPassword(req, res) {
    try {
      const match = await req.user.comparePassword(req.body.password);
      if (!match) {
        return res.status(401).send({ ok: false, code: PASSWORD_INVALID });
      }
      if (req.body.newPassword !== req.body.verifyPassword) {
        return res.status(422).send({ ok: false, code: PASSWORDS_NOT_MATCH });
      }
      if (!validatePassword(req.body.newPassword)) {
        return res.status(400).send({ ok: false, code: PASSWORD_NOT_VALIDATED });
      }
      const obj = await this.model.findById(req.user._id);

      obj.set({ password: req.body.newPassword });
      await obj.save();
      return res.status(200).send({ ok: true, user: obj });
    } catch (error) {
      capture(error);
      return res.status(500).send({ ok: false, code: SERVER_ERROR });
    }
  }

  async forgotPassword(req, res, cta) {
    try {
      const obj = await this.model.findOne({ email: req.body.email.toLowerCase() });

      if (!obj) return res.status(401).send({ ok: false, code: EMAIL_OR_PASSWORD_INVALID });

      if (!obj.password) return res.status(401).send({ ok: false, code: ACOUNT_NOT_ACTIVATED, user: obj });

      const token = await crypto.randomBytes(20).toString("hex");
      obj.set({ forgot_password_reset_token: token, forgot_password_reset_expires: Date.now() + JWT_MAX_AGE });
      await obj.save();

      const subject = "Reset your password";
      const body = `A request to reset your password has been made, if you did this you can <a href="${cta}?token=${token}">Reset Password</a>`;
      await mailservice.sendEmail(obj.email, subject, body);

      res.status(200).send({ ok: true });
    } catch (error) {
      capture(error);
      return res.status(500).send({ ok: false, code: SERVER_ERROR });
    }
  }

  async forgotPasswordReset(req, res) {
    try {
      const obj = await this.model.findOne({
        forgot_password_reset_token: req.body.token,
        forgot_password_reset_expires: { $gt: Date.now() },
      });

      if (!obj) return res.status(400).send({ ok: false, code: PASSWORD_TOKEN_EXPIRED_OR_INVALID });

      if (!validatePassword(req.body.password)) return res.status(400).send({ ok: false, code: PASSWORD_NOT_VALIDATED });

      obj.password = req.body.password;
      obj.forgot_password_reset_token = "";
      obj.forgot_password_reset_expires = "";
      await obj.save();
      return res.status(200).send({ ok: true });
    } catch (error) {
      capture(error);
      return res.status(500).send({ ok: false, code: SERVER_ERROR });
    }
  }
}

module.exports = Auth;
