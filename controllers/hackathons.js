const browserlessFactory = require("browserless");
var { JSDOM } = require("jsdom");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const { createContext } = browserlessFactory({
  timeout: 25000,
  lossyDeviceName: true,
  ignoreHTTPSErrors: true,
});

exports.getDevfolioHackathons = (req, res, next) => {
  var query = req.query.q;
  var link =
    "https://devfolio.co/hackathons?hackathon_type%3Din_person%2Conline%26time_frame%3Dapplication_open";

  scrapeDevFolio(link);
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
      req.devFolioHackathons = hackathonJson;
      next();
    }
    getSerializedData();
  }
};

exports.getDevpostHackathons = (req, res, next) => {
  var query = req.query.q;
  var link = "https://devpost.com/hackathons";

  scrapeDevPost(link);
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
        console.log(index);
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
      req.devpostHackathons = hackathonJson;
      next();
    }
    getSerializedData();
  }
};

exports.getHackathons = (req, res) => {
  res.status(200).json([req.devpostHackathons, req.devFolioHackathons]);
};
