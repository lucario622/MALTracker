var mainCanvas;
var mainContext = null;
var catSelect;
const axisOptions = [
  "airStatus",
  "type",
  "status",
  "premiered",
  "genres",
  "demog",
  "rated",
  "title",
  "season",
  "year",
];
function init() {
  generalinit();
}

function start() {
  makeDatas();

  assembleGroups();

  let catSpan = document.createElement("span");
  catSpan.textContent = "Category: ";
  catSpan.style.color = "white";
  insert(document.getElementById("selectdiv"), catSpan);

  catSelect = document.createElement("select");
  catSelect.name = "Cat Select";
  catSelect.addEventListener("change", function () {
    graphit();
  });
  insert(document.getElementById("selectdiv"), catSelect);

  for (let i = 0; i < axisOptions.length; i++) {
    const option = document.createElement("option");
    option.textContent = axisOptions[i];
    insert(catSelect, option);
  }
  catSelect.value = axisOptions[0];

  mainCanvas = document.createElement("canvas");
  mainContext = mainCanvas.getContext("2d");
  mainCanvas.setAttribute("id", "mainGraph");
  let w = innerWidth;
  let h = innerHeight - document.getElementsByTagName("a")[0].clientHeight;
  mainCanvas.width = w * 0.99;
  mainCanvas.height = 0.92 * h;
  mainCanvas.style.border = "1px solid gray";
  insert(document.getElementById("mainbody"), mainCanvas);

  graphit();
}

function graphit() {
  clear();

  const field = catSelect.value;
  let cats = [];
  let catsCount = [];
  if (field == "title") {
    for (let e of data) {
      if (!cats.includes(e[field].toLowerCase().charAt(0))) {
        cats.push(e[field].toLowerCase().charAt(0));
        catsCount.push(1);
      } else {
        catsCount[cats.indexOf(e[field].toLowerCase().charAt(0))]++;
      }
    }
  } else if (field == "genres" || field == "demog") {
    for (let e of data) {
      for (let i of e[field]) {
        if (!cats.includes(i)) {
          cats.push(i);
          catsCount.push(1);
        } else {
          catsCount[cats.indexOf(i)]++;
        }
      }
    }
  } else if (field == "season") {
    cats = ["Winter", "Spring", "Summer", "Fall"];
    catsCount = [0, 0, 0, 0];
    for (let e of data) {
      if (e.premiered != "") {
        let seasonString = e.premiered.substring(0, e.premiered.indexOf(" "));
        catsCount[cats.indexOf(seasonString)]++;
      }
    }
  } else if (field == "year") {
    for (let e of data) {
      if (e.premiered != "") {
        let yearString = e.premiered.substring(e.premiered.indexOf(" ") + 1);
        if (!cats.includes(yearString)) {
          cats.push(yearString);
          catsCount.push(0);
        }
      }
    }
    cats.sort();
    for (let e of data) {
      if (e.premiered != "") {
        let yearString = e.premiered.substring(e.premiered.indexOf(" ") + 1);
        catsCount[cats.indexOf(yearString)]++;
      }
    }
  } else {
    for (let e of data) {
      if (!cats.includes(e[field])) {
        cats.push(e[field]);
        catsCount.push(1);
      } else {
        catsCount[cats.indexOf(e[field])]++;
      }
    }
  }
  let barWidth = mainCanvas.width / cats.length;
  for (let i = 0; i < cats.length; i++) {
    let barHeight = (catsCount[i] / data.length) * mainCanvas.height;
    drawRect(i * barWidth, mainCanvas.height, barWidth, -barHeight);
    drawText(
      i * barWidth,
      mainCanvas.height,
      cats[i],
      (barWidth * 1.82) / cats[i].length,
      "white"
    );
  }
  console.log(cats);
  console.log(catsCount);
}

function drawText(x, y, str, size, color = "red") {
  mainContext.fillStyle = color;
  mainContext.font = size + "px monospace, monospace";
  mainContext.fillText(str, x, y);
}

function drawRect(x, y, w, h, color = "red") {
  mainContext.fillStyle = color;
  mainContext.strokeStyle = color;
  mainContext.beginPath();
  mainContext.fillRect(x, y, w, h);
  mainContext.fill();
}

function clear() {
  mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
}
