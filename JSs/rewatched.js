var rewaDict = {};
var sortChoice = true;

function init() {
  generalinit();
}

function start() {
  makeDatas();

  assembleGroups();

  data.forEach((e) => {
    if (e.rewatched == true) {
      rewaDict[e.title] = 1;
    } else if (e.rewatched >= 1) {
      rewaDict[e.title] = e.rewatched;
    } else {
      if (e.title in rewaDict) {
        delete rewaDict[e.title];
      }
    }
  });

  testdisplay();
}

function testdisplay() {
  d.innerHTML = "";
  p.innerHTML = "";
  data.sort(compareTitles);
  if (sortChoice) {
    data.sort(compareScores).reverse();
  } else {
    data.sort(compareWatchEnd);
  }
  data.sort(compareRewatched);
  // p.innerHTML = "<b>WatchedVScore\tTitle<b>";
  if (sortChoice) {
    p.innerHTML = "<b>Watched\tScore&nabla;\tWatches\tTitle<b>";
  } else {
    p.innerHTML = "<b>Watched&nabla;Score\tWatches\tTitle<b>";
  }
  p.lastChild.onclick = () => {
    sortChoice = !sortChoice;
    testdisplay();
  };
  p.style.color = colors.Aired;
  for (let i = 0; i < data.length; i++) {
    const e = data[i];
    if (e.status != "Completed") {
      continue;
    }
    let pr1 = document.createElement("pre");
    pr1.innerHTML =
      "<b>" +
      ds2ymd(daycount(e.enddate)) +
      (ds2ymd(daycount(e.enddate)).length < 8 ? "\t" : "") +
      e.score +
      "\t" +
      e.rewatched +
      "\t" +
      e.title +
      "</b>";
    if (e.rewatched >= 1) {
      if (sortChoice) {
        if (daycount(e.enddate) < 187) {
          pr1.style.color = "rgb(27, 102, 33)";
        } else if (daycount(e.enddate) < 366) {
          pr1.style.color = colors.Watching; //rgb(45,176,57)
        } else {
          pr1.style.color = "rgb(66, 255, 82)";
        }
      } else {
        let x = (daycount(e.enddate) / 451) * 255;
        pr1.style.color = `rgb(${x / 3},${x},${x / 3})`;
      }
    } else {
      if (sortChoice) {
        if (daycount(e.enddate) < 187) {
          pr1.style.color = colors.Dropped; //rgb(255,47,48)
        } else if (daycount(e.enddate) < 366) {
          pr1.style.color = colors.Sequel; // rgb(255,105,64)
        } else {
          pr1.style.color = colors["On-Hold"]; //rgb(241,200,62)
        }
      } else {
        let y = (daycount(e.enddate) / 451) * 255;
        pr1.style.color = `rgb(255,${y},20)`;
      }
    }
    pr1.lastChild.onclick = function () {
      e.rewatched++;
      rewaDict[e.title] = e.rewatched;
      localStorage.setItem("rewatched", JSON.stringify(rewaDict));
      testdisplay();
    };
    pr1.lastChild.oncontextmenu = function () {
      e.rewatched = 0;
      if (e.title in rewaDict) {
        delete rewaDict[e.title];
      }
      localStorage.setItem("rewatched", JSON.stringify(rewaDict));
      testdisplay();
    };
    insert(d, pr1);
  }
}
