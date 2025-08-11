function start() {
  sortselector.hidden = false;
  makeDatas();

  assembleGroups();

  sortOptions.push("by Group Size");
  sortOptions.push("by RemLen");
  sortOptions.push("by Length");
  placeSortSelector();
  sortselector.value = "by Status";
  let val = localStorage.getItem("transfer");
  if (val.substring(0, 3) == "by ") {
    sortselector.value = val;
    localStorage.setItem("transfer", "by Group Size");
  }
  display();
}

function init() {
  generalinit();
}

function display() {
  localStorage.setItem("transfer", sortselector.value);
  d.innerHTML = "";
  sorttarget = sortselector.value;
  p.style = "color:rgb(204,204,204);";
  groups.sort(compareGroupNames);
  groups.sort(compareGroupRating);
  switch (sorttarget) {
    case "by Title":
      groups.sort(compareGroupNames);
      break;
    case "by Score":
      groups.sort(compareGroupScore).reverse();
      break;
    case "by MAL Score":
      groups.sort(compareGroupRating).reverse();
      break;
    case "by Episode Count":
      groups.sort(compareGroupEpisodes).reverse();
      break;
    case "by Episodes Watched":
      groups.sort(compareGroupWatchedEpisodes).reverse();
      break;
    case "by Group Size":
      groups.sort(compareGroupSize).reverse();
      break;
    case "by Score Difference":
      groups.sort(compareGroupDifference).reverse();
      break;
    case "by Air Date":
      groups.sort(compareGroupAirDate).reverse();
      break;
    case "by Demographic":
      groups.sort(compareGroupDemographic);
      break;
    case "by Rating":
      groups.sort(compareGroupRated);
      break;
    case "by Status":
      groups.sort(compareGroupRating).reverse();
      groups.sort(compareGroupTimeCom);
      groups.sort(compareGroupStatus);
      break;
    case "by Type":
      groups.sort(compareGroupType);
      break;
    case "by Watch Date":
      groups.sort(compareGroupSize);
      groups.sort(compareGroupWatchDate).reverse();
      break;
    case "by Run Length":
      groups.sort(compareGroupRunLength).reverse();
      break;
    case "by Air Finish":
      groups.sort(compareGroupAirFinish).reverse();
      break;
    case "by RemLen":
      groups.sort(compareGroupTimeCom);
      break;
    case "by Length":
      groups.sort(compareGroupTotalLength).reverse();
      break;
    case "by Pickup Time":
      groups.sort(compareGroupPickup);
      break;
    case "by Title Length":
      groups.sort(compareGroupTLength);
      break;
    default:
      break;
  }
  // groups.forEach((element) => {
  for (let var1 = 0; var1 < groups.length; var1++) {
    const element = groups[var1];
    let formedstr = "";
    let pr = document.createElement("pre");
    formedstr += element.groupName;
    formedstr += "\n" + element.details();
    pr.innerHTML = "<b></b>";
    pr.lastChild.innerText = formedstr;
    //  onclick='testfunction(\""+element.groupName+"\")'
    pr.style.color = colors.Aired;
    pr.childNodes[0].onclick = function () {
      localStorage.setItem("specialTransfer", JSON.stringify(element.entries));
      window.open("GroupDetails.html", "_blank").focus();
    };
    d.insertBefore(pr, d.childNodes[d.childNodes.length]);
    let ongoing = [];
    let prestring = [];
    for (let i = daycount(element.entries[0].airstartdate); i >= 0; i--) {
      for (let j = 0; j < element.entries.length; j++) {
        const curent = element.entries[j];
        if (daycount(curent.airstartdate) == i) {
          ongoing.push(curent);
        }
      }
      let replaceongoing = [];
      for (let j = 0; j < ongoing.length; j++) {
        const curent = ongoing[j];
        if ((daycount(curent.airstartdate) - i) % 7 == 0) {
          let theep = Math.floor((daycount(curent.airstartdate) - i) / 7) + 1;
          if (daycount(curent.airstartdate) == daycount(curent.airenddate) || curent.type != "TV") {
            prestring.push([curent, theep, curent.episodes]);
          } else {
            prestring.push([curent, theep, theep]);
          }
        }
        if (daycount(curent.airenddate) != i && curent.type == "TV") {
          replaceongoing.push(curent);
        }
      }
      ongoing = replaceongoing;
    }
    let newprestring = [];
    let newerprestring = [];
    let prevelem = prestring[0];
    prestring.forEach((elementy) => {
      if (elementy[0].episodes >= elementy[2]) {
        newprestring.push(elementy);
      }
      prevelem = elementy;
    });
    prevelem = newprestring[0]
    newprestring.forEach((elementy) => {
      if (elementy[0].episodes >= elementy[2]) {
        if (prevelem != elementy) {
          if (prevelem[0] != elementy[0]) {
            newerprestring.push(elementy);
          } else {
            newerprestring[newerprestring.length - 1][2]++;
          }
        } else {
          newerprestring.push(elementy);
        }
      }
      prevelem = elementy;
    });
    newerprestring.forEach((elementx) => {
      let formedstr1 = "";
      let pr1 = document.createElement("pre");
      if (elementx[0].episodes <= elementx[2] && elementx[1] == 1) {
        formedstr1 += elementx[0].title;
      } else if (elementx[1] == elementx[2]) {
        formedstr1 += elementx[0].title + " " + elementx[1];
      } else {
        formedstr1 += elementx[0].title + " " + elementx[1] + "-" + elementx[2];
      }
      pr1.innerHTML = "\t<b></b>";
      pr1.lastChild.innerText = formedstr1;
      pr1.childNodes[1].onclick = function () {
        localStorage.setItem("transfer", elementx[0].title);
        window.open("Details.html", "_blank").focus();
      };
      switch (elementx[0].status) {
        case "Completed":
          pr1.style.color = colors.Completed;
          break;
        case "Watching":
          pr1.style.color = colors.Watching;
          break;
        case "On-Hold":
          pr1.style.color = colors["On-Hold"];
          break;
        case "Dropped":
          pr1.style.color = colors.Dropped;
          break;
        case "Plan to Watch":
          if (elementx[0].airStatus == "Aired") {
            pr1.style.color = colors.Aired;
          } else if (elementx[0].airStatus == "Not Yet Aired") {
            pr1.style.color = colors.NotAired;
          } else if (elementx[0].airStatus == "Airing") {
            pr1.style.color = colors.Airing;
          }
          break;
        default:
          break;
      }
      d.insertBefore(pr1, d.childNodes[d.childNodes.length]);
    });
    // break;
  } //);
}

function isboverlapa(a, b) {
  let a1 = daycount(a.airstartdate);
  let a2 = daycount(a.airenddate);
  let b1 = daycount(b.airstartdate);
  let b2 = daycount(b.airenddate);
  if ((b1 < a1 && b1 > a2) || (a1 < b1 && a1 > b2)) {
    return true;
  } else {
    return false;
  }
}
