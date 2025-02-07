function start() {
  sortselector.hidden = false;
  chfilebutton.hidden = false;
  foldselector.hidden = false;
  inputfile.hidden = true;
  foldselector.innerHTML = "";
  sortselector.innerHTML = "";
  let arrr = parseAllText();
  let prevE = arrr[0];
  let onholding = false;
  for (let i = 0; i < arrr.length; i++) {
    const element = arrr[i];
    data.push(element);
    str1 = element.title.toLowerCase();
    str2 = prevE.title.toLowerCase();
    if (str1[0] == "[") {
      str1 = setCharAt(str1, 0, "zzz");
    }
    if (str2[0] == "[") {
      str2 = setCharAt(str2, 0, "zzz");
    }
    if (str1[0] < str2[0]) {
      if (prevE.status == "Completed") {
        onholding = true;
      } else if (prevE.status == "On-Hold") {
        onholding = false;
      }
    }
    if (onholding) {
      element.status = "On-Hold";
    }
    prevE = element;
  }
  rankAll();
  assembleGroups();

  let i = 1;
  arrr.forEach((element) => {
    element.ranking = i++;
  });
  data = [];

  headers.forEach((element) => {
    data.push([element, []]);
  });

  for (let i = 0; i < arrr.length; i++) {
    const element = arrr[i];
    data[17][1].push(element);
    if (element.status == "Completed") {
      data[0][1].push(element);
    }
    if (element.status == "Watching") {
      data[1][1].push(element);
    }
    if (element.status == "On-Hold") {
      data[2][1].push(element);
    }
    if (element.status == "Dropped") {
      data[3][1].push(element);
    }
    if (element.status == "Plan to Watch") {
      if (element.airStatus == "Aired") {
        if (isEntryNextWatch(element)) {
          data[4][1].push(element);
        } else {
          data[5][1].push(element);
        }
      }
    }
    if (element.airStatus == "Not Yet Aired") {
      data[12][1].push(element);
    }
    if (element.airStatus == "Airing") {
      data[13][1].push(element);
    }
    if (element.type == "Movie") {
      data[14][1].push(element);
    }
    if (element.type == "Special" || element.type == "TV Special") {
      data[15][1].push(element);
    }
    if (element.status == "Plan to Watch" && element.airStatus == "Aired") {
      if (element.episodes <= 3) {
      } else if (element.episodes <= 15) {
        data[6][1].push(element);
      } else if (element.episodes <= 27) {
        data[7][1].push(element);
      } else if (element.episodes <= 39) {
        data[8][1].push(element);
      } else if (element.episodes <= 51) {
        data[9][1].push(element);
      } else if (element.episodes <= 63) {
        data[10][1].push(element);
      } else if (element.episodes <= 75) {
        data[11][1].push(element);
      } else {
        data[16][1].push(element);
      }
    }
  }
  for (let i = 0; i < headers.length; i++) {
    const header = document.createElement("option");
    header.textContent = "[" + data[i][1].length + "]" + headers[i];
    header.innerHTML = "<b>[" + data[i][1].length + "]" + headers[i] + "</b>";
    if (data[i][1].length != 0) {
      foldselector.insertBefore(header, foldselector.childNodes[0]);
    }
  }
  foldselector.value = "[" + data[17][1].length + "]All";

  sortOptions.push("Long List");
  placeSortSelector();
  sortselector.value = "Long List";
  if (localStorage.getItem("transfer") == null) {
    localStorage.setItem("transfer", "");
  }
  let val = localStorage.getItem("transfer").split(chosenSep)[0];
  let val1 = localStorage.getItem("transfer").split(chosenSep)[1];
  if (
    val != undefined &&
    val1 != undefined &&
    val.substring(0, 3) == "by " &&
    val1.substring(0, 1) == "["
  ) {
    sortselector.value = val;
    localStorage.setItem(
      "transfer",
      "Long List" + chosenSep + "[" + data[17][1].length + "]All"
    );
    foldselector.value = val1;
  }
  display();
}

function init() {
  generalinit();

  foldselector.addEventListener("change", function () {
    let target = foldselector.value.substring(
      foldselector.value.indexOf("]") + 1
    );
    switch (target) {
      case "All":
        sortselector.value = "Long List";
        break;
      case "Completed":
        sortselector.value = "by Score";
        break;
      case "On-Hold":
      case "Dropped":
      case "Not Yet Aired":
      case "Airing":
      case "Movie":
      case "Special":
        sortselector.value = "by Title";
        break;
      case "Watching":
        sortselector.value = "by Episodes Watched";
        break;
      case "Plan to Watch":
        sortselector.value = "by Episode Count";
        break;
      default:
        sortselector.value = "by Episode Count";
        break;
    }
    display();
  });
}

function display() {
  target = foldselector.value.substring(foldselector.value.indexOf("]") + 1);
  let tempstr1 = "";
  let sorttarget = sortselector.value;
  d.innerHTML = "";
  p.style = "color:rgb(204,204,204);";

  switch (sorttarget) {
    case "by Title":
      data[headers.indexOf(target)][1].sort(compareTitles);
      break;
    case "by Score":
      data[headers.indexOf(target)][1].sort(compareTitles).reverse();
      data[headers.indexOf(target)][1].sort(compareScores).reverse();
      break;
    case "by MAL Score":
      data[headers.indexOf(target)][1].sort(compareMALScore).reverse();
      break;
    case "by Episode Count":
      data[headers.indexOf(target)][1].sort(compareEpisodes).reverse();
      break;
    case "by Episodes Watched":
      data[headers.indexOf(target)][1].sort(compareWEpisodes).reverse();
      break;
    case "Long List":
      data[headers.indexOf(target)][1].sort(compareMALScore).reverse();
      break;
    case "by Score Difference":
      data[headers.indexOf(target)][1].sort(compareDifference).reverse();
      break;
    case "by Air Date":
      data[headers.indexOf(target)][1].sort(compareAirStart).reverse();
      break;
    case "by Demographic":
      data[headers.indexOf(target)][1].sort(compareDemog).reverse();
      break;
    case "by Rating":
      data[headers.indexOf(target)][1].sort(compareRated);
      break;
    case "by Status":
      data[headers.indexOf(target)][1].sort(compareAirStatus);
      break;
    case "by Type":
      data[headers.indexOf(target)][1].sort(compareTypes);
      break;
    case "by Watch Date":
      data[headers.indexOf(target)][1].sort(compareWatchDate).reverse();
      break;
    case "by Run Length":
      data[headers.indexOf(target)][1].sort(compareRunLength).reverse();
      break;
    case "by Air Finish":
      data[headers.indexOf(target)][1].sort(compareAirFinish).reverse();
      break;
    case "by Pickup Time":
      data[headers.indexOf(target)][1].sort(comparePickupTime);
    default:
      break;
  }
  switch (sorttarget) {
    case "by Score":
      tempstr1 += "Score\tTitle\n";
      break;
    case "by MAL Score":
      tempstr1 += "Rating\tTitle\n";
      break;
    case "by Episode Count":
      tempstr1 += "Eps\tTitle\n";
      break;
    case "by Episodes Watched":
      tempstr1 += "Eps\tTitle\n";
      break;
    case "Long List":
      tempstr1 +=
        "Score\tType\t\tEps\tRating\tStatus\t\tWatch Date\tAir Date\tTitle\n";
      break;
    case "by Score Difference":
      tempstr1 += "Score\tRating\tDiff.\tTitle\n";
      break;
    case "by Air Date":
      tempstr1 += "Air Date\tTitle\n";
      break;
    case "by Demographic":
      tempstr1 += "Demog.\tTitle\n";
      break;
    case "by Rating":
      tempstr1 += "Rating\tTitle\n";
      break;
    case "by Status":
      tempstr1 += "Status\t\tTitle\n";
      break;
    case "by Type":
      tempstr1 += "Type\t\tTitle\n";
      break;
    case "by Run Length":
      tempstr1 += "Run\tTitle\n";
      break;
    case "by Air Finish":
      tempstr1 += "Air Finish\tTitle\n";
      break;
    case "by Pickup Time":
      tempstr1 += "Pickup\tTitle\n";
      break;
    default:
      break;
  }
  for (let i = 0; i < data[headers.indexOf(target)][1].length; i++) {
    const element = data[headers.indexOf(target)][1][i];
    const pr = document.createElement("pre");
    let tempstr = "";
    switch (sorttarget) {
      case "by Title":
        break;
      case "by Score":
        tempstr += element.score + "/10\t";
        break;
      case "by MAL Score":
        tempstr += element.MALscore + "\t";
        break;
      case "by Episode Count":
        tempstr += element.episodes + "\t";
        break;
      case "by Episodes Watched":
        tempstr += element.watchedepisodes + "\t";
        break;
      case "by Score Difference":
        tempstr +=
          element.score +
          "\t" +
          element.MALscore +
          "\t" +
          Math.floor((element.score - element.MALscore) * 100) / 100 +
          "\t";
        break;
      case "by Air Date":
        tempstr += defaultdatetoreadable(element.airstartdate) + "\t";
        if (element.airstartdate == "") {
          tempstr += "\t";
        }
        break;
      case "by Air Finish":
        tempstr += defaultdatetoreadable(element.airenddate) + "\t";
        if (element.airenddate == "") {
          tempstr += "\t";
        }
        break;
      case "by Demographic":
        tempstr += element.demog + "\t";
        break;
      case "by Rating":
        tempstr += element.rated + "\t";
        break;
      case "by Status":
        tempstr += element.airStatus;
        if (element.airStatus != "Not Yet Aired") {
          tempstr += "\t";
        }
        tempstr += "\t";
        break;
      case "by Type":
        tempstr += element.type;
        if (element.type != "TV Special") {
          tempstr += "\t";
        }
        tempstr += "\t";
        break;
      case "by Watch Date":
        tempstr += defaultdatetoreadable(element.startdate) + "\t";
        if (element.startdate == "") {
          tempstr += "\t";
        }
        break;
      case "by Run Length":
        a1code =
          parseInt(element.airstartdate.substring(6)) * 365 +
          parseInt(element.airstartdate.substring(3, 5)) * 30 +
          parseInt(element.airstartdate.substring(0, 2));
        a2code =
          parseInt(element.airenddate.substring(6)) * 365 +
          parseInt(element.airenddate.substring(3, 5)) * 30 +
          parseInt(element.airenddate.substring(0, 2));
        if (a1code < 15000) a1code += 36500;
        if (a2code < 15000) a2code += 36500;
        acode = a2code - a1code;
        if (isNaN(acode)) acode = 0;
        tempstr += acode + "\t";
        break;
      case "by Pickup Time":
        tempstr +=
          daycount(element.airenddate) - daycount(element.enddate) + "\t";
        break;
      case "Long List":
        tempstr += element.score + "/10\t" + element.type;
        if (element.type != "TV Special") {
          tempstr += "\t";
        }
        tempstr +=
          "\t" +
          element.episodes +
          "\t" +
          element.MALscore +
          "\t" +
          element.airStatus;
        if (element.airStatus != "Not Yet Aired") {
          tempstr += "\t";
        }
        tempstr += "\t" + defaultdatetoreadable(element.startdate) + "\t";
        if (element.startdate == "") {
          tempstr += "\t";
        }
        tempstr += defaultdatetoreadable(element.airstartdate) + "\t";
        if (element.airstartdate == "") {
          tempstr += "\t";
        }
        break;
      default:
        break;
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
        if (isEntryNextWatch(element)) {
          pr.style.color = colors["On-Hold"];
        } else {
          pr.style.color = colors.Sequel;
        }
        break;
      case "Dropped":
        pr.style.color = colors.Dropped;
        break;
      case "Plan to Watch":
        if (element.airStatus == "Aired") {
          if (isEntryNextWatch(element)) {
            pr.style.color = colors.Aired;
          } else {
            pr.style.color = colors.Sequel;
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
    if (sorttarget != "by Score Difference" || element.score != 0) {
      d.insertBefore(pr, d.childNodes[d.childNodes.length]);
    }
  }
  p.textContent = tempstr1;
}
