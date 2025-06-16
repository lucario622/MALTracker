var mainCanvas;
var mainContext = null;
var catSelect;
var curSelected;
var cw;
var ch;
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
  let myvar = window.location.search
  myvar = new URLSearchParams(myvar)
  curSelected = myvar.get('selected')
  if (curSelected == null) curSelected = axisOptions[0]
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
    window.location.search = "selected="+catSelect.value
    graphit();
  });
  insert(document.getElementById("selectdiv"), catSelect);

  for (let i = 0; i < axisOptions.length; i++) {
    const option = document.createElement("option");
    option.textContent = axisOptions[i];
    insert(catSelect, option);
  }
  catSelect.value = curSelected;

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
  cw = mainCanvas.width;
  ch = mainCanvas.height;
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
  let catscat = [];
  drawEllipse(
    cw * 0.75,
    ch * 0.5,
    cw * 0.2 + 1,
    cw * 0.2 + 1,
    "rgb(237,237,237)"
  );
  let total = 0;
  let curTotal = 0;
  for (let i = 0; i < cats.length; i++) {
    catscat.push([cats[i], catsCount[i]]);
    total += catsCount[i];
  }
  catscat.sort((a, b) => {
    return -Math.sign(a[1] - b[1]);
  });
  let colorarr = [];
  for (let i = 0; i < catscat.length; i++) {
    colorarr[i] =
      "rgb(" +
      Math.random() * 255 +
      "," +
      Math.random() * 255 +
      "," +
      Math.random() * 255 +
      ")";
    cats[i] = catscat[i][0];
    if (cats[i] == "") cats[i] = "None";
    catsCount[i] = catscat[i][1];
  }
  if (cats.length <= 10) {
    for (let i = 0; i < cats.length; i++) {
      if (cats[i] == "") cats[i] = "None";
      let color = colorarr[i];
      let count = catsCount[i];
      let text =
        cats[i] + " " + Math.round((count / total) * 10000) / 100 + "%";
      let rectX = cw / 16;
      let rectY = ch / 5 + (i * ch) / 10;
      let rectW = cw / 8;
      let rectH = ch / 12;
      let textH = ch / 18;
      if (cats.length > 6) {
        let n = cats.length;
        rectX = cw / 16;
        rectY = ch / 5 + (i * 6 * ch) / 10 / n;
        rectW = ((cw / 8) * 6) / n;
        rectH = ch / 2 / n;
        textH = ch / 3 / n;
      }
      drawRect(rectX - 1, rectY - 1, rectW + 2, rectH + 2, "rgb(237,237,237)");
      drawRect(rectX, rectY, rectW, rectH, color);
      drawText(
        rectX + 1.1 * rectW,
        rectY + rectH / 2.5 + textH / 2,
        text,
        textH,
        "rgb(237,237,237)"
      );
    }
  } else {
    let m = Math.ceil(Math.sqrt(cats.length));
    let rows = 2 * m;
    let cols = Math.ceil(m / 2);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let k = cols * i + j;
        if (k >= cats.length) continue;
        let color = colorarr[k];
        let count = catsCount[k];
        let text =
          cats[k] + " " + Math.round((count / total) * 10000) / 100 + "%";

        let twSpace = cw * 0.55 - cw / 16;
        let wSpace = twSpace / cols;

        let rectX = cw / 16 + j * wSpace;
        let rectY = ch / 5 + (i * 6 * ch) / 10 / rows;
        let rectW = ((cw / 8) * 6) / cols / rows;
        let rectH = ch / 2 / rows;
        let textH0 = (wSpace / text.length) * 1.4;
        let textH1 = ch / 3 / rows;
        let textH = Math.min(textH0, textH1);

        drawRect(
          rectX - 1,
          rectY - 1,
          rectW + 2,
          rectH + 2,
          "rgb(237,237,237)"
        );
        drawRect(rectX, rectY, rectW, rectH, color);
        drawText(
          rectX + 1.1 * rectW,
          rectY + rectH / 2.5 + textH / 2,
          text,
          textH,
          "rgb(237,237,237)"
        );
      }
    }
  }

  for (let i = 0; i < cats.length; i++) {
    let count = catsCount[i];
    let color = colorarr[i];
    console.log(
      "slice " + i + " is " + (count / total) * 360 + " degrees large"
    );
    drawEllipse(
      cw * 0.75,
      ch * 0.5,
      cw * 0.2,
      cw * 0.2,
      color,
      (count / total) * 360,
      (curTotal / total) * 360
    );
    curTotal += count;
  }
  console.log(cats);
  console.log(catsCount);
}

function drawEllipse(x, y, w, h, color = "red", degrees = 360, startangle = 0) {
  mainContext.fillStyle = color;
  mainContext.strokeStyle = color;
  mainContext.beginPath();
  mainContext.ellipse(
    x,
    y,
    w,
    h,
    (startangle / 180) * Math.PI,
    0,
    (degrees / 180) * Math.PI
  );
  mainContext.lineTo(x, y);
  mainContext.fill();
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
