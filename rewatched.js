var rewaDict = {};

function init() {
  generalinit();
}

var n = 1;

function start() {
  makeDatas();

  assembleGroups();

  data.forEach((e) => {
    if (e.rewatched == true) {
      rewaDict[e.title] = true;
    } else {
      rewaDict[e.title] = false;
    }
  });

  console.log(rewaDict);

  testdisplay();
}

function testdisplay() {
  erasePD();
  data.sort(compareTitles);
  data.sort(compareScores).reverse();
  data.sort(compareRewatched);
  let pr = document.createElement("pre");
  pr.innerHTML = "<b>Watched\tScore\tTitle<b>";
  pr.style.color = colors.Aired;
  insert(d, pr);
  for (let i = 0; i < data.length; i++) {
    const e = data[i];
    if (e.status != "Completed") {
      continue;
    }
    let pr1 = document.createElement("pre");
    pr1.innerHTML =
      "<b>" +
      ds2ymd(daycount(e.startdate)) +
      "\t" +
      e.score +
      "\t" +
      e.title +
      "</b>";
    switch (e.rewatched) {
      case true:
        if (daycount(e.startdate) < 187) {
          pr1.style.color = "rgb(27, 102, 33)";
        } else if (daycount(e.startdate) < 366) {
          pr1.style.color = colors.Watching; //rgb(45,176,57)
        } else {
          pr1.style.color = "rgb(66, 255, 82)";
        }
        break;
      case false:
        if (daycount(e.startdate) < 187) {
          pr1.style.color = colors.Dropped;
        } else if (daycount(e.startdate) < 366) {
          pr1.style.color = colors.Sequel;
        } else {
          pr1.style.color = colors["On-Hold"];
        }
        break;
      default:
        pr1.style.color = color.NotAired;
        break;
    }
    pr1.lastChild.onclick = function () {
      e.rewatched = !e.rewatched;
      if (e.rewatched) {
        rewaDict[e.title] = true;
      } else {
        rewaDict[e.title] = false;
      }
      localStorage.setItem("rewatched", JSON.stringify(rewaDict));
      testdisplay();
    };
    insert(d, pr1);
  }
}

function compareScoreDensity(a, b) {
  let aa = Math.pow(a.MALscore, n) / a.episodes;
  let bb = Math.pow(b.MALscore, n) / b.episodes;
  if (a.airStatus != "Aired") aa = 0;
  if (b.airStatus != "Aired") bb = 0;
  if (aa > bb) {
    return 1;
  }
  if (aa < bb) {
    return -1;
  }
  return 0;
}
