var canvi = [];
var ccc = [];
var ctx;

var cmplTotal = 0;
var cmplLen = 0;
var cmplEps = 0;
var dayssince = 0;

var graphIncrement = 0;

function init() {
  generalinit();
}

function start() {
  // canvas = document.getElementById("canvas1");
  // ctx = canvas.getContext("2d");
  makeDatas();

  assembleGroups();

  distByWatchDate();

  data.sort(compareAirStart);

  let lats = [];
  let k = 0;
  while (true) {
    lats[k] = new Entry();
    lats[k].airenddate = ndaysbefore(curdate, 10000);
    for (let i = 0; i < data.length; i++) {
      const e = data[i];
      if (
        e.status == "Plan to Watch" &&
        e.airStatus == "Aired" &&
        !lats.includes(e) &&
        e.airstartdate != "" &&
        e.airenddate != "" &&
        daycount(e.airenddate) >= 0 &&
        daycount(e.airenddate) <= daycount(lats[k].airenddate)
      ) {
        lats[k] = e;
      }
    }
    let clr = colors.Sequel;
    if (isEntryNextWatch(lats[k])) clr = "rgb(255,255,255)";
    p.innerHTML += `<pre style="color:${clr};"></pre>`;
    p.lastChild.innerText = `Recent Finish: ${
      lats[k].title
    } ${defaultdatetoreadable(lats[k].airenddate)}`;
    if (lats[k].rated == "R+") {
      p.lastChild.setAttribute("class", "R");
      p.lastChild.hidden = true;
    }
    if (daycount(lats[k].airenddate) > 183) {
      break;
    }
    k++;
  }
  p.innerHTML += "<hr>";

  let earliestUpcoming;
  for (let i = 0; i < data.length; i++) {
    const e = data[i];
    if (
      e.airstartdate != "" &&
      daycount(e.airstartdate) <= 0 &&
      e.airStatus == "Not Yet Aired"
    ) {
      earliestUpcoming = e;
      break;
    }
  }
  for (let j = data.indexOf(earliestUpcoming); j < data.length; j++) {
    const e = data[j];
    p.innerHTML += `<pre></pre>`;
    p.lastChild.innerText = `Upcoming Start: ${e.title} ${defaultdatetoreadable(
      e.airstartdate
    )}`;
    if (e.rated == "R+") {
      p.lastChild.setAttribute("class", "R");
      p.lastChild.hidden = true;
    }
    if (daycount(e.airstartdate) < -31) {
      break;
    }
  }
  p.innerHTML += "<hr>";

  data.sort(compareAirFinish);
  let earliestUpcomingFinish;
  for (let i = 0; i < data.length; i++) {
    const e = data[i];
    if (
      e.airenddate != "" &&
      daycount(e.airenddate) <= 0 &&
      e.airStatus != "Aired"
    ) {
      earliestUpcomingFinish = e;
      break;
    }
  }
  for (let j = data.indexOf(earliestUpcomingFinish); j < data.length; j++) {
    const e = data[j];
    p.innerHTML += `<pre></pre>`;
    p.lastChild.innerText = `Upcoming Finish: ${
      e.title
    } ${defaultdatetoreadable(e.airenddate)}`;
    if (e.rated == "R+") {
      p.lastChild.setAttribute("class", "R");
      p.lastChild.hidden = true;
    }
    if (daycount(e.airenddate) < -31) {
      break;
    }
  }
  // lats = [];
  // k = 0;
  // while (true) {
  //   lats[k] = new Entry();
  //   lats[k].airenddate = ndaysafter(curdate, 1000);
  //   for (let i = 0; i < data.length; i++) {
  //     const e = data[i];
  //     if (
  //       e.airStatus == "Airing" &&
  //       !lats.includes(e) &&
  //       e.airenddate != "" &&
  //       daycount(e.airenddate) < 0 &&
  //       daycount(e.airenddate) >= daycount(lats[k].airenddate)
  //     ) {
  //       lats[k] = e;
  //     }
  //   }
  //   p.innerHTML += `<pre>Upcoming Finish: ${
  //     lats[k].title
  //   } ${defaultdatetoreadable(lats[k].airenddate)}</pre>`;
  //   if (lats[k].rated == "R+") {
  //     p.lastChild.setAttribute("class", "R");
  //   }
  //   if (daycount(lats[k].airenddate) < -100) {
  //     break;
  //   }
  //   if (k == 10) {
  //     break;
  //   }
  //   k++;
  // }
  p.innerHTML += "<hr>";

  groups.sort(compareGroupRating).reverse();
  // groups.sort(compareGroupTimeCom);
  groups.sort(compareGroupStatus);
  data.sort(compareMALScore).reverse();
  p.innerHTML +=
    "<pre><span onclick='toggleR()'>Assuming you want the highest rated option available, <span></pre>";
  let choice = null;
  let unsafechoice = null;
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    if (g.curStatus == "Currently Watching") {
      if (groupNextWatchEntry(g).airStatus == "Aired") {
        choice = groupNextWatchEntry(g);
        if (choice.rated >= "R+") {
          unsafechoice = choice;
        } else {
          break;
        }
      }
    }
  }
  if (choice != null) {
    p.innerHTML += `<pre></pre>`;
    p.lastChild.innerText = `\tIf you want to finish a series you are currently watching, then watch ${choice.title} (${choice.MALscore})`;
    if (unsafechoice != null) {
      p.lastChild.setAttribute("class", "R");
      if (unsafechoice != choice) {
        p.innerHTML += `<pre></pre>`;
        p.lastChild.innerText = `\tIf you want to finish a series you are currently watching, then watch ${unsafechoice.title} (${unsafechoice.MALscore})`;
        p.lastChild.setAttribute("class", "R");
      }
      p.lastChild.hidden = true;
    }
  }

  choice = null;
  unsafechoice = null;
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    if (g.curStatus == "Partially Watched") {
      if (groupNextWatchEntry(g).airStatus == "Aired") {
        choice = groupNextWatchEntry(g);
        if (choice.rated >= "R+") {
          unsafechoice = choice;
        } else {
          break;
        }
      }
    }
  }

  if (choice != null) {
    p.innerHTML += `<pre></pre>`;
    p.lastChild.innerText = `\tIf you want to finish a series you've already started, then watch ${choice.title} (${choice.MALscore})`;
    if (unsafechoice != null) {
      p.lastChild.setAttribute("class", "R");
      if (unsafechoice != choice) {
        p.innerHTML += `<pre></pre>`;
        p.lastChild.innerText = `\tIf you want to finish a series you've already started, then watch ${unsafechoice.title} (${unsafechoice.MALscore})`;
        p.lastChild.setAttribute("class", "R");
      }
      p.lastChild.hidden = true;
    }
  }

  choice = null;
  unsafechoice = null;
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    if (g.curStatus == "Yet to Start") {
      choice = groupNextWatchEntry(g);
      if (choice.rated >= "R+") {
        unsafechoice = choice;
      } else {
        break;
      }
    }
  }
  if (choice != null) {
    p.innerHTML += `<pre></pre>`;
    p.lastChild.innerText = `\tIf you want to start watching a new series, then watch ${choice.title} (${choice.MALscore})`;
    if (unsafechoice != null) {
      p.lastChild.setAttribute("class", "R");
      if (unsafechoice != choice) {
        p.innerHTML += `<pre></pre>`;
        p.lastChild.innerText = `\tIf you want to start watching a new series, then watch ${unsafechoice.title} (${unsafechoice.MALscore})`;
        p.lastChild.setAttribute("class", "R");
      }
      p.lastChild.hidden = true;
    }
  }

  choice = null;
  unsafechoice = null;
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    if (g.curStatus == "Waiting for dub") {
      choice = groupNextWatchEntry(g);
      if (choice.rated >= "R+") {
        unsafechoice = choice;
      } else {
        break;
      }
    }
  }
  if (choice != null) {
    p.innerHTML += `<pre></pre>`;
    p.lastChild.innerText = `\tIf you want to watch an undubbed series, then watch ${choice.title} (${choice.MALscore})`;
    if (unsafechoice != null) {
      p.lastChild.setAttribute("class", "R");
      if (unsafechoice != choice) {
        p.innerHTML += `<pre></pre>`;
        p.lastChild.innerText = `\tIf you want to watch an undubbed series, then watch ${unsafechoice.title} (${unsafechoice.MALscore})`;
        p.lastChild.setAttribute("class", "R");
      }
      p.lastChild.hidden = true;
    }
  }

  groups.sort(compareGroupRating).reverse();
  groups.sort(compareGroupTimeCom);
  groups.sort(compareGroupStatus);
  data.sort(compareTimeCom);
  p.innerHTML +=
    "<pre>\n\nIf instead you want to minimize the amount of time you spend watching, </pre>";

  choice = null;
  unsafechoice = null;
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    if (g.curStatus == "Currently Watching") {
      if (groupNextWatchEntry(g).airStatus == "Aired") {
        choice = groupNextWatchEntry(g);
        if (choice.rated >= "R+") {
          unsafechoice = choice;
        } else {
          break;
        }
      }
    }
  }
  if (choice != null) {
    p.innerHTML += `<pre></pre>`;
    p.lastChild.innerText = `\tIf you want to continue watching a series you're currently watching, then watch ${
      choice.title
    } (${mns2dhm(choice.determineRemLen())})`;
    if (unsafechoice != null) {
      p.lastChild.setAttribute("class", "R");
      if (unsafechoice != choice) {
        p.innerHTML += `<pre></pre>`;
        p.lastChild.innerText = `\tIf you want to continue watching a series you're currently watching, then watch ${
          unsafechoice.title
        } (${mns2dhm(unsafechoice.determineRemLen())})`;
        p.lastChild.setAttribute("class", "R");
      }
      p.lastChild.hidden = true;
    }
  }

  choice = null;
  unsafechoice = null;
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    if (g.curStatus == "Partially Watched") {
      if (groupNextWatchEntry(g).airStatus == "Aired") {
        choice = groupNextWatchEntry(g);
        if (choice.rated >= "R+") {
          unsafechoice = choice;
        } else {
          break;
        }
      }
    }
  }
  if (choice != null) {
    p.innerHTML += `<pre></pre>`;
    p.lastChild.innerText = `\tIf you want to continue watching a series you've already started, then watch ${
      choice.title
    } (${mns2dhm(choice.determineLen())})`;
    if (unsafechoice != null) {
      p.lastChild.setAttribute("class", "R");
      if (unsafechoice != choice) {
        p.innerHTML += `<pre></pre>`;
        p.lastChild.innerText = `\tIf you want to continue watching a series you've already started, then watch ${
          unsafechoice.title
        } (${mns2dhm(unsafechoice.determineLen())})`;
        p.lastChild.setAttribute("class", "R");
      }
      p.lastChild.hidden = true;
    }
  }

  choice = null;
  unsafechoice = null;
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    if (g.curStatus == "Yet to Start") {
      choice = groupNextWatchEntry(g);
      if (choice.rated >= "R+") {
        unsafechoice = choice;
      } else {
        break;
      }
    }
  }
  if (choice != null) {
    p.innerHTML += `<pre></pre>`;
    p.lastChild.innerText = `\tIf you want to start watching a new series, then watch ${
      choice.title
    } (${mns2dhm(choice.determineLen())})`;
    if (unsafechoice != null) {
      p.lastChild.setAttribute("class", "R");
      if (unsafechoice != choice) {
        p.innerHTML += `<pre></pre>`;
        p.lastChild.innerText = `\tIf you want to start watching a new series, then watch ${
          unsafechoice.title
        } (${mns2dhm(unsafechoice.determineLen())})`;
        p.lastChild.setAttribute("class", "R");
      }
      p.lastChild.hidden = true;
    }
  }

  choice = null;
  unsafechoice = null;
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    if (g.curStatus == "Waiting for dub") {
      choice = groupNextWatchEntry(g);
      if (choice.rated >= "R+") {
        unsafechoice = choice;
      } else {
        break;
      }
    }
  }
  if (choice != null) {
    p.innerHTML += `<pre></pre>`;
    p.lastChild.innerText = `\tIf you want to watch an undubbed series, then watch ${
      choice.title
    } (${mns2dhm(choice.determineLen())})`;
    if (unsafechoice != null) {
      p.lastChild.setAttribute("class", "R");
      if (unsafechoice != choice) {
        p.innerHTML += `<pre></pre>`;
        p.lastChild.innerText = `\tIf you want to watch an undubbed series, then watch ${
          unsafechoice.title
        } (${mns2dhm(unsafechoice.determineLen())})`;
        p.lastChild.setAttribute("class", "R");
      }
      p.lastChild.hidden = true;
    }
  }

  data.sort(compareMALScore);
  choice = null;
  unsafechoice = null;
  for (let i = 0; i < data.length; i++) {
    const e = data[i];
    if (
      isEntryNextWatch(e) &&
      e.airStatus == "Aired" &&
      e.status == "Plan to Watch"
    ) {
      choice = e;
      if (choice.rated >= "R+") {
        unsafechoice = choice;
      } else {
        break;
      }
    }
  }
  if (choice != null) {
    p.innerHTML += `<pre></pre>`;
    p.lastChild.innerText = `And if for some reason you want to watch the lowest rated of all, \n\tJust go ahead and watch ${
      choice.title
    } (${choice.episodes}ep ${choice.MALscore}/10 ${mns2dhm(
      choice.determineLen()
    )} ${choice.genres.join(", ")})`;
    if (unsafechoice != null) {
      p.lastChild.setAttribute("class", "R");
      if (unsafechoice != choice) {
        p.innerHTML += `<pre></pre>`;
        p.lastChild.innerText = `And if for some reason you want to watch the lowest rated of all, \n\tJust go ahead and watch ${
          unsafechoice.title
        } (${unsafechoice.episodes}ep ${unsafechoice.MALscore}/10 ${mns2dhm(
          unsafechoice.determineLen()
        )} ${unsafechoice.genres.join(", ")})`;
        p.lastChild.setAttribute("class", "R");
      }
      p.lastChild.hidden = true;
    }
  }
  data.sort(compareWatchDate);
  for (let i = 0; i < data.length; i++) {
    if (data[i].status == "Completed") {
      cmplTotal++;
      cmplLen += data[i].determineLen() * (data[i].rewatched + 1);
    } else if (data[i].status == "Watching") {
      cmplTotal += data[i].determinePercentCompletion();
      cmplLen += data[i].determineProgressLen();
    }
    cmplEps += data[i].watchedepisodes * (data[i].rewatched + 1);
    if (dayssince == 0 && data[i].startdate != "")
      dayssince = daycount(data[i].startdate);
  }
  p.innerHTML += `<hr><pre><span onclick='toggleAll()'>Since starting ${dayssince} days ago, you've watched ${cmplTotal} entries (${cmplEps} eps | ${mns2dhm(
    cmplLen
  )}), which is about ${
    Math.floor((cmplTotal / dayssince) * 1000) / 1000
  } (${mns2dhm(cmplLen / dayssince)}) per day. Alternatively, that is ${
    Math.floor((cmplLen / (60 * 24 * dayssince)) * 100000) / 1000
  }% of the time since you started</span></pre>`;
  let u = document.getElementById("mainbody").clientWidth;
  let ah = document.getElementsByTagName("a")[0].clientHeight;
  ah = 0;
  let v = innerHeight - p.clientHeight - ah;
  for (let i = 0; i < Math.floor(u / 300) * Math.floor(v / 150); i++) {
    let cv = document.createElement("canvas");
    cv.setAttribute("id", "canvas" + (i + 1));
    canvi.push(cv);
    ccc.push(true);
    insert(document.getElementById("mainbody"), cv);
  }
  graphIncrement = 0;
  for (let i = 1; i <= canvi.length; i++) {
    canvi[i - 1].onclick = function () {
      if (ccc[i - 1]) {
        setCanvas("Graph" + i, "canvas" + i);
      } else {
        graphIncrement = 0;
        clear("canvas" + i);
      }
      ccc[i - 1] = !ccc[i - 1];
    };
  }
}

function setCanvas(key, ctext) {
  let cvas = document.getElementById(ctext);
  ctx = cvas.getContext("2d");
  switch (key) {
    case "Graph1":
      data.sort(compareScores).reverse();
      let x = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (let i = 0; i < data.length; i++) {
        const e = data[i];
        x[e.score]++;
      }
      x[0] = 0;
      let y = sum(x);
      for (let i = 5; i <= 10; i++) {
        drawRect(5, 155 - 15 * i, x[i], 10, "red");
        drawText(
          10 + x[i],
          165 - 15 * i,
          i + ": " + x[i] + " (" + Math.round((x[i] / y) * 100) + "%)",
          15
        );
      }
      break;
    case "Graph2":
      let factor = cvas.width / data.length;
      let counts = [0, 0, 0, 0, 0];
      for (let i = 0; i < data.length; i++) {
        const e = data[i];
        counts[
          [
            "Watching",
            "Completed",
            "On-Hold",
            "Dropped",
            "Plan to Watch",
          ].indexOf(e.status)
        ]++;
      }
      let colorArr = [
        "rgb(51,133,67)", // Green
        "rgb(45,66,118)", // Blue
        "rgb(201,163,31)", // Yellow
        "rgb(131,47,48)", // Red
        "rgb(116,116,116)", // Gray
      ];
      for (let i = 0; i < 5; i++) {
        drawRect(
          partialSum(counts, i) * factor,
          0,
          counts[i] * factor,
          cvas.height,
          colorArr[i]
        );
      }
      break;
    case "Graph3":
      drawLine(5, cvas.height - 5, cvas.width - 5, 5, "red");
      for (let i = 0; i < data.length; i++) {
        const e = data[i];
        if (e.score != 0 && e.MALscore != 0)
          drawEllipse(
            ((e.MALscore - 5) / 5) * (cvas.width - 10) + 5,
            cvas.height - (((e.score - 5) / 5) * (cvas.height - 10) + 5),
            1,
            1,
            "red"
          );
      }
      break;
    case "Graph4":
      if (7 + 7 * graphIncrement >= myArray.length + 7) {
        break;
      }
      let weekLen = 0;
      for (let i = 0; i < 7; i++) {
        if (i + 7 * graphIncrement >= myArray.length) {
          continue;
        }
        let timecount = 0;
        for (let e of myArray[myArray.length - (i + 7 * graphIncrement) - 1]) {
          timecount += e.determineLen();
          weekLen += e.determineLen();
        }
        drawRect(
          (cvas.width / 7) * i,
          cvas.height,
          cvas.width / 7,
          -(timecount / 960) * cvas.height,
          "red"
        );
        drawText(
          (cvas.width / 7) * i,
          15,
          myArray[myArray.length - (i + 7 * graphIncrement) - 1].length,
          15,
          "white"
        );
        drawText(
          (cvas.width / 7) * i,
          30,
          daysOfWeek[
            (myArray.length - (i + 7 * graphIncrement) + 2) % 7
          ].substring(0, 3),
          15,
          "white"
        );
        drawText(
          (cvas.width / 7) * i,
          45,
          Math.round((timecount / 60) * 10) / 10 + "h",
          15,
          "white"
        );
      }
      drawLine(
        0,
        cvas.height - (cmplLen / dayssince / 960) * cvas.height,
        cvas.width,
        cvas.height - (cmplLen / dayssince / 960) * cvas.height,
        "blue"
      );
      drawText(
        0,
        cvas.height - (cmplLen / dayssince / 960) * cvas.height,
        "Avg: " + mns2dhm(cmplLen / dayssince),
        15,
        "blue"
      );
      drawLine(
        0,
        cvas.height - (weekLen / 7 / 960) * cvas.height,
        cvas.width,
        cvas.height - (weekLen / 7 / 960) * cvas.height,
        "green"
      );
      drawText(
        0,
        cvas.height - (weekLen / 7 / 960) * cvas.height,
        "WeekAvg: " + mns2dhm(weekLen / 7),
        15,
        "green"
      );
      break;
    case "Clear":
      ctx.clearRect(0, 0, cvas.width, cvas.height);
      break;
    default:
      graphIncrement++;
      setCanvas("Graph4", ctext);
      break;
  }
}

function toggleAll() {
  for (let c of canvi) {
    c.onclick();
  }
}

function toggleR() {
  for (let n of document.getElementsByClassName("R")) {
    n.hidden = !n.hidden;
  }
}

function partialSum(arr, n) {
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += arr[i];
  }
  return sum;
}

function clearAll() {
  for (let s of canvi) {
    clear(s.id);
  }
}

function clear(ctext) {
  setCanvas("Clear", ctext);
}

function drawLine(x1, y1, x2, y2, color = "red") {
  ctx.strokeStyle = color;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);

  ctx.stroke();
}

function drawRect(x, y, w, h, color = "red") {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.fillRect(x, y, w, h);
  ctx.fill();
}

function drawEllipse(x, y, w, h, color = "red", degrees = 360) {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, w, h, 0, 0, (degrees / 180) * Math.PI);
  ctx.fill();
}

function drawText(x, y, str, size, color = "red") {
  ctx.fillStyle = color;
  ctx.font = size + "px Arial";
  ctx.fillText(str, x, y);
}

function sum(x) {
  let sum = 0;
  x.forEach((element) => {
    sum += element;
  });
  return sum;
}
