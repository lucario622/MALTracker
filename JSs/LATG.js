var mainCanvas;
var mainContext = null;
var catSelect;
var xSelect;
const axisOptions = [
  "MALscore",
  "ranking",
  "score",
  "watchedepisodes",
  "episodes",
  "title",
  "startdate",
  "enddate",
  "airstartdate",
  "airenddate",
  "type",
  "status",
  "airStatus",
];
const mins = [5, 1, 5, 0, 0];
const maxs = [10, 866, 10, 1096, 1096];
function init() {
  generalinit();
}

function start() {
  makeDatas();

  assembleGroups();

  let ySpan = document.createElement("span");
  ySpan.textContent = "Y Axis: ";
  ySpan.style.color = "white";
  insert(document.getElementById("selectdiv"), ySpan);

  catSelect = document.createElement("select");
  catSelect.name = "Y Axis Select";
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

  let xSpan = document.createElement("span");
  xSpan.textContent = "X Axis: ";
  xSpan.style.color = "white";
  insert(document.getElementById("selectdiv"), xSpan);

  xSelect = document.createElement("select");
  xSelect.name = "X Axis Select";
  xSelect.addEventListener("change", function () {
    graphit();
  });
  insert(document.getElementById("selectdiv"), xSelect);

  for (let i = 0; i < axisOptions.length; i++) {
    const option = document.createElement("option");
    option.textContent = axisOptions[i];
    insert(xSelect, option);
  }
  xSelect.value = axisOptions[0];

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
  let xPair = minMax(xSelect.value);
  let minX = xPair[0];
  let rangeX = xPair[1] - xPair[0];

  let yPair = minMax(catSelect.value);
  let minY = yPair[0];
  let rangeY = yPair[1] - yPair[0];

  for (let i = 0; i < data.length; i++) {
    const e = data[i];
    let xValue = e.extractNum(xSelect.value);
    let yValue = e.extractNum(catSelect.value);
    scatterPoint((xValue - minX) / rangeX, (yValue - minY) / rangeY);
  }
}

function scatterPoint(x, y) {
  drawEllipse(
    x * (mainCanvas.width - 10) + 5,
    mainCanvas.height - y * (mainCanvas.height - 10) - 5,
    3,
    3,
    "red"
  );
}

function drawEllipse(x, y, w, h, color = "red", degrees = 360) {
  mainContext.fillStyle = color;
  mainContext.strokeStyle = color;
  mainContext.beginPath();
  mainContext.ellipse(x, y, w, h, 0, 0, (degrees / 180) * Math.PI);
  mainContext.fill();
}

function clear() {
  mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
}

function minMax(field) {
  let min = data[0].extractNum(field);
  let max = data[0].extractNum(field);
  for (let e of data) {
    if (e.extractNum(field) < min) {
      //   console.log(e.extractNum(field) + " < " + min);
      min = e.extractNum(field);
    }
    if (e.extractNum(field) > max) {
      //   console.log(e.extractNum(field) + " > " + max);
      max = e.extractNum(field);
    }
  }
  return [min, max];
}
