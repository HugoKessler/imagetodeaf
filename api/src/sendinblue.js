var SibApiV3Sdk = require("sib-api-v3-sdk");
var defaultClient = SibApiV3Sdk.ApiClient.instance;

const { SENDINBLUE } = require("./config");

//https://my.sendinblue.com/lists/add-attributes

var apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = SENDINBLUE;

var apiInstance = new SibApiV3Sdk.ContactsApi();

async function sync(obj, type) {
  if (!SENDINBLUE) return;

  try {
    const user = JSON.parse(JSON.stringify(obj));

    if (!user) return console.log("ERROR WITH ", obj);

    const email = user.email;

    const attributes = {};
    for (let i = 0; i < Object.keys(user).length; i++) {
      const key = Object.keys(user)[i];
      if (key.indexOf("_at") !== -1) {
        if (user[key]) attributes[key.toUpperCase()] = user[key].slice(0, 10);
      } else {
        attributes[key.toUpperCase()] = user[key];
      }
    }

    let listIds = []; //attributes.TYPE === "USER" ? [8] : [20];

    delete attributes.EMAIL;
    delete attributes.PASSWORD;
    delete attributes.__V;
    delete attributes._ID;
    delete attributes.LASTNAME;
    delete attributes.FIRSTNAME;

    await apiInstance.updateContact(email, { attributes, listIds }).catch(async (e) => {
      if (e.status === 404) {
        try {
          await apiInstance.createContact({ email, attributes, listIds });
        } catch (e) {
          console.log("ERROR CREATE", e);
        }
      } else {
        console.log(e.status, e);
      }
    });
  } catch (e) {
    console.log("error", e);
  }
}

async function unsync(obj) {
  try {
    await apiInstance.deleteContact(obj.email);
  } catch (e) {
    console.log("Can't delete in sendinblue", obj.email);
  }
}

module.exports = { sync, unsync };
