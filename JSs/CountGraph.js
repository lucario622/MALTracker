var mainCanvas;
var mainContext = null;
var catSelect;
var curSelected;
var cw;
var ch;
var barGraph;
var url;
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
  "episodes",
];
function init() {
  url = window.location.search;
  url = new URLSearchParams(url);
  curSelected = url.get("selected");
  if (curSelected == null) curSelected = axisOptions[0];
  barGraph = url.get("bar");
  if (barGraph == null) barGraph = false;
  else barGraph = barGraph.length < 5;
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
    url.set("selected", catSelect.value);
    window.history.replaceState({}, "", window.location.pathname + "?" + url);
    graphit();
  });
  insert(document.getElementById("selectdiv"), catSelect);

  let toggleLabel = document.createElement("label");
  toggleLabel.textContent = "Bar Graph";
  toggleLabel.style.color = "white";
  let toggleInput = document.createElement("input");
  toggleInput.type = "checkbox";
  insert(toggleLabel, toggleInput);
  insert(document.getElementById("selectdiv"), toggleLabel);
  toggleInput.checked = barGraph;

  toggleInput.onclick = () => {
    barGraph = !barGraph;
    url.set("bar", barGraph);
    window.history.replaceState({}, "", window.location.pathname + "?" + url);
    graphit();
  };

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
  let total = 0;
  for (let i = 0; i < cats.length; i++) {
    catscat.push([cats[i], catsCount[i]]);
    total += catsCount[i];
  }
  console.log(cats);
  console.log(catsCount);

  if (barGraph) {
    drawBarGraph(catscat);
  } else {
    drawPieGraph(catscat, total);
  }
}

function drawPieGraph(catscat, total) {
  cw = mainCanvas.width;
  ch = mainCanvas.height;
  catscat.sort((a, b) => {
    return -Math.sign(a[1] - b[1]);
  });
  let curTotal = 0;
  let colorarr = [];
  let cats = [];
  let catsCount = [];
  drawEllipse(
    cw * 0.75,
    ch * 0.5,
    cw * 0.2 + 1,
    cw * 0.2 + 1,
    "rgb(237,237,237)",
  );
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
        "rgb(237,237,237)",
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
          "rgb(237,237,237)",
        );
        drawRect(rectX, rectY, rectW, rectH, color);
        drawText(
          rectX + 1.1 * rectW,
          rectY + rectH / 2.5 + textH / 2,
          text,
          textH,
          "rgb(237,237,237)",
        );
      }
    }
  }

  for (let i = 0; i < cats.length; i++) {
    let count = catsCount[i];
    let color = colorarr[i];
    // console.log(
    //   "slice " + i + " is " + (count / total) * 360 + " degrees large",
    // );
    drawEllipse(
      cw * 0.75,
      ch * 0.5,
      cw * 0.2,
      cw * 0.2,
      color,
      (count / total) * 360,
      (curTotal / total) * 360,
    );
    curTotal += count;
  }
}

function drawBarGraph(catscat) {
  cw = mainCanvas.width;
  ch = mainCanvas.height;
  catscat.sort((a, b) => {
    return Math.sign(a[0] - b[0]);
  });
  let barsArray = [];

  let verticalSpace = ch - 50;

  let maxBar = 0;

  let allNums = true;

  catscat.forEach((element) => {
    if (isNaN(parseInt(element[0]))) {
      allNums = false;
    }
  });

  let i = 0;
  catscat.forEach((element) => {
    if (allNums) {
      let element1 = parseInt(element[0]);
      if (isNaN(element1)) element1 = element[0];
      barsArray[element1] = element;
    } else {
      barsArray[i++] = element;
    }

    if (element[1] > maxBar) maxBar = element[1];
  });
  maxBar = maxBar*1.01
  console.log(barsArray);

  let offset = 0;
  for (let i = 0; i < barsArray.length; i++) {
    if (barsArray[i] != undefined) {
      offset = i;
      break;
    }
  }
  let barCount = barsArray.length - offset;

  let leftEdge = 50
  let spacePerBar = (cw - leftEdge) / barCount;
  console.log("Spaceperbar: "+spacePerBar)
  if (spacePerBar < 20) {
    spacePerBar = 20
    // mainCanvas.width = leftEdge + 20*barCount;
    // drawBarGraph(catscat);
    // return;
  }

  let heightScale = verticalSpace / maxBar;
  console.log("STUCK 1")


  drawLine(leftEdge, 0, leftEdge, ch - 50, "white");
  drawLine(leftEdge, ch - 50, cw, ch - 50, "white");

  let tickOrder = 0
  // sequence: [1,5,10,50,100,500,1000,5000,...]
  let sequencer = (n) => (7.5+Math.pow(-1,n)*2.5)*(Math.pow(10,Math.ceil((n-2)/2)));
  let seqN = 0
  while (maxBar > tickOrder*20) {
    tickOrder = sequencer(seqN);
    seqN++;
  }

  for (let i = 0;i<maxBar;i+=tickOrder) {
    drawLine(leftEdge-5,(ch-50-i*heightScale),leftEdge,(ch-50-i*heightScale),"white");
    drawLine(leftEdge,(ch-50-i*heightScale),cw,(ch-50-i*heightScale),colors.NotAired)
    drawText(leftEdge-5,(ch-50-i*heightScale)+5,i,20,"white","right");
  }

  for (let i = offset; i < barsArray.length; i++) {
    let barX = leftEdge + (i - offset) * spacePerBar + spacePerBar * 0.05;
    if (barsArray[i] != undefined)
      drawRect(
        barX,
        ch - 50,
        spacePerBar * 0.9,
        -barsArray[i][1] * heightScale,
        colors.NotAired,
      );
    let barLabel = barsArray[i];
    if (barLabel == undefined) {
      barLabel = i;
    } else {
      barLabel = barLabel[0]
    }
    drawText(
      barX + spacePerBar * 0.45,
      ch - 15,
      barLabel,
      40,
      "white",
      "center",
      spacePerBar*0.9,
    );
  }
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
    (degrees / 180) * Math.PI,
  );
  mainContext.lineTo(x, y);
  mainContext.fill();
}

function drawText(
  x,
  y,
  str,
  size,
  color = "red",
  align = "left",
  maxW = undefined,
) {
  mainContext.fillStyle = color;
  mainContext.font = size + "px monospace, monospace";
  mainContext.textAlign = align;
  if (maxW == undefined) {
    mainContext.fillText(str, x, y);
  } else {
    mainContext.fillText(str, x, y, maxW);
  }
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

function drawLine(x1, y1, x2, y2, color = "red") {
  mainContext.strokeStyle = color;

  mainContext.beginPath();
  mainContext.moveTo(x1, y1);
  mainContext.lineTo(x2, y2);

  mainContext.stroke();
}
