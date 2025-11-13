var checkboxbox;
var checkboxes;
var filtboxes;
var ranges;
var resultsholder;
var sliderSections;
var sliders;

function start() {
  sortselector.hidden = false;
  makeDatas();

  assembleGroups();
  for (let i = 0; i < 2; i++) {
    const element = sliderSections[0].getElementsByTagName("input")[i];
    element.addEventListener("change", function () {
      display();
    });
    element.oninput();
  }
  for (let i = 0; i < 2; i++) {
    const element = sliderSections[1].getElementsByTagName("input")[i];
    element.addEventListener("change", function () {
      display();
    });
    element.oninput();
  }
  for (let i = 0; i < 2; i++) {
    const element = sliderSections[2].getElementsByTagName("input")[i];
    element.setAttribute("max", maxWepisodes);
    element.value = maxWepisodes * i;
    element.addEventListener("change", function () {
      display();
    });
    element.oninput();
  }
  for (let i = 0; i < 2; i++) {
    const element = sliderSections[3].getElementsByTagName("input")[i];
    element.setAttribute("max", maxEpisodes);
    element.value = maxEpisodes * i;
    element.addEventListener("change", function () {
      display();
    });
    element.oninput();
  }
  let myinpfield = document.getElementById("searchinputfield");
  myinpfield.addEventListener("input", function () {
    display();
  });

  placeSortSelector();
  display();
}

function ts(cb) {
  if (cb.readOnly) cb.checked = cb.readOnly = false;
  else if (!cb.checked) cb.readOnly = cb.indeterminate = true;
}

function init() {
  // Initialize Sliders
  sliderSections = document.getElementsByClassName("range-slider");
  for (let x = 0; x < sliderSections.length; x++) {
    sliders = sliderSections[x].getElementsByTagName("input");
    for (let y = 0; y < sliders.length; y++) {
      if (sliders[y].type === "range") {
        sliders[y].oninput = getVals;
        // Manually trigger event first time to display values
        sliders[y].oninput();
      }
    }
  }
  checkboxes = [
    document.getElementById("score"),
    document.getElementById("rating"),
    document.getElementById("type"),
    document.getElementById("wepisodes"),
    document.getElementById("episodes"),
    document.getElementById("status"),
    document.getElementById("sdifference"),
    document.getElementById("Watch Date"),
    document.getElementById("Air Date"),
    document.getElementById("Air Finish"),
    document.getElementById("Rating"),
    document.getElementById("Demographic"),
    document.getElementById("Genres"),
    document.getElementById("Studios"),
    document.getElementById("Licensors"),
    document.getElementById("Pickup"),
  ];
  filtboxes = [];
  // ranges = [
  //   document.getElementById("Watched Episodes"),
  //   document.getElementById("Episodes"),
  //   document.getElementById("MAL Score"),
  // ];

  placeFiltBoxes();

  filtboxarray.flat().forEach((element) => {
    filtboxes.push(document.getElementById(element));
  });
  resultsholder = document.getElementById("resultsholder");
  generalinit();
  hidecols();
  hidefilt();
  hiderange();

  document.getElementById("all").addEventListener("change", function () {
    for (let i = 0; i < checkboxes.length; i++) {
      const element = checkboxes[i];
      element.checked = document.getElementById("all").checked;
    }
    display();
  });
  for (let i = 0; i < checkboxes.length; i++) {
    const element = checkboxes[i];
    element.addEventListener("change", function () {
      display();
    });
  }
  for (let i = 0; i < filtboxes.length; i++) {
    const element = filtboxes[i];
    element.addEventListener("change", function () {
      display();
    });
  }
  // for (let i = 0; i < ranges.length; i++) {
  //   const element = ranges[i];
  //   element.addEventListener("change", function () {
  //     display();
  //   });
  // }
}

function hidecols() {
  document.getElementById("colbox").hidden = true;
  document.getElementById("colhider").innerText = "show";
}

var colsshown = false;
function showcols() {
  document.getElementById("colbox").hidden = false;
  document.getElementById("colhider").innerText = "hide";
}

function togglecols() {
  if (colsshown) {
    hidecols();
  } else {
    showcols();
  }
  colsshown = !colsshown;
}

function hiderange() {
  document.getElementById("rangebox").hidden = true;
  document.getElementById("rangehider").innerText = "show";
}

var rangeshown = false;
function showrange() {
  document.getElementById("rangebox").hidden = false;
  document.getElementById("rangehider").innerText = "hide";
}

function togglerange() {
  if (rangeshown) {
    hiderange();
  } else {
    showrange();
  }
  rangeshown = !rangeshown;
}

function hidefilt() {
  document.getElementById("filtbox").childNodes.forEach((element) => {
    element.hidden = true;
  });
  document.getElementById("filthider").innerText = "show";
}

var filtshown = false;
function showfilt() {
  document.getElementById("filtbox").childNodes.forEach((element) => {
    element.hidden = false;
  });
  document.getElementById("filthider").innerText = "hide";
}

function togglefilt() {
  if (filtshown) {
    hidefilt();
  } else {
    showfilt();
  }
  filtshown = !filtshown;
}

function display() {
  resultsholder.style = "color:rgb(204,204,204);";
  let tempstr1 = "";
  let sorttarget = sortselector.value;
  d.innerHTML = "";
  p.style = "color:rgb(204,204,204);";

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
  if (checkboxes[0].checked) {
    tempstr1 += "Score\t";
  }
  if (checkboxes[1].checked) {
    tempstr1 += "Rating\t";
  }
  if (checkboxes[2].checked) {
    tempstr1 += "Type\t\t";
  }
  if (checkboxes[3].checked) {
    tempstr1 += "W.Eps\t";
  }
  if (checkboxes[4].checked) {
    tempstr1 += "Eps\t";
  }
  if (checkboxes[5].checked) {
    tempstr1 += "Status\t\t";
  }
  if (checkboxes[6].checked) {
    tempstr1 += "Diff.\t";
  }
  if (checkboxes[7].checked) {
    tempstr1 += "Watch Date\t";
  }
  if (checkboxes[8].checked) {
    tempstr1 += "Air Date\t";
  }
  if (checkboxes[9].checked) {
    tempstr1 += "Air Finish\t";
  }
  if (checkboxes[10].checked) {
    tempstr1 += "Rated\t";
  }
  if (checkboxes[11].checked) {
    tempstr1 += "Demog.\t";
    for (let i = 0; i < Math.ceil(longestdemog / 8) - 1; i++) {
      tempstr1 += "\t";
    }
  }
  if (checkboxes[12].checked) {
    tempstr1 += "Genres\t";
    for (let i = 0; i < Math.ceil(longestgenres / 8) - 1; i++) {
      tempstr1 += "\t";
    }
  }
  if (checkboxes[13].checked) {
    tempstr1 += "Studios\t";
    for (let i = 0; i < Math.ceil(longeststudios / 8) - 1; i++) {
      tempstr1 += "\t";
    }
  }
  if (checkboxes[14].checked) {
    tempstr1 += "Licensors";
    for (let i = 0; i < Math.ceil(longestlicensors / 8) - 1; i++) {
      tempstr1 += "\t";
    }
  }
  if (checkboxes[15].checked) {
    tempstr1 += "Pickup\t";
  }
  tempstr1 += "Title";
  let count = 0;
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    const pr = document.createElement("pre");
    let tempstr = "";
    if (checkboxes[0].checked) {
      tempstr += element.score + "/10\t";
    }
    if (checkboxes[1].checked) {
      tempstr += element.MALscore + "\t";
    }
    if (checkboxes[2].checked) {
      tempstr += element.type + "\t";
      if (element.type != "TV Special") {
        tempstr += "\t";
      }
    }
    if (checkboxes[3].checked) {
      tempstr += element.watchedepisodes + "\t";
    }
    if (checkboxes[4].checked) {
      tempstr += element.episodes + "\t";
    }
    if (checkboxes[5].checked) {
      tempstr += element.airStatus + "\t";
      if (element.airStatus != "Not Yet Aired") {
        tempstr += "\t";
      }
    }
    if (checkboxes[6].checked) {
      tempstr +=
        Math.floor((element.score - element.MALscore) * 100) / 100 + "\t";
    }
    if (checkboxes[7].checked) {
      tempstr += defaultdatetoreadable(element.startdate) + "\t";
      if (element.startdate == "") {
        tempstr += "\t";
      }
    }
    if (checkboxes[8].checked) {
      tempstr += defaultdatetoreadable(element.airstartdate) + "\t";
      if (element.airstartdate == "") {
        tempstr += "\t";
      }
    }
    if (checkboxes[9].checked) {
      tempstr += defaultdatetoreadable(element.airenddate) + "\t";
      if (element.airenddate == "") {
        tempstr += "\t";
      }
    }
    if (checkboxes[10].checked) {
      tempstr += element.rated + "\t";
    }
    if (checkboxes[11].checked) {
      let demogstring = element.demog.join(", ");
      tempstr += demogstring;
      for (
        let i = 0;
        i < Math.ceil(longestdemog / 8) - Math.floor(demogstring.length / 8);
        i++
      ) {
        tempstr += "\t";
      }
    }
    if (checkboxes[12].checked) {
      let genrstring = element.genres.join(", ");
      tempstr += genrstring;
      for (
        let i = 0;
        i < Math.ceil(longestgenres / 8) - Math.floor(genrstring.length / 8);
        i++
      ) {
        tempstr += "\t";
      }
    }
    if (checkboxes[13].checked) {
      let studiostring = element.studios.join(", ");
      tempstr += studiostring;
      for (
        let i = 0;
        i < Math.ceil(longeststudios / 8) - Math.floor(studiostring.length / 8);
        i++
      ) {
        tempstr += "\t";
      }
    }
    if (checkboxes[14].checked) {
      let licensorstring = element.licensors.join(", ");
      tempstr += licensorstring;
      for (
        let i = 0;
        i <
        Math.ceil(longestlicensors / 8) - Math.floor(licensorstring.length / 8);
        i++
      ) {
        tempstr += "\t";
      }
    }
    if (checkboxes[15].checked) {
      tempstr +=
        daycount(element.airenddate) - daycount(element.enddate) + "\t";
    }
    tempstr += element.title;
    pr.innerHTML = "<b>" + tempstr + "</b>";
    pr.childNodes[0].innerText = tempstr;
    pr.childNodes[0].onclick = function () {
      localStorage.setItem("transfer", element.title);
      window.open("Details.html", "_blank").focus();
    };
    switch (element.status) {
      case "Completed":
        pr.style.color = colors.Completed;
        break;
      case "Watching":
        pr.style.color = colors.Watching;
        break;
      case "On-Hold":
        if (!isEntryNextWatch(element)) {
          pr.style.color = colors.Sequel;
        } else {
          pr.style.color = colors["On-Hold"];
        }
        break;
      case "Dropped":
        pr.style.color = colors.Dropped;
        break;
      case "Plan to Watch":
        if (element.airStatus == "Aired") {
          if (!isEntryNextWatch(element)) {
            pr.style.color = colors.Sequel;
          } else {
            pr.style.color = colors.Aired;
          }
        } else if (element.airStatus == "Not Yet Aired") {
          pr.style.color = colors.NotAired;
        } else if (element.airStatus == "Airing") {
          pr.style.color = colors.Airing;
        }
        break;
      default:
        break;
    }
    if (passfail(element)) {
      count += 1;
      d.insertBefore(pr, d.childNodes[d.childNodes.length]);
    }
  }
  resultsholder.textContent = count + " Result";
  if (count != 1) {
    resultsholder.textContent += "s";
  }
  p.textContent = tempstr1;
}

function allfiltempty() {
  let pass = true;
  filtboxes.forEach((element) => {
    if (element.checked || element.readOnly) {
      pass = false;
    }
  });
  return pass;
}

function alltypeempty() {
  let pass = true;
  for (let i = 0; i < sublen2d(1); i++) {
    const element = filtboxes[i];
    if (element.checked) pass = false;
  }
  return pass;
}

function allairempty() {
  let pass = true;
  for (let i = sublen2d(1); i < sublen2d(2); i++) {
    const element = filtboxes[i];
    if (element.checked) pass = false;
  }
  return pass;
}

function allgroupempty() {
  let pass = true;
  for (let i = sublen2d(2); i < sublen2d(3); i++) {
    const element = filtboxes[i];
    if (element.checked) pass = false;
  }
  return pass;
}

function allratedempty() {
  let pass = true;
  for (let i = sublen2d(3); i < sublen2d(4); i++) {
    const element = filtboxes[i];
    if (element.checked) pass = false;
  }
  return pass;
}

function alldemogempty() {
  let pass = true;
  for (let i = sublen2d(4); i < sublen2d(5); i++) {
    const element = filtboxes[i];
    if (element.checked) pass = false;
  }
  return pass;
}

function allgenreempty() {
  let pass = true;
  for (let i = sublen2d(5); i < sublen2d(6); i++) {
    const element = filtboxes[i];
    if (element.checked || element.readOnly) pass = false;
  }
  return pass;
}

function sublen2d(n, e = filtboxarray) {
  let total = 0;
  for (let i = 0; i < n; i++) {
    const element = e[i];
    total += element.length;
  }
  return total;
}

function certaincondition(n, i, e) {
  switch (n) {
    case 1:
      return e.type == filtboxarray.flat()[i];
    case 2:
      return e.airStatus == filtboxarray.flat()[i];
    case 3:
      return e.status == filtboxarray.flat()[i];
    case 4:
      return e.rated == filtboxarray.flat()[i];
    case 5:
      return e.demog.includes(filtboxarray.flat()[i]);
    case 6:
      return !e.genres.includes(filtboxarray.flat()[i]);
  }
}

function passfail(element) {
  if (
    allfiltempty() &&
    element.MALscore >= rangevalues["MALSCORE"][0] &&
    element.MALscore <= rangevalues["MALSCORE"][1] &&
    element.score >= rangevalues["SCORE"][0] &&
    element.score <= rangevalues["SCORE"][1] &&
    element.watchedepisodes >= rangevalues["WEPISODES"][0] &&
    element.watchedepisodes <= rangevalues["WEPISODES"][1] &&
    element.episodes >= rangevalues["EPISODES"][0] &&
    element.episodes <= rangevalues["EPISODES"][1] &&
    document.getElementById("searchinputfield").value == ""
  ) {
    return true;
  }

  let allempty = [
    allfiltempty,
    alltypeempty,
    allairempty,
    allgroupempty,
    allratedempty,
    alldemogempty,
    allgenreempty,
  ];
  let pass = [];
  pass[0] = true;
  pass[1] = false; // type
  pass[2] = false; // air status
  pass[3] = false; // status
  pass[4] = false; // rated
  pass[5] = false; // demographic
  pass[6] = true; // genre

  let k = 0;
  for (let i = 0; i < filtboxarray.length; i++) {
    for (let j = 0; j < filtboxarray[i].length; j++) {
      if (
        filtboxes[k].readOnly &&
        element.genres.includes(filtboxarray.flat()[k])
      ) {
        console.log("Announce this")
        pass[i + 1] = false;
      } else if (filtboxes[k].checked && certaincondition(i + 1, k, element)) {
        pass[i + 1] = true;
        if (i == 5) pass[i + 1] = false;
      }
      k++;
    }
  }

  for (let i = 1; i < allempty.length; i++) {
    if (allempty[i]()) pass[i] = true;
  }
  for (let i = 1; i < pass.length; i++) {
    pass[0] = pass[0] && pass[i];
  }
  searchbox = document.getElementById("searchinputfield");
  if (searchbox.value != "") {
    pass[0] =
      pass[0] &&
      element.title.toLowerCase().includes(searchbox.value.toLowerCase());
  }
  if (
    pass[0] &&
    element.MALscore >= rangevalues["MALSCORE"][0] &&
    element.MALscore <= rangevalues["MALSCORE"][1] &&
    element.score >= rangevalues["SCORE"][0] &&
    element.score <= rangevalues["SCORE"][1] &&
    element.watchedepisodes >= rangevalues["WEPISODES"][0] &&
    element.watchedepisodes <= rangevalues["WEPISODES"][1] &&
    element.episodes >= rangevalues["EPISODES"][0] &&
    element.episodes <= rangevalues["EPISODES"][1]
  ) {
    return true;
  }
  // console.log(pass);
  return false;
}
