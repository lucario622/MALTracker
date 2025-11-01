var canvi = [];
var ccc = [];
var ctx;

var megacv;
var v;
var savedselected;

var cmplTotal = 0;
var cmplLen = 0;
var cmplEps = 0;
var dayssince = 0;
var chain = [];
var minsremaining = 480;
var norepeats = [];
var candidates = 0;

var items = [];
var itemsCount = [];
var colorarr = [];
var total = 0;

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
    if (daycount(e.airstartdate) < -7) {
      break;
    }
  }
  p.innerHTML += "<hr>";

  data.sort(compareAltFinish);
  let earliestDubcomingFinish;
  for (let i = 0; i < data.length; i++) {
    const e = data[i];
    if (
      (e.airenddate != "" &&
        daycount(e.airenddate) <= 0 &&
        e.airStatus != "Aired") ||
      (isDate(e.dubenddate) && daycount(e.dubenddate) <= 0)
    ) {
      earliestDubcomingFinish = e;
      break;
    }
  }
  let chosen = [];
  for (let j = data.indexOf(earliestDubcomingFinish); j < data.length; j++) {
    const e = data[j];
    if (!isDate(e.airenddate)) {
      break;
    }
    if (isDate(e.dubenddate)) {
      chosen.push([e, 1, e.dubenddate]);
    } else if (e.status != "On-Hold") {
      chosen.push([e, 2, e.airenddate]);
    }
  }

  data.sort(compareAirFinish);
  tempchosen = [];
  for (let i = 0; i < data.length; i++) {
    const e = data[i];
    if (
      e.status == "On-Hold" &&
      !isDate(e.dubenddate) &&
      daycount(e.airenddate) <= 365 &&
      isEntryNextWatch(e)
    ) {
      chosen.push([e, 3, ndaysafter(e.airenddate, 365)]);
    }
  }
  chosen.sort(compDts);

  for (let e of chosen) {
    p.innerHTML += `<pre></pre>`;
    if (e[1] == 1) {
      p.lastChild.innerText = `Upcoming Dub Finish: ${
        e[0].title
      } ${defaultdatetoreadable(e[2])}`;
    } else if (e[1] == 2) {
      p.lastChild.innerText = `Upcoming Finish: ${
        e[0].title
      } ${defaultdatetoreadable(e[2])}`;
    } else {
      p.lastChild.innerText = `Upcoming Sub Wait Finish: ${
        e[0].title
      } ${defaultdatetoreadable(e[2])}`;
    }
    if (e[0].rated == "R+") {
      p.lastChild.setAttribute("class", "R");
      p.lastChild.hidden = true;
    }
    if (daycount(e[2]) < -31) {
      break;
    }
  }

  p.innerHTML += "<hr>";

  //~~~~~~~~~~~~~~~~
  groups.sort(compareGroupRating).reverse();
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
    if (
      g.curStatus == "Waiting for latest dub" ||
      g.curStatus == "Waiting for first dub"
    ) {
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
    if (
      g.curStatus == "Waiting for latest dub" ||
      g.curStatus == "Waiting for first dub"
    ) {
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

  // Next Entries Panel
  for (let i = 0; i < data.length; i++) {
    if (
      data[i].airStatus == "Aired" &&
      data[i].status != "Completed" &&
      (data[i].status != "On-Hold" || daycount(data[i].airenddate) >= 365)
    ) {
      candidates++;
    }
  }

  // find a starting item
  // look for mid-watch entries first
  for (let i = 0; i < data.length; i++) {
    const e = data[i];
    if (e.status == "Watching" && e.airStatus == "Aired") {
      intothechain(e);
      break;
    }
  }
  if (chain.length == 0) {
    // no mid-watch entries
    // check for mid-series entries
    for (let i = 0; i < groups.length; i++) {
      const g = groups[i];
      if (g.curStatus == "Partially Watched") {
        if (groupNextWatchEntry(g).airStatus == "Aired") {
          const e = groupNextWatchEntry(g);
          intothechain(e);
          break;
        }
      }
    }
  }
  if (chain.length == 0) {
    // no mid-series entries
    // take lowest rated entry released at least a year ago
    for (let i = 0; i < data.length; i++) {
      const e = data[i];
      if (
        isEntryNextWatch(e) &&
        e.airStatus == "Aired" &&
        e.status != "Completed" &&
        (e.status != "On-Hold" || daycount(e.airenddate) >= 365)
      ) {
        intothechain(e);
        break;
      }
    }
  }

  while (minsremaining > 0) {
    let lastitem = chain[chain.length - 1][0];
    if (lastitem == 0) {
      lastitem = chain[chain.length - 2][0];
    }
    // find next item
    // first check if there is a logical next one
    let e = getNext(lastitem);
    if (
      e != null &&
      e.airStatus == "Aired" &&
      e.status != "Completed" &&
      (e.status != "On-Hold" || daycount(e.airenddate) >= 365) &&
      !norepeats.includes(e)
    ) {
      intothechain(e);
    } else {
      // last item was a dead end (end of a series)
      // search again for a low rated entry to fill the spot
      for (let i = 0; i < data.length; i++) {
        const e = data[i];
        if (
          isEntryNextWatch(e) &&
          e.airStatus == "Aired" &&
          e.status != "Completed" &&
          (e.status != "On-Hold" || daycount(e.airenddate) >= 365) &&
          !norepeats.includes(e)
        ) {
          intothechain(e);
          break;
        }
      }
    }
  }
  if (chain.length >= 2) {
    if (
      chain[chain.length - 1].length != 2 &&
      chain[chain.length - 2].length != 2
    ) {
      chain.push([0, 0]);
    }
  } else if (chain.length == 1) {
    if (chain[chain.length - 1].length != 2) {
      chain.push([0, 0]);
    }
  }

  minsremaining = 480000;
  let lastlast = ["", 0, 0];
  while (minsremaining > 0) {
    let lastitem = chain[chain.length - 1][0];
    if (lastlast[0] === lastitem) {
      break;
    }
    if (lastitem == 0) {
      lastitem = chain[chain.length - 2][0];
    }
    // find next item
    // first check if there is a logical next one
    let e = getNext(lastitem);
    if (
      e != null &&
      e.airStatus == "Aired" &&
      e.status != "Completed" &&
      (e.status != "On-Hold" || daycount(e.airenddate) >= 365) &&
      !norepeats.includes(e)
    ) {
      intothechain(e);
    } else {
      // last item was a dead end (end of a series)
      // search again for a low rated entry to fill the spot
      for (let i = 0; i < data.length; i++) {
        const e = data[i];
        if (
          isEntryNextWatch(e) &&
          e.airStatus == "Aired" &&
          e.status != "Completed" &&
          (e.status != "On-Hold" || daycount(e.airenddate) >= 365) &&
          !norepeats.includes(e)
        ) {
          intothechain(e);
          lastlast = [lastitem, 1, 1];
          break;
        }
      }
    }
    lastlast = [lastitem, 1, 1];
  }

  // Series Pie Chart
  groups.sort(compareGroupTotalLength).reverse();
  for (let i = 0; i < groups.length; i++) {
    const curg = groups[i];
    if (curg.groupName != "Individuals") {
      let compCount = 0;
      let watchingCount = 0;
      let curlength = 0;
      for (let j = 0; j < curg.entries.length; j++) {
        const e = curg.entries[j];
        if (e.status == "Completed") {
          curlength += e.determineLen();
          compCount++;
        } else if (e.status == "Watching") {
          curlength += e.determineLen() - e.determineRemLen();
          watchingCount++;
        }
      }
      if (compCount + watchingCount > 0) {
        items.push(curg.groupName);
        itemsCount.push(curlength);
      }
    } else {
      curg.entries.sort(compareLength).reverse();
      for (let j = 0; j < curg.entries.length; j++) {
        const e = curg.entries[j];
        items.push(e.title);
        itemsCount.push(e.determineLen());
      }
    }
  }

  for (let i = 0; i < items.length; i++) {
    total += itemsCount[i];
  }
  let cutoff = total / 100;
  let newitems = [];
  let newitemsCount = [];
  let miscitemsCount = 0;
  for (let i = 0; i < items.length; i++) {
    if (itemsCount[i] >= cutoff) {
      newitems.push(items[i]);
      newitemsCount.push(itemsCount[i]);
    } else {
      miscitemsCount += itemsCount[i];
    }
  }
  items = newitems;
  itemsCount = newitemsCount;
  if (miscitemsCount > 0) {
    items.push("<1%");
    itemsCount.push(miscitemsCount);
  }
  for (let i = 0; i < items.length; i++) {
    colorarr[i] =
      "rgb(" +
      Math.random() * 255 +
      "," +
      Math.random() * 255 +
      "," +
      Math.random() * 255 +
      ")";
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
  p.innerHTML += `<hr><pre><span onclick='toggleCanvi()'>Since starting ${dayssince} days ago, you've watched ${
    Math.floor(cmplTotal * 100) / 100
  } entries (${cmplEps} eps | ${mns2dhm(cmplLen)}), which is about ${
    Math.floor((cmplTotal / dayssince) * 1000) / 1000
  } (${mns2dhm(cmplLen / dayssince)}) per day. Alternatively, that is ${
    Math.floor((cmplLen / (60 * 24 * dayssince)) * 100000) / 1000
  }% of the time since you started</span></pre>`;
  let u = document.getElementById("mainbody").clientWidth;
  let ah = document.getElementsByTagName("a")[0].clientHeight;
  ah = 0;
  v = innerHeight - p.clientHeight - ah;
  megacv = document.createElement("canvas");
  megacv.height = v - 40;
  megacv.width = (v - 30) * 2;
  megacv.width = u - 30;
  megacv.setAttribute("id", "megacv");
  megacv.hidden = true;
  insert(document.getElementById("mainbody"), megacv);
  megacv.onclick = function () {
    megacv.hidden = true;
    toggleCanvi();
  };
  megacv.oncontextmenu = function () {
    p.hidden = !p.hidden;
    if (p.hidden) {
      megacv.height = innerHeight - 40;
    } else {
      megacv.height = v - 40;
    }
    setCanvas("Graph" + savedselected, "megacv");
    return false;
  };
  for (let i = 0; i < Math.floor(u / 300) * Math.floor(v / 150); i++) {
    let cv = document.createElement("canvas");
    cv.setAttribute("id", "canvas" + (i + 1));
    cv.oncontextmenu = function () {
      p.hidden = !p.hidden;
      if (p.hidden) {
        megacv.height = innerHeight - 40;
      } else {
        megacv.height = v - 40;
      }
      return false;
    };
    canvi.push(cv);
    ccc.push(true);
    insert(document.getElementById("mainbody"), cv);
  }
  graphIncrement = 0;
  for (let i = 1; i <= canvi.length; i++) {
    setCanvas("Graph" + i, "canvas" + i);
    canvi[i - 1].onclick = function () {
      toggleCanvi();
      setCanvas("Clear", "megacv");
      setCanvas("Graph" + i, "megacv");
      megacv.hidden = false;
      savedselected = i;
    };
  }
  toggleCanvi();
}

function setCanvas(key, ctext) {
  let cvas = document.getElementById(ctext);
  ctx = cvas.getContext("2d");
  switch (key) {
    case "Graph1":
      data.sort(compareScores).reverse();
      let x = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let minscore = 10;
      let maxscore = 1;
      let maxcount = 0;
      for (let i = 0; i < data.length; i++) {
        const e = data[i];
        if (e.score == 0) break;
        if (minscore > e.score) minscore = e.score;
        if (maxscore < e.score) maxscore = e.score;
        x[e.score]++;
        if (maxcount < x[e.score]) maxcount = x[e.score];
      }
      x[0] = 0;
      let y = sum(x);
      let leftgap = cvas.width / 12;
      let topgap = cvas.height / 30;
      let fontsz = cvas.height / 10;
      for (let i = minscore; i <= maxscore; i++) {
        drawText(
          leftgap - (fontsz / 1.84) * ("" + i).length - cvas.width / 60,
          topgap + cvas.height - cvas.height / 150 - (cvas.height / 10) * i,
          i,
          fontsz,
          "rgb(158,158,158)"
        );
        let barspace = cvas.width * 0.75 - leftgap;
        let rectwidth = (x[i] / maxcount) * barspace - cvas.width / 150;
        drawCircle(
          rectwidth + leftgap,
          topgap + cvas.height + cvas.height / 150 - (cvas.height / 10) * i,
          cvas.height / 75,
          "rgb(45,66,118)"
        );
        drawCircle(
          rectwidth + leftgap,
          topgap +
            cvas.height +
            (9 * cvas.height) / 150 -
            (cvas.height / 10) * i,
          cvas.height / 75,
          "rgb(45,66,118)"
        );
        drawRect(
          rectwidth + leftgap - 1,
          topgap + cvas.height + cvas.height / 150 - (cvas.height / 10) * i,
          1 + cvas.height / 75,
          cvas.height / 18.75,
          "rgb(45,66,118)"
        );
        drawRect(
          leftgap,
          topgap + cvas.height - cvas.height / 150 - (cvas.height / 10) * i,
          Math.max(rectwidth, 0),
          cvas.height / 12.5,
          "rgb(45,66,118)"
        );
        let percentstring = "(" + Math.round((x[i] / y) * 100) + "%)";
        drawText(
          cvas.width - (fontsz / 1.84) * percentstring.length,
          topgap + cvas.height - cvas.height / 150 - (cvas.height / 10) * i,
          percentstring,
          fontsz,
          "rgb(158,158,158)"
        );
        let countstring = x[i] + "";
        drawText(
          cvas.width -
            (fontsz / 1.84) * 5 -
            (fontsz / 1.84) * countstring.length,
          topgap + cvas.height - cvas.height / 150 - (cvas.height / 10) * i,
          countstring,
          fontsz,
          "rgb(158,158,158)"
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
      data.sort(compareTitles);
      data.sort(compareWatchEnd).reverse();
      let ftsz = cvas.height / 20;
      drawLine(5, cvas.height - 5, cvas.width - 5, 5, "red");
      drawLine(5, 0.9 * cvas.height - 2, 0.9 * cvas.width - 2, 5, "green");
      drawLine(
        0.1 * cvas.width + 4,
        cvas.height - 5,
        cvas.width - 5,
        0.1 * cvas.height + 4,
        "green"
      );
      let takentop = [[], [], [], [], [], [], [], [], [], [], []];
      let takenbottom = [[], [], [], [], [], [], [], [], [], [], []];
      for (let i = 0; i < 5; i++) {
        takentop[i] = [0, cvas.width];
        takenbottom[i] = [0, cvas.width];
      }
      for (let i = 5; i <= 10; i++) {
        takentop[i] = [-10, -5, cvas.width + 5, cvas.width + 10];
        takenbottom[i] = [-10, -5, cvas.width + 5, cvas.width + 10];
      }
      takentop[10] = [0, cvas.width];
      takenbottom[5] = [0, cvas.width];
      for (let i = 0; i < data.length; i++) {
        const e = data[i];
        if (e.score != 0 && e.MALscore != 0) {
          drawCircle(
            ((e.MALscore - 5) / 5) * (cvas.width - 10) + 5,
            cvas.height - (((e.score - 5) / 5) * (cvas.height - 10) + 5),
            ftsz / 15,
            "red"
          );
          if (i > 30) {
            continue;
          }
          let doesFitifleft = true;
          let doesFitifright = true;
          let displaytext = e.title;
          let maxlength = 16;
          // if (displaytext.length > maxlength) {
          //   displaytext = displaytext.substring(0,maxlength-3)+"..."
          // }
          let newleftifleft =
            ((e.MALscore - 5) / 5) * (cvas.width - 10) +
            5 -
            ftsz * 0.55 * displaytext.length;
          let newrightifleft = ((e.MALscore - 5) / 5) * (cvas.width - 10) + 5;
          let newleftifright = ((e.MALscore - 5) / 5) * (cvas.width - 10) + 5;
          let newrightifright =
            ((e.MALscore - 5) / 5) * (cvas.width - 10) +
            5 +
            ftsz * 0.55 * displaytext.length;
          for (let j = 0; j < takentop[e.score].length; j += 2) {
            if (
              !(
                newrightifleft < takentop[e.score][j] ||
                newleftifleft > takentop[e.score][j + 1]
              )
            ) {
              doesFitifleft = false;
            }
            if (
              !(
                newrightifright < takentop[e.score][j] ||
                newleftifright > takentop[e.score][j + 1]
              )
            ) {
              doesFitifright = false;
            }
          }
          if (doesFitifleft && doesFitifright) doesFitifleft = false;
          if (doesFitifleft) {
            drawText(
              newleftifleft,
              cvas.height -
                (((e.score - 5) / 5) * (cvas.height - 10) +
                  5 +
                  cvas.height / 15),
              displaytext,
              ftsz,
              "white",
              "middle"
            );
            drawLine(
              ((e.MALscore - 5) / 5) * (cvas.width - 10) + 5,
              cvas.height - (((e.score - 5) / 5) * (cvas.height - 10) + 5),
              ((e.MALscore - 5) / 5) * (cvas.width - 10) + 5,
              cvas.height -
                (((e.score - 5) / 5) * (cvas.height - 10) +
                  5 +
                  cvas.height / 15),
              "green"
            );
            takentop[e.score].push(newleftifleft);
            takentop[e.score].push(newrightifleft);
            continue;
          }
          if (doesFitifright) {
            drawText(
              newleftifright,
              cvas.height -
                (((e.score - 5) / 5) * (cvas.height - 10) +
                  5 +
                  cvas.height / 15),
              displaytext,
              ftsz,
              "white",
              "middle"
            );
            drawLine(
              ((e.MALscore - 5) / 5) * (cvas.width - 10) + 5,
              cvas.height - (((e.score - 5) / 5) * (cvas.height - 10) + 5),
              ((e.MALscore - 5) / 5) * (cvas.width - 10) + 5,
              cvas.height -
                (((e.score - 5) / 5) * (cvas.height - 10) +
                  5 +
                  cvas.height / 15),
              "green"
            );
            takentop[e.score].push(newleftifright);
            takentop[e.score].push(newrightifright);
            continue;
          }
          doesFitifleft = true;
          doesFitifright = true;
          for (let j = 0; j < takenbottom[e.score].length; j += 2) {
            if (
              !(
                newrightifright < takenbottom[e.score][j] ||
                newleftifright > takenbottom[e.score][j + 1]
              )
            ) {
              doesFitifright = false;
            }
            if (
              !(
                newrightifleft < takenbottom[e.score][j] ||
                newleftifleft > takenbottom[e.score][j + 1]
              )
            ) {
              doesFitifleft = false;
            }
          }
          if (doesFitifleft && doesFitifright) doesFitifleft = false;
          if (doesFitifright) {
            drawText(
              newleftifright,
              cvas.height -
                (((e.score - 5) / 5) * (cvas.height - 10) +
                  5 -
                  cvas.height / 15),
              displaytext,
              ftsz,
              "white",
              "middle"
            );
            drawLine(
              ((e.MALscore - 5) / 5) * (cvas.width - 10) + 5,
              cvas.height - (((e.score - 5) / 5) * (cvas.height - 10) + 5),
              ((e.MALscore - 5) / 5) * (cvas.width - 10) + 5,
              cvas.height -
                (((e.score - 5) / 5) * (cvas.height - 10) +
                  5 -
                  cvas.height / 15),
              "green"
            );
            takenbottom[e.score].push(newleftifright);
            takenbottom[e.score].push(newrightifright);
            continue;
          }
          if (doesFitifleft) {
            drawText(
              newleftifleft,
              cvas.height -
                (((e.score - 5) / 5) * (cvas.height - 10) +
                  5 -
                  cvas.height / 15),
              displaytext,
              ftsz,
              "white",
              "middle"
            );
            drawLine(
              ((e.MALscore - 5) / 5) * (cvas.width - 10) + 5,
              cvas.height - (((e.score - 5) / 5) * (cvas.height - 10) + 5),
              ((e.MALscore - 5) / 5) * (cvas.width - 10) + 5,
              cvas.height -
                (((e.score - 5) / 5) * (cvas.height - 10) +
                  5 -
                  cvas.height / 15),
              "green"
            );
            takenbottom[e.score].push(newleftifleft);
            takenbottom[e.score].push(newrightifleft);
            continue;
          }
        }
      }
      break;
    case "Graph4":
      let bigfont = Math.min(cvas.height / 10, cvas.height / 20);
      let ftsz4 = Math.min(cvas.height / 10, cvas.height / 15);
      let downage = 0;
      let leftage = 0;
      let saveddownage = 0;
      let rightest = 0;
      let thecolor = "white";
      for (let e of chain) {
        if (
          downage >= cvas.height - ftsz4 &&
          leftage + rightest < cvas.width &&
          ftsz4 != bigfont
        ) {
          downage = saveddownage;
          leftage += rightest;
          rightest = 0;
        }
        if (downage >= cvas.height) {
          break;
        }
        if (e.length != 3 && leftage == 0) {
          drawLine(0, downage - 2, cvas.width, downage - 2, "white");
          thecolor = "rgb(60, 60, 60)";
          ftsz4 = bigfont / 4;
          saveddownage = downage;
          rightest = 0;
          continue;
        }
        let mystr = e[0].title + " " + e[1] + "-" + e[2];
        if (e[0].episodes == 1) {
          mystr = e[0].title;
        } else if (e[2] == e[0].episodes && e[1] == 1) {
          mystr = e[0].title + " (all " + e[2] + ")";
        } else if (e[1] == e[2]) {
          mystr = e[0].title + " " + e[1];
        }
        drawText(leftage, downage, mystr, ftsz4, thecolor);
        let rightness = mystr.length * 0.55 * ftsz4;
        if (rightness > rightest) {
          rightest = rightness;
        }
        downage += ftsz4;
      }
      break;
    case "Graph5":
      let cw = cvas.width;
      let ch = cvas.height;
      // outline drawing
      let circlesize = Math.min(ch * 0.5, cw * 0.2);
      drawEllipse(
        cw * 0.75,
        ch * 0.5,
        circlesize + 1,
        circlesize + 1,
        "rgb(237,237,237)"
      );
      // legend drawing
      if (items.length <= 10) {
        for (let i = 0; i < items.length; i++) {
          if (items[i] == "") items[i] = "None";
          let color = colorarr[i];
          let count = itemsCount[i];
          let text =
            getNick(items[i]) +
            " " +
            Math.round((count / total) * 10000) / 100 +
            "%";
          let rectX = cw / 16;
          let rectY = ch / 5 + (i * ch) / 10;
          let rectW = cw / 8;
          let rectH = ch / 12;
          let textH = ch / 18;
          if (items.length > 6) {
            let n = items.length;
            rectX = cw / 16;
            rectY = ch / 5 + (i * 6 * ch) / 10 / n;
            rectW = ((cw / 8) * 6) / n;
            rectH = ch / 2 / n;
            textH = ch / 3 / n;
          }
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
            rectY + rectH / 2,
            text,
            textH,
            "rgb(237,237,237)",
            "middle"
          );
        }
      } else {
        let m = Math.ceil(Math.sqrt(items.length));
        let rows = 2 * m;
        let cols = Math.ceil(m / 2);
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            let k = cols * i + j;
            if (k >= items.length) continue;
            let color = colorarr[k];
            let count = itemsCount[k];
            let text =
              getNick(items[k]) +
              " " +
              Math.round((count / total) * 10000) / 100 +
              "%";
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
              rectY + rectH / 2,
              text,
              textH,
              "rgb(237,237,237)",
              "middle"
            );
          }
        }
      }

      // slice drawing
      let curTotal = 0;
      for (let i = 0; i < items.length; i++) {
        let count = itemsCount[i];
        let color = colorarr[i];
        drawEllipse(
          cw * 0.75,
          ch * 0.5,
          circlesize,
          circlesize,
          color,
          (count / total) * 360,
          (curTotal / total) * 360
        );
        curTotal += count;
      }
      break;
    case "GraphN":
      if (7 + 7 * graphIncrement >= myArray.length + 7) {
        break;
      }
      let weekLen = 0;
      let fontsiz = cvas.height / 10;
      for (let i = 0; i < 7; i++) {
        if (i + 7 * graphIncrement >= myArray.length) {
          continue;
        }
        let timecount = 0;
        for (let e of myArraysplit[
          myArraysplit.length - (i + 7 * graphIncrement) - 1
        ]) {
          if (e.determineDayCount() >= 20) continue;
          timecount +=
            (e.determineLen() - e.determineRemLen()) / e.determineDayCount();
          weekLen +=
            (e.determineLen() - e.determineRemLen()) / e.determineDayCount();
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
          0,
          myArray[myArray.length - (i + 7 * graphIncrement) - 1].length,
          fontsiz,
          "white"
        );
        drawText(
          (cvas.width / 7) * i,
          fontsiz,
          daysOfWeek[
            (myArray.length - (i + 7 * graphIncrement) + 2) % 7
          ].substring(0, 3),
          fontsiz,
          "white"
        );
        drawText(
          (cvas.width / 7) * i,
          fontsiz * 2,
          Math.round((timecount / 60) * 10) / 10 + "h",
          fontsiz,
          "white"
        );
        let somedate = ndaysbefore(curdate, i + 7 * graphIncrement);
        if (somedate.substring(0, 2) == "01") {
          drawText(
            (cvas.width / 7) * (i + 1) - (fontsiz / 1.6) * 3,
            0,
            mArr[parseInt(somedate.substring(3, 5)) - 1],
            fontsiz,
            "white"
          );
          drawRect((cvas.width / 7) * (i + 1) - 2, 0, 2, cvas.height, "white");
        }
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
        -fontsiz + cvas.height - (cmplLen / dayssince / 960) * cvas.height,
        "Avg: " + mns2dhm(cmplLen / dayssince),
        fontsiz,
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
        -fontsiz + cvas.height - (weekLen / 7 / 960) * cvas.height,
        "WeekAvg: " + mns2dhm(weekLen / 7),
        fontsiz,
        "green"
      );
      break;
    case "Clear":
      ctx.clearRect(0, 0, cvas.width, cvas.height);
      break;
    default:
      graphIncrement = parseInt(key.substring(5)) - 6;
      setCanvas("GraphN", ctext);
      break;
  }
}

function intothechain(e) {
  let startep = e.watchedepisodes + 1;
  let endep = e.episodes;
  if (e.determineRemLen() > minsremaining) {
    endep =
      e.watchedepisodes +
      Math.ceil((minsremaining / e.determineLen()) * e.episodes);
    minsremaining = 0;
    chain.push([e, startep, endep]);
    if (endep != e.episodes) {
      chain.push([0, 0]);
      chain.push([e, endep + 1, e.episodes]);
    }
  } else {
    minsremaining -= (endep - startep + 1) * (e.determineLen() / e.episodes);
    chain.push([e, startep, endep]);
  }
  norepeats.push(e);
}

function toggleCanvi() {
  for (let c of canvi) {
    c.hidden = !c.hidden;
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

function drawEmptyRect(x, y, w, h, color = "red") {
  ctx.strokeStyle = color;
  ctx.lineWidth = "1";
  ctx.fillStyle;
  ctx.beginPath();
  ctx.strokeRect(x, y, w, h);
  ctx.fill();
}

function drawEllipse(x, y, w, h, color = "red", degrees = 360, startangle = 0) {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.ellipse(
    x,
    y,
    w,
    h,
    (startangle / 180) * Math.PI,
    0,
    (degrees / 180) * Math.PI
  );
  ctx.lineTo(x, y);
  ctx.fill();
}

function drawCircle(x, y, r, color = "red") {
  drawEllipse(x, y, r, r, color);
}

function drawText(x, y, str, size, color = "red", bsl = "top") {
  ctx.textAlign = "left";
  ctx.textBaseline = bsl;
  ctx.fillStyle = color;
  ctx.font = size + "px monospace";
  ctx.fillText(str, x, y);
}

function drawTextRA(x, y, str, size, color = "red", bsl = "top") {
  ctx.textAlign = "right";
  ctx.textBaseline = bsl;
  ctx.fillStyle = color;
  ctx.font = size + "px monospace";
  ctx.fillText(str, x, y);
}

function sum(x) {
  let sum = 0;
  x.forEach((element) => {
    sum += element;
  });
  return sum;
}

function compDts(a, b) {
  acode =
    parseInt(a[2].substring(6, 8)) * 10000 +
    parseInt(a[2].substring(3, 5)) * 100 +
    parseInt(a[2].substring(0, 2));
  bcode =
    parseInt(b[2].substring(6, 8)) * 10000 +
    parseInt(b[2].substring(3, 5)) * 100 +
    parseInt(b[2].substring(0, 2));
  if (acode < 400000) acode += 1000000;
  if (bcode < 400000) bcode += 1000000;
  if (isNaN(acode)) acode = 1000000000;
  if (isNaN(bcode)) bcode = 1000000000;
  if (acode % 10000 == 0) acode += 1014;
  if (bcode % 10000 == 0) bcode += 1014;
  if (acode % 100 == 0) acode += 14;
  if (bcode % 100 == 0) bcode += 14;
  if (acode > bcode) {
    return 1;
  } else if (acode < bcode) {
    return -1;
  }
  return 0;
}
