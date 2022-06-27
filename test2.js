const browserlessFactory = require("browserless");
const fs = require("fs");
var { JSDOM } = require("jsdom");
const axios = require("axios");
const { Console } = require("console");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { createContext } = browserlessFactory({
  timeout: 25000,
  lossyDeviceName: true,
  ignoreHTTPSErrors: true,
});

// Now every time you call `createContext`
// it will be create a browser context.

var a = "";

// async function hey() {
//   const browserless = await createContext({ retry: 2 });
//   const serialize = browserless.evaluate(
//     (page) => page.evaluate(() => document.body.innerHTML),
//     {
//       waitUntil: "domcontentloaded",
//     }
//   );

//   a = await serialize("https://devfolio.co/hackathons");

//   fs.writeFileSync("./yuhu6.html", a);
// }
// hey();

function getCourseraCourses(query) {
  var link = "https://www.coursera.org/search?query=" + query;
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

    const document = doc.window.document;

    var courseCards = document.getElementsByClassName("css-1j8ushu");
    var list = [];
    for (const key in courseCards) {
      if (Object.hasOwnProperty.call(courseCards, key)) {
        const courseCard = courseCards[key];
        if (courseCard) {
          console.log(key);
          var url = courseCard.getElementsByTagName("a")[0].href;
          var title = courseCard.querySelector(".css-cru2ji").textContent;
          var difficultyLevel = courseCard.querySelectorAll(
            ".cds-1.css-1cxz0bb.cds-3"
          )[2].textContent;
          var imgUrl = courseCard
            .querySelector(".css-17z2etb")
            .getElementsByTagName("img")[0].src;
          var usp = courseCard.querySelector(".css-pn23ng").textContent;
          var author = courseCard.querySelector(".css-1cxz0bb").textContent;
        }
        var json = {
          title: title,
          difficultyLevel: difficultyLevel ? difficultyLevel : "",
          usp: usp ? usp : "",
          author: author ? author : "",
          imgUrl: imgUrl ? imgUrl : "",
          url: url ? url : "",
        };
        list.push(json);
      }
    }
    var courseJson = {
      platformName: "Coursera",
      courses: list,
    };
    fs.writeFileSync("./coursera.json", JSON.stringify(courseJson));
  }

  getSerializedData();
}

function getSkillShareCourses(query) {
  var link =
    "https://www.skillshare.com/search?query=" + query.replace(" ", "+");
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

    const document = doc.window.document;

    var courseCards = document.getElementsByClassName(
      "class-card sc-hzDkRC lprvFn"
    );
    var list = [];
    for (const key in courseCards) {
      if (Object.hasOwnProperty.call(courseCards, key)) {
        const courseCard = courseCards[key];
        if (courseCard) {
          console.log(key);
          var url = courseCard.getElementsByTagName("a")[0].href;
          var title = courseCard.querySelector(".title").textContent;
          var imgUrl = courseCard.querySelector(".thumbnail-img-holder").style
            .backgroundImage;
          var usp = courseCard.querySelector(".stats").textContent;
          var author =
            courseCard.querySelector(".user-information").textContent;
        }

        imgUrl = imgUrl.replace("url(", "").replace(")", "");
        usp = usp.replace("students", "students ");
        var json = {
          title: title,
          difficultyLevel: "",
          usp: usp ? usp : "",
          author: author ? author : "",
          imgUrl: imgUrl ? imgUrl : "",
          url: url ? url : "",
        };
        list.push(json);
      }
    }
    var courseJson = {
      platformName: "Skillshare",
      courses: list,
    };
    fs.writeFileSync("./skillshare.json", JSON.stringify(courseJson));
  }

  getSerializedData();
}

async function getUdemyCourses(query) {
  const headers = {
    Accept: "application/json, text/plain, */*",
    Authorization:
      "Basic QzhHa3o0VXhDU3c4ZmFYSHNlQ2F4SE1ZSWthZ2xHbHlJWWI5U1gzVzpCaTVhZ3Q1QVl0Z2xjU1R1RFN0cGw2OGIwY1N2TWxyM0hKalM1MHV0SnljRkU2VGowNXNuUEJsbnp3VmtDeFE2VE9GYlFTeVZjQnUwV3lEUWtMRkdRMVFQMjAweUYxMTA3cTRCYnlDd0RvTDJUUHVUNmtZSUNyQ2tlT0ZsV0Ixdg==",
    "Content-Type": "application/json;charset=utf-8",
  };
  var link =
    "https://www.udemy.com/api-2.0/courses/?page_size=50&search=" + query;
  console.log(link);

  var obj = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization:
        "Basic QzhHa3o0VXhDU3c4ZmFYSHNlQ2F4SE1ZSWthZ2xHbHlJWWI5U1gzVzpCaTVhZ3Q1QVl0Z2xjU1R1RFN0cGw2OGIwY1N2TWxyM0hKalM1MHV0SnljRkU2VGowNXNuUEJsbnp3VmtDeFE2VE9GYlFTeVZjQnUwV3lEUWtMRkdRMVFQMjAweUYxMTA3cTRCYnlDd0RvTDJUUHVUNmtZSUNyQ2tlT0ZsV0Ixdg==",
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(link, obj);
  const json = await response.json();
  var courses = json.results;
  var list = [];
  for (let index = 0; index < courses.length; index++) {
    const course = courses[index];
    var title = course.title;
    var author = "";
    for (let i = 0; i < course.visible_instructors.length; i++) {
      const element = course.visible_instructors[i];
      if (i != course.visible_instructors.length - 1)
        author += element.display_name + " & ";
      else author += element.display_name;
    }
    var price = course.price;
    var usp = course.headline;
    var imgUrl = course.image_240x135;
    var url = "https://www.udemy.com" + course.url;
    var item_json = {
      title: title,
      price: price,
      usp: usp ? usp : "",
      author: author ? author : "",
      imgUrl: imgUrl ? imgUrl : "",
      url: url ? url : "",
    };
    list.push(item_json);
  }

  var courseJson = {
    platformName: "Udemy",
    courses: list,
  };

  fs.writeFileSync("./udemy.json", JSON.stringify(courseJson));
}

getUdemyCourses("android");

//getCourseraCourses("https://www.coursera.org/search?query=ui%20design");
//getSkillShareCourses("https://www.skillshare.com/search?query=ui+design");
