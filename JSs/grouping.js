function start() {
  sortselector.hidden = false;
  makeDatas();

  assembleGroups();

  sortOptions.push("by Group Size");
  sortOptions.push("by RemLen");
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
    default:
      break;
  }
  groups.forEach((element) => {
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
    element.entries.forEach((element1) => {
      let formedstr1 = "";
      let pr1 = document.createElement("pre");
      formedstr1 += element1.title;
      // for (let i = 0; i < 13 - element1.title.length / 8; i++) {
      //   formedstr1 += "\t";
      // }
      // formedstr1 +=
      //   " ||| " +
      //   element1.episodes +
      //   " ep " +
      //   element1.type +
      //   " Position: " +
      //   element1.position;
      pr1.innerHTML = "\t<b></b>";
      pr1.lastChild.innerText = formedstr1;
      pr1.childNodes[1].onclick = function () {
        localStorage.setItem("transfer", element1.title);
        window.open("Details.html", "_blank").focus();
      };
      switch (element1.status) {
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
          if (element1.airStatus == "Aired") {
            pr1.style.color = colors.Aired;
          } else if (element1.airStatus == "Not Yet Aired") {
            pr1.style.color = colors.NotAired;
          } else if (element1.airStatus == "Airing") {
            pr1.style.color = colors.Airing;
          }
          break;
        default:
          break;
      }
      d.insertBefore(pr1, d.childNodes[d.childNodes.length]);
    });
  });
}
