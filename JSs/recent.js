var canvi = [];
var ccc = [];
var ctx;

var megacv;

var cmplTotal = 0;
var cmplLen = 0;
var cmplEps = 0;
var dayssince = 0;
var chain = [];

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
  p.innerHTML += "<hr>";

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
  let minsremaining = 480;
  let norepeats = [];
  while (minsremaining > 0) {
    if (chain.length == 0) {
      // find a starting item
      // look for mid-watch entries first
      for (let i = 0; i < data.length; i++) {
        const e = data[i];
        if (e.status == "Watching" && e.airStatus == "Aired") {
          let startep = e.watchedepisodes + 1;
          let endep = e.episodes;
          if (e.determineRemLen() > minsremaining) {
            endep =
              e.watchedepisodes +
              Math.floor((minsremaining / e.determineLen()) * e.episodes);
            minsremaining = 0;
          }
          minsremaining -=
            (endep - startep + 1) * (e.determineLen() / e.episodes);
          chain.push([e, startep, endep]);
          norepeats.push(e);
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
              let startep = e.watchedepisodes + 1;
              let endep = e.episodes;
              if (e.determineRemLen() > minsremaining) {
                endep =
                  e.watchedepisodes +
                  Math.floor((minsremaining / e.determineLen()) * e.episodes);
                minsremaining = 0;
              }
              minsremaining -=
                (endep - startep + 1) * (e.determineLen() / e.episodes);
              chain.push([e, startep, endep]);
              norepeats.push(e);
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
            let startep = e.watchedepisodes + 1;
            let endep = e.episodes;
            if (e.determineRemLen() > minsremaining) {
              endep =
                e.watchedepisodes +
                Math.floor((minsremaining / e.determineLen()) * e.episodes);
              minsremaining = 0;
            }
            minsremaining -=
              (endep - startep + 1) * (e.determineLen() / e.episodes);
            chain.push([e, startep, endep]);
            norepeats.push(e);
            break;
          }
        }
      }
    } else {
      // already items
      const lastitem = chain[chain.length - 1][0];
      // find next item
      // first check if there is a logical next one
      let e = getNext(lastitem);
      if (e != null) {
        let startep = e.watchedepisodes + 1;
        let endep = e.episodes;
        if (e.determineRemLen() > minsremaining) {
          endep =
            e.watchedepisodes +
            Math.floor((minsremaining / e.determineLen()) * e.episodes);
          minsremaining = 0;
        }
        minsremaining -=
          (endep - startep + 1) * (e.determineLen() / e.episodes);
        chain.push([e, startep, endep]);
        norepeats.push(e);
        continue;
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
            let startep = e.watchedepisodes + 1;
            let endep = e.episodes;
            if (e.determineRemLen() > minsremaining) {
              endep =
                e.watchedepisodes +
                Math.floor((minsremaining / e.determineLen()) * e.episodes);
              minsremaining = 0;
            }
            minsremaining -=
              (endep - startep + 1) * (e.determineLen() / e.episodes);
            chain.push([e, startep, endep]);
            norepeats.push(e);
            break;
          }
        }
      }
    }
  }
  console.log(chain);
  if (chain.length == 0) {
    console.log("chainless");
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
  let v = innerHeight - p.clientHeight - ah;
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
  for (let i = 0; i < Math.floor(u / 300) * Math.floor(v / 150); i++) {
    let cv = document.createElement("canvas");
    cv.setAttribute("id", "canvas" + (i + 1));
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
      let ftsz4 = cvas.height / 10;
      let downage = 0;
      for (let e of chain) {
        let mystr = e[0].title + " " + e[1] + "-" + e[2];
        if (e[0].episodes == 1) {
          mystr = e[0].title;
        } else if (e[2] == e[0].episodes && e[1] == 1) {
          mystr = e[0].title + " (all)";
        } else if (e[1] == e[2]) {
          mystr = e[0].title + " " + e[1];
        }
        drawText(0, downage, mystr, ftsz4, "white");
        downage += ftsz4;
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
        for (let e of myArray[myArray.length - (i + 7 * graphIncrement) - 1]) {
          timecount += e.determineLen() - e.determineRemLen();
          weekLen += e.determineLen() - e.determineRemLen();
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
      graphIncrement = parseInt(key.substring(5)) - 5;
      setCanvas("GraphN", ctext);
      break;
  }
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

function drawEllipse(x, y, w, h, color = "red", degrees = 360) {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, w, h, 0, 0, (degrees / 180) * Math.PI);
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
