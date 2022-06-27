console.log("yuhuuuuuuuu we made it!!!!!!!!!");

const fs = require("fs");
const axios = require("axios");
var { JSDOM } = require("jsdom");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function scrapeFreelancerCom(link) {
  const response = await fetch(link);
  const body = await response.text();

  var doc = new JSDOM(body, {
    url: link,
  });

  const document = doc.window.document;

  var projectList = document.getElementsByClassName("JobSearchCard-item ");
  var list = [];
  for (const key in projectList) {
    if (Object.hasOwnProperty.call(projectList, key)) {
      const project = projectList[key];
      if (project) {
        //console.log("Project "+project)
        var title = project.querySelector(
          ".JobSearchCard-primary-heading-link"
        );

        var descr = project.querySelector(".JobSearchCard-primary-description");
        var budget = project.querySelector(".JobSearchCard-secondary-price");

        if (title && descr && budget)
          list.push({
            title: title.innerHTML.replace(/\s\s+/g, " "),
            description: descr.textContent.replace(/\s\s+/g, " "),
            budget: budget.textContent.replace(/\s\s+/g, " "),
          });
      }
    }
  }

  var json = {
    jobList: list,
  };

  fs.writeFileSync("./jobs.json", JSON.stringify(json));
}

async function scrapePeoplePerHour(link) {
  const response = await fetch(link);
  const body = await response.text();

  var doc = new JSDOM(body, {
    url: link,
  });

  const document = doc.window.document;

  var projectList = document.getElementsByClassName("list__item⤍List⤚2ytmm");
  var list = [];
  for (const key in projectList) {
    if (Object.hasOwnProperty.call(projectList, key)) {
      const project = projectList[key];
      if (project) {
        //console.log("Project "+project)
        var title = project.querySelector(".item__url⤍ListItem⤚20ULx");
        var budget = project.querySelector(".item__budget⤍ListItem⤚3P7Zd");

        if (title && budget)
          list.push({
            title: title.innerHTML.replace(/\s\s+/g, " "),
            url: title.href,
            budget: budget.textContent.replace(/\s\s+/g, " "),
          });
      }
    }
  }

  var json = {
    jobList: list,
  };

  fs.writeFileSync("./peopleperhourjobs.json", JSON.stringify(json));
}

async function scrapeTwitter(link) {
  let options = {
    headers: {
      "User-Agent": "UA",
    },
  };

  axios.get(link, options).then((response) => {
    console.log(response.data);
    fs.writeFileSync("./twitter-sample.html", response.data);
  });
}

let link = "";

const { parse } = require("rss-to-json");
// async await
async () => {
  var rss = await parse(link);

  fs.writeFileSync("./upworkJobs.json", JSON.stringify(rss, null, 3));
};

scrapeTwitter(link);

function log(obj) {
  console.log(obj);
}
