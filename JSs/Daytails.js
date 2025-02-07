var elementlist = [];
var baseformat;
var mainbd;

function init() {
  generalinit();
}

function start() {
  makeDatas();

  mainbd = document.getElementById("mainbody");
  baseformat = mainbd.childNodes[2];
  let allboxes = document.getElementsByClassName("information");

  mainbd.innerHTML = "";
  let myDate = localStorage.getItem("transfer");
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    if (element.startdate == myDate) elementlist.push(element);
  }

  data.sort(compareMALScore).reverse();
  elementlist.sort(compareAirStart);
  let lastscored = 0;
  for (let i = 0; i < data.length; i++) {
    const e = data[i];
    if (e.MALscore == 0) {
      lastscored = i - 1;
      break;
    }
  }
  let i = 0;
  for (let z = 0; z < elementlist.length; z++) {
    const curEntry = elementlist[z];
    console.log(curEntry);
    mainbd.innerHTML += baseformat.innerHTML;
    document.getElementsByClassName("f1-1")[z].innerText = curEntry.MALscore;
    allboxes[i++].innerText = curEntry.title;
    if (data.indexOf(curEntry) > lastscored) {
      allboxes[i++].innerText = "-";
    } else allboxes[i++].innerText = "Ranked #" + (data.indexOf(curEntry) + 1);
    allboxes[i++].innerText = curEntry.airStatus;
    allboxes[i++].innerText = curEntry.premiered;
    allboxes[i].innerText = defaultdatetoreadable(curEntry.airstartdate);
    if (curEntry.airstartdate != curEntry.airenddate)
      allboxes[i++].innerText +=
        " to " + defaultdatetoreadable(curEntry.airenddate);
    else i++;
    allboxes[i++].innerText = curEntry.type;
    allboxes[i++].innerText = curEntry.genres.join(", ");
    allboxes[i++].innerText = curEntry.studios.join(", ");
    allboxes[i++].innerText = curEntry.licensors.join(", ");
    allboxes[i++].innerText = curEntry.demog;
    allboxes[i++].innerText = curEntry.rated;

    allboxes[i++].innerText = curEntry.status;
    allboxes[i++].innerText = curEntry.score;
    allboxes[i++].innerText =
      curEntry.watchedepisodes + "/" + curEntry.episodes;
    allboxes[i].innerText = defaultdatetoreadable(curEntry.startdate);
    if (curEntry.startdate != curEntry.enddate)
      allboxes[i++].innerText +=
        " to " + defaultdatetoreadable(curEntry.enddate);
    else i++;
    // i++;
  }
}
