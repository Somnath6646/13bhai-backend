const browserlessFactory = require("browserless");
var { JSDOM } = require("jsdom");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const fs = require("fs");
const { createContext } = browserlessFactory({
  timeout: 25000,
  lossyDeviceName: true,
  ignoreHTTPSErrors: true,
});

function scrapeDevFolio(link) {
  async function getSerializedData() {
    const browserless = await createContext({ retry: 2 });
    const serialize = browserless.evaluate(
      (page) => page.evaluate(() => document.body.innerHTML),
      {
        waitUntil: "domcontentloaded",
      }
    );

    var serializedHtml = await serialize(link);
    fs.writeFileSync("./devfolio.html", serializedHtml);
    var doc = new JSDOM(serializedHtml, {
      url: link,
    });
    var document = doc.window.document;
    var hackathons = document.querySelectorAll(
      ".style__Inner-sc-19afmba-7.fvQDhb"
    );
    var list = [];
    for (let index = 0; index < hackathons.length; index++) {
      const hackathon = hackathons[index];
      var title = hackathon.querySelector(".sc-hAZoDl.dUaiSK").textContent;

      var description = "";

      var childrens = hackathon.querySelectorAll(
        ".style__Flex-sc-19afmba-5.blINFx"
      )[1].children;

      for (let j = 0; j < childrens.length; j++) {
        const element = childrens[j];
        description += element.textContent + "  ";
      }
      var url = hackathon.getElementsByTagName("a")[0].href;
      var json = {
        title: title,
        description: description,
        url: url,
      };
      list.push(json);
    }
    var hackathonJson = {
      platformName: "Devfolio",
      hackathonList: list,
    };
    fs.writeFileSync("./devfolio.json", JSON.stringify(hackathonJson));
  }
  getSerializedData();
}

function scrapeDevPost(link) {
  async function getSerializedData() {
    const browserless = await createContext({ retry: 2 });
    const serialize = browserless.evaluate(
      (page) => page.evaluate(() => document.body.innerHTML),
      {
        waitUntil: "domcontentloaded",
      }
    );

    var serializedHtml = await serialize(link);
    fs.writeFileSync("./devpost.html", serializedHtml);
    var doc = new JSDOM(serializedHtml, {
      url: link,
    });
    var document = doc.window.document;
    var hackathons = document.querySelectorAll(".hackathon-tile.clearfix");
    var list = [];
    for (let index = 0; index < hackathons.length; index++) {
      const hackathon = hackathons[index];
      var title = hackathon.getElementsByTagName("h3")[0].textContent;
      var description = "";

      var childrens = hackathon.querySelector(".main-content").children;

      for (let j = 0; j < childrens.length; j++) {
        const element = childrens[j];
        description += element.textContent + "  ";
      }

      var url = hackathon.getElementsByTagName("a")[0].href;
      var json = {
        title: title,
        description: description,
        url: url,
      };
      list.push(json);
    }
    var hackathonJson = {
      platformName: "Devpost",
      hackathonList: list,
    };
    fs.writeFileSync("./devpost.json", JSON.stringify(hackathonJson));
  }
  getSerializedData();
}

// //scrapeDevFolio(
//   "https://devfolio.co/hackathons?hackathon_type%3Din_person%2Conline%26time_frame%3Dapplication_open"
// );

scrapeDevPost("https://devpost.com/hackathons");
