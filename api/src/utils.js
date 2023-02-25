const AWS = require("aws-sdk");
const https = require("https");
const http = require("http");
const passwordValidator = require("password-validator");

const BUCKET_NAME = "datadvise";

function getReq(url, cb) {
  if (url.toString().indexOf("https") === 0) return https.get(url, cb);
  return http.get(url, cb);
}

function uploadToS3FromBuffer(path, buffer) {
  return new Promise((resolve, reject) => {
    let s3bucket = new AWS.S3({ accessKeyId: "AKIAR4ZAM5QBOCHHS54S", secretAccessKey: "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" });
    var params = {
      ACL: "public-read",
      Bucket: BUCKET_NAME,
      Key: path,
      Body: buffer,
      Metadata: { "Cache-Control": "max-age=31536000" },
    };
    s3bucket.upload(params, function (err, data) {
      if (err) return reject(`error in callback:${err}`);
      resolve();
    });
  });
}

function uploadToS3FromUrl(url, path) {
  let s3 = new AWS.S3({
    accessKeyId: "AKIAR4ZAM5QBOCHHS54S",
    secretAccessKey: "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",
  });

  return new Promise((resolve, reject) => {
    getReq(url, async function onResponse(res) {
      if (res.statusCode >= 300) {
        console.log(res.statusCode, "with", url);
        return reject();
      }
      var params = {
        ACL: "public-read",
        Bucket: BUCKET_NAME,
        Key: path,
        Body: res,
        Metadata: { "Cache-Control": "max-age=31536000" },
      };
      const { Location } = await s3.upload(params).promise();
      return resolve(Location);
    }).on("error", function onError(err) {
      reject();
    });
  });
}

function fileExist(url) {
  return new Promise((resolve, reject) => {
    getReq(url, (resp) => {
      if (resp.statusCode === 200) return resolve(true);
      return resolve(false);
    }).on("error", (err) => {
      resolve(false);
      console.log("Error: " + err.message);
    });
  });
}

function validatePassword(password) {
  const schema = new passwordValidator();
  schema
    .is()
    .min(6) // Minimum length 6
    .is()
    .max(100) // Maximum length 100
    .has()
    .letters(); // Must have letters

  return schema.validate(password);
}

module.exports = {
  uploadToS3FromBuffer,
  uploadToS3FromUrl,
  fileExist,
  validatePassword,
};
