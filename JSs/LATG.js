var mainCanvas;
var mainContext = null;
var plotTypes = ["Scatter", "Line"];

var catSelect;
var curX;
var curY;
var xSelect;
var xSpan;
var ySpan;

var statSelect1;
var statSelect2;
var statSpan1;
var statSpan2;
var sortSelect;
var sortSpan;

var typeSelect;

const statOptions = [
  "MALscore",
  "airstartdate",
  "airenddate",
  "ranking",
  "score",
  "watchedepisodes",
  "episodes",
  "startdate",
  "enddate",
];
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
  let myvar = window.location.search;
  myvar = new URLSearchParams(myvar);
  curX = myvar.get("curX");
  curY = myvar.get("curY");
  if (curX == null) curX = axisOptions[0];
  if (curY == null) curY = axisOptions[1];
  generalinit();
}

function start() {
  makeDatas();

  assembleGroups();

  typeSelect = document.createElement("select");
  typeSelect.name = "Graph Type Select";
  typeSelect.addEventListener("change", function () {
    findOptions(typeSelect.value);
    switch (typeSelect.value) {
      case "Scatter":
        scatterPlot();
        break;
      case "Line":
        linePlot();
        break;
      default:
        break;
    }
  });
  insert(document.getElementById("selectdiv"), typeSelect);

  for (let e of plotTypes) {
    const option = document.createElement("option");
    option.textContent = e;
    insert(typeSelect, option);
  }

  statSpan1 = document.createElement("span");
  statSpan1.textContent = "#1";
  statSpan1.style.color = "white";
  insert(document.getElementById("selectdiv"), statSpan1);

  statSelect1 = document.createElement("select");
  statSelect1.name = "Stat 1 Select";
  statSelect1.addEventListener("change", function () {
    linePlot();
  });
  insert(document.getElementById("selectdiv"), statSelect1);

  for (let i = 0; i < statOptions.length; i++) {
    const option = document.createElement("option");
    option.textContent = statOptions[i];
    insert(statSelect1, option);
  }
  // statSelect1.value = curstat1;

  statSpan2 = document.createElement("span");
  statSpan2.textContent = "#2";
  statSpan2.style.color = "white";
  insert(document.getElementById("selectdiv"), statSpan2);

  statSelect2 = document.createElement("select");
  statSelect2.name = "Stat 2 Select";
  statSelect2.addEventListener("change", function () {
    linePlot();
  });
  insert(document.getElementById("selectdiv"), statSelect2);

  for (let i = 0; i < statOptions.length; i++) {
    const option = document.createElement("option");
    option.textContent = statOptions[i];
    insert(statSelect2, option);
  }
  // statSelect1.value = curstat1;

  sortSpan = document.createElement("span");
  sortSpan.textContent = "Sort: ";
  sortSpan.style.color = "white";
  insert(document.getElementById("selectdiv"), sortSpan);

  sortSelect = document.createElement("select");
  sortSelect.name = "Sort Select";
  sortSelect.addEventListener("change", function () {
    linePlot();
  });
  insert(document.getElementById("selectdiv"), sortSelect);

  for (let i = 0; i < sortOptions.length; i++) {
    const option = document.createElement("option");
    option.textContent = sortOptions[i];
    insert(sortSelect, option);
  }
  // statSelect1.value = curstat1;

  xSpan = document.createElement("span");
  xSpan.textContent = "X Axis: ";
  xSpan.style.color = "white";
  insert(document.getElementById("selectdiv"), xSpan);

  xSelect = document.createElement("select");
  xSelect.name = "X Axis Select";
  xSelect.addEventListener("change", function () {
    window.location.search =
      "curX=" + xSelect.value + "&curY=" + catSelect.value;
    scatterPlot();
  });
  insert(document.getElementById("selectdiv"), xSelect);

  for (let i = 0; i < axisOptions.length; i++) {
    const option = document.createElement("option");
    option.textContent = axisOptions[i];
    insert(xSelect, option);
  }
  xSelect.value = curX;

  ySpan = document.createElement("span");
  ySpan.textContent = "Y Axis: ";
  ySpan.style.color = "white";
  insert(document.getElementById("selectdiv"), ySpan);

  catSelect = document.createElement("select");
  catSelect.name = "Y Axis Select";
  catSelect.addEventListener("change", function () {
    window.location.search =
      "curX=" + xSelect.value + "&curY=" + catSelect.value;
    scatterPlot();
  });
  insert(document.getElementById("selectdiv"), catSelect);

  for (let i = 0; i < axisOptions.length; i++) {
    const option = document.createElement("option");
    option.textContent = axisOptions[i];
    insert(catSelect, option);
  }
  catSelect.value = curY;

  mainCanvas = document.createElement("canvas");
  mainContext = mainCanvas.getContext("2d");
  mainCanvas.setAttribute("id", "mainGraph");
  let w = innerWidth;
  let h = innerHeight - document.getElementsByTagName("a")[0].clientHeight;
  mainCanvas.width = w * 0.99;
  mainCanvas.height = 0.92 * h;
  mainCanvas.style.border = "1px solid gray";
  insert(document.getElementById("mainbody"), mainCanvas);

  
  typeSelect.value = "Line"
  findOptions(typeSelect.value);
  linePlot()
}

function findOptions(plotType) {
  switch (plotType) {
    case "Scatter":
      xSelect.hidden = false;
      catSelect.hidden = false;
      xSpan.hidden = false;
      ySpan.hidden = false;

      statSelect1.hidden = true;
      statSelect2.hidden = true;
      statSpan1.hidden = true;
      statSpan2.hidden = true;
      sortSelect.hidden = true;
      sortSpan.hidden = true;
      break;
    case "Line":
      xSelect.hidden = true;
      catSelect.hidden = true;
      xSpan.hidden = true;
      ySpan.hidden = true;

      statSelect1.hidden = false;
      statSelect2.hidden = false;
      statSpan1.hidden = false;
      statSpan2.hidden = false;
      sortSelect.hidden = false;
      sortSpan.hidden = false;
      break;

    default:
      break;
  }
}

function linePlot() {
  clear();
  const sorttarget = sortSelect.value;
  let pair1 = minMax(statSelect1.value);
  let min1 = pair1[0]
  let range1 = pair1[1]-pair1[0]
  let pair2 = minMax(statSelect2.value);
  let min2 = pair2[0]
  let range2 = pair2[1]-pair2[0]
  switch (sorttarget) {
    case "by Type":
      data.sort(compareTypes);
      break;
    case "by Air Status":
      data.sort(compareAirStatus);
      break;
    case "by Title":
      data.sort(compareTitles);
      break;
    case "by Score":
      data.sort(compareTitles).reverse();
      data.sort(compareScores).reverse();
      break;
    case "by MAL Score":
      data.sort(compareMALScore).reverse();
      break;
    case "by Episode Count":
      data.sort(compareEpisodes).reverse();
      break;
    case "by Episodes Watched":
      data.sort(compareWEpisodes).reverse();
      break;
    case "by Score Difference":
      data.sort(compareDifference).reverse();
      break;
    case "by Air Date":
      data.sort(compareAirStart).reverse();
      break;
    case "by Demographic":
      data.sort(compareDemog).reverse();
      break;
    case "by Rating":
      data.sort(compareRated);
      break;
    case "by Status":
      data.sort(compareAirStatus);
      break;
    case "by Type":
      data.sort(compareTypes);
      break;
    case "by Watch Date":
      data.sort(compareWatchDate).reverse();
      break;
    case "by Run Length":
      data.sort(compareRunLength).reverse();
      break;
    case "by Air Finish":
      data.sort(compareAirFinish).reverse();
      break;
    case "by Pickup Time":
      data.sort(comparePickupTime);
      break;
    case "by Title Length":
      data.sort(compareTitleLength);
      break;
    default:
      break;
  }
  drawText(0,15,statSelect1.value,20,"left","green");
  drawText(mainCanvas.width,15,statSelect2.value,20,"right","red");
  let filtData = []
  for (let e of data) {
    if (e.fieldHasValue(statSelect1.value) && e.fieldHasValue(statSelect2.value)) {
      filtData.push(e);
    }
  }
  console.log(filtData.length)
  const di = Math.floor((mainCanvas.width - 10)/filtData.length)/(mainCanvas.width-10)
  for (let i = 0; i < filtData.length; i++) {
    const e = filtData[i];
    let pos1 = e.extractNum(statSelect1.value);
    let pos2 = e.extractNum(statSelect2.value);
    scatterPoint(i*di,(pos1-min1)/range1,"green");
    scatterPoint(i*di,(pos2-min2)/range2,"red");
  }
}

function scatterPlot() {
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
    scatterPoint((xValue - minX) / rangeX, (yValue - minY) / rangeY,"red");
  }
}

function scatterPoint(x, y,color = "red") {
  drawEllipse(
    x * (mainCanvas.width - 10) + 5,
    mainCanvas.height - y * (mainCanvas.height - 10) - 5,
    3,
    3,
    color
  );
}

function drawEllipse(x, y, w, h, color = "red", degrees = 360) {
  mainContext.fillStyle = color;
  mainContext.strokeStyle = color;
  mainContext.beginPath();
  mainContext.ellipse(x, y, w, h, 0, 0, (degrees / 180) * Math.PI);
  mainContext.fill();
}

function drawText(x, y, str, size, align = "left", color = "white") {
  mainContext.textAlign = align
  mainContext.fillStyle = color;
  mainContext.font = size + "px monospace, monospace";
  mainContext.fillText(str, x, y);
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
