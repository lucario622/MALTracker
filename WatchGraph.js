// var dayzero;
var fve;
var myArray;
var maxwatched = 0;
var offset1;
var offset2;
var longeststreak = ["", "", 0, 0, []];

function init() {
  generalinit();
}

function dte(e) {
  return e.startdate;
}

var comparison = compareWatchDate;

function start() {
  // curdate = "03-05-30";
  // curday = 3;
  // curmon = 05;
  // curyear = 30;
  makeDatas();
  data.sort(comparison);
  for (let i = 0; i < data.length; i++) {
    const e = data[i];
    if (dte(e) != "") {
      dayzero = daycount(dte(e));
      fve = e;
      break;
    }
  }
  console.log(dayzero);

  offset1 = dayOfWeek(dayzero);
  offset2 = dayOfWeek(0);

  console.log(
    "Current day (" +
      defaultdatetoreadable(curdate) +
      ") of week: " +
      daysOfWeek[offset2]
  );
  console.log(
    "First entry (" + fve.title + ") day of week: " + daysOfWeek[offset1]
  );
  myArray = [];
  for (let i = 0; i < dayzero + 1; i++) {
    myArray[i] = 0;
  }

  let maxlen = Math.floor((dayzero + offset1) / 7) + 1;
  console.log(maxlen);
  let mainTable = document.getElementById("maintable");
  for (let i = 0; i < maxlen; i++) {
    mainTable.innerHTML += "<tr style='height: 10px;' id='row" + i + "'></tr>";
  }

  for (let i = data.indexOf(fve); i < data.length; i++) {
    const e = data[i];
    let x = dayzero - daycount(dte(e));
    myArray[x]++;
    if (myArray[x] > maxwatched) maxwatched = myArray[x];
  }

  let curstreak = 0;
  let curcount = 0;
  let curStreakEntries = [];

  let n = 0;
  for (n = 0; n < myArray.length; n++) {
    let myDate = ndaysbefore(curdate, dayzero - n);
    if (myArray[n] > 0) {
      curstreak++;
      curcount += myArray[n];
      for (let j = data.indexOf(fve); j < data.length; j++) {
        const e = data[j];
        if (e.startdate == myDate) {
          curStreakEntries.push(e);
        }
      }
    } else {
      if (curstreak > longeststreak[2]) {
        longeststreak[4] = curStreakEntries;
        longeststreak[3] = curcount;
        longeststreak[2] = curstreak;
        longeststreak[1] = onedaybefore(myDate);
        longeststreak[0] = ndaysbefore(longeststreak[1], longeststreak[2] - 1);
      }
      curStreakEntries = [];
      curcount = 0;
      curstreak = 0;
    }
  }
  if (curstreak > longeststreak[2]) {
    longeststreak[4] = curStreakEntries;
    longeststreak[3] = curcount;
    longeststreak[2] = curstreak;
    longeststreak[1] = ndaysbefore(curdate, dayzero - n + 1);
    longeststreak[0] = ndaysbefore(longeststreak[1], longeststreak[2] - 1);
  }
  longeststreak[4].sort(compareWatchDate);

  let streakmins = 0;
  for (let e of longeststreak[4]) {
    streakmins += e.determineLen();
  }

  let pr = document.createElement("pre");
  pr.innerText = `Longest Streak: ${
    longeststreak[2]
  } days, from ${defaultdatetoreadable(
    longeststreak[0]
  )} to ${defaultdatetoreadable(longeststreak[1])} (${
    longeststreak[4].length
  } Entries / ${mns2dhm(streakmins)})`;
  pr.onclick = function () {
    localStorage.setItem("specialTransfer", JSON.stringify(longeststreak[4]));
    window.open("GroupDetails.html", "_blank").focus();
  };
  insert(document.getElementById("mainbody"), pr);

  for (let j = 0; j < dayzero + offset1 + 1; j++) {
    let i = j - offset1;
    let col = j % 7;
    let row = Math.floor(j / 7);
    let currow = document.getElementById("row" + row);
    let val = Math.ceil((myArray[i] / maxwatched) * 5);
    currow.innerHTML +=
      "<td title='" +
      (defaultdatetoreadable(ndaysafter(dte(fve), i)) +
        ", " +
        myArray[i] +
        " items watched") +
      "' style='width: 10px;height: 10px;color:white;' data-level=\"" +
      val +
      "\" class='ContributionCalendar-day'  >" +
      // parseInt(ndaysafter(dte(fve), i).substring(0, 2)) + // Uncomment this line to add day numbers to each box
      "</td>";
    let curbox = currow.childNodes[col];
    let teenystring = '"' + ndaysafter(dte(fve), i) + '"';
    if (val != 0 && !isNaN(val))
      curbox.setAttribute(
        "onclick",
        "localStorage.setItem('transfer'," +
          teenystring +
          ");window.open('Daytails.html','_blank').focus();"
      );
    if (i < 0) {
      curbox.setAttribute("data-level", -1);
    }
    if (
      parseInt(ndaysafter(dte(fve), i).substring(3, 5)) % 2 == 0 &&
      val == 0
    ) {
      curbox.setAttribute("data-level", -2);
    }

    if (j == dayzero + offset1) {
      // Last Box: add some number of null boxes to reach the end of the row
      for (let k = 0; k < 6 - offset2; k++) {
        currow.innerHTML +=
          "<td title='" +
          defaultdatetoreadable(ndaysafter(dte(fve), i + k + 1)) +
          "' style='width: 10px;height: 10px;' data-level=\"" +
          -1 +
          "\" class='ContributionCalendar-day' ></td>";
      }
    }

    let d = ndaysafter(dte(fve), i);
    if (
      col == 6 ||
      (j == dayzero + offset1 && parseInt(d.substring(0, 2)) < offset2 + 2)
    ) {
      if (
        parseInt(d.substring(3, 5)) == 1 &&
        parseInt(d.substring(0, 2)) <= 7
      ) {
        // add "Jan <year>" if the month is january
        let str = "<pre style='font-size:10px;color:white;'>Jan ";
        if (parseInt(d.substring(6)) < 50) str += "20";
        else str += "19";
        str += parseInt(d.substring(6)) + "</pre>";
        currow.innerHTML += str;
      } else if (parseInt(d.substring(0, 2)) <= 7) {
        // add "<month>" if on the first saturday of the month
        currow.innerHTML +=
          "<pre style='font-size:10px;color:white;'>" +
          mArr[parseInt(d.substring(3, 5)) - 1] +
          "</pre>";
      }
    }
  }
}
