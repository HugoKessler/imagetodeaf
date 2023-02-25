const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const JWT_MAX_AGE = 86400;

const config = require("../config");
const { capture } = require("../sentry");
const { uploadToS3FromBuffer } = require("../utils");

const UserObject = require("../models/user");
const AuthObject = require("../auth");

const { validatePassword } = require("../utils");

const UserAuth = new AuthObject(UserObject);

const SERVER_ERROR = "SERVER_ERROR";
const USER_ALREADY_REGISTERED = "USER_ALREADY_REGISTERED";
const PASSWORD_NOT_VALIDATED = "PASSWORD_NOT_VALIDATED";

router.post("/signin", (req, res) => UserAuth.signin(req, res));
router.post("/logout", (req, res) => UserAuth.logout(req, res));
router.post("/signup", (req, res) => UserAuth.signup(req, res));

router.get("/signin_token", passport.authenticate("user", { session: false }), (req, res) => UserAuth.signinToken(req, res));

router.post("/forgot_password", async (req, res) => UserAuth.forgotPassword(req, res, `${config.APP_URL}/auth/reset`));
router.post("/forgot_password_reset", async (req, res) => UserAuth.forgotPasswordReset(req, res));
router.post("/reset_password", passport.authenticate("user", { session: false }), async (req, res) => UserAuth.resetPassword(req, res));

router.get("/loginas/:id", passport.authenticate("admin", { session: false }), async (req, res) => {
  try {
    const user = await UserObject.findOne({ _id: req.params.id });
    const token = jwt.sign({ _id: req.params.id }, config.secret, { expiresIn: JWT_MAX_AGE });
    return res.status(200).send({ ok: true, token, user });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

router.get("/:id", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    const user = await UserObject.findOne({ _id: req.params.id });
    return res.status(200).send({ ok: true, user });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

//
router.post("/", passport.authenticate("admin", { session: false }), async (req, res) => {
  try {
    if (!validatePassword(req.body.password)) return res.status(400).send({ ok: false, user: null, code: PASSWORD_NOT_VALIDATED });

    const user = await UserObject.create(req.body);

    return res.status(200).send({ user, ok: true });
  } catch (error) {
    if (error.code === 11000) return res.status(409).send({ ok: false, code: USER_ALREADY_REGISTERED });
    capture(error);
    return res.status(500).send({ ok: false, code: SERVER_ERROR });
  }
});

router.get("/", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    const users = await UserObject.find().sort("-created_at");
    return res.status(200).send({ ok: true, users });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

//@check
router.put("/image", passport.authenticate("user", { session: false }), upload.any(), async (req, res) => {
  try {
    let _id = req.user.role === "admin" ? req.query.user_id || req.user._id : req.user._id;
    const files = req.files || [];
    const url = `app/users/${_id}/${files[0].originalname}`;
    await uploadToS3FromBuffer(url, files[0].buffer);

    res.status(200).send({ ok: true, url });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

//@check
router.put("/", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    let _id = req.user.role === "admin" ? req.query.user_id || req.user._id : req.user._id;

    const user = await UserObject.findOneAndUpdate({ _id }, req.body, { new: true });

    res.status(200).send({ ok: true, user });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

router.delete("/:id", passport.authenticate("admin", { session: false }), async (req, res) => {
  try {
    await UserObject.findOneAndRemove({ _id: req.params.id });
    res.status(200).send({ ok: true });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

module.exports = router;
