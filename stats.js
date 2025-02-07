var cmplEps = 0;
var cmplTotal = 0;
var cmplLen = 0;
var dayssince = 0;
var statsList = [];
var totalCount = 0;
var rewatchCount = 0;

function init() {
  generalinit();
}

function start() {
  makeDatas();

  assembleGroups();

  data.sort(compareWatchDate);
  let statusCount = [0, 0, 0, 0, 0];
  for (let i = 0; i < data.length; i++) {
    statusCount[filtboxarray[2].indexOf(data[i].status)]++;
    totalCount++;
    if (data[i].rewatched) rewatchCount++;
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

  statsList.push([
    "Days since start",
    dayssince,
    (val) => {
      return (
        "Wait " + (val - dayssince) + " more day" + yns(val - dayssince) + "!"
      );
    },
  ]);
  statsList.push([
    "Total Entries Watched",
    cmplTotal,
    (val) => {
      return (
        "Watch " +
        (val - cmplTotal) +
        " more Entr" +
        ynes(val - cmplTotal) +
        "!"
      );
    },
  ]);
  statsList.push([
    "Total time spent watching",
    mns2dhm(cmplLen),
    (val) => {
      let inputElement = document.getElementById("Total time spent watching");
      if (isnumeric(inputElement.value)) {
        inputElement.value = mns2dhm(val);
      } else {
        // inputElement.value = inversemns2dhm(val);
        val = inversemns2dhm(val);
      }
      return "Watch " + mns2dhm(val - cmplLen) + " more!";
    },
  ]);
  statsList.push([
    "Daily Average",
    Math.floor((cmplTotal / dayssince) * 10000) / 10000,
    (val) => {
      return (
        "Watch " +
        Math.ceil(val * dayssince - cmplTotal) +
        " more Entr" +
        ynes(Math.ceil(val * dayssince - cmplTotal)) +
        " today"
      );
    },
  ]);
  statsList.push([
    "Daily Average Time",
    mns2dhm(cmplLen / dayssince),
    (val) => {
      let inputElement = document.getElementById("Daily Average Time");
      if (isnumeric(inputElement.value)) {
        inputElement.value = mns2dhm(val);
      } else {
        val = inversemns2dhm(val);
      }
      return "Watch " + mns2dhm(val * dayssince - cmplLen) + " more today!";
    },
  ]);
  statsList.push([
    "Percentage of time spent watching",
    Math.floor((cmplLen / (60 * 24 * dayssince)) * 100000) / 1000 + "%",
    (val) => {
      return (
        "Watch " +
        mns2dhm((val / 100) * (60 * 24 * dayssince) - cmplLen) +
        " more today"
      );
    },
  ]);
  statsList.push([
    "Watching",
    statusCount[1],
    (val) => {
      return (
        "Start watching " +
        (val - statusCount[1]) +
        " more Entr" +
        ynes(val - statusCount[1]) +
        "!"
      );
    },
  ]);
  statsList.push([
    "Completed",
    statusCount[0],
    (val) => {
      return (
        "Watch " +
        (val - statusCount[0]) +
        " more Entr" +
        ynes(val - statusCount[0]) +
        "!"
      );
    },
  ]);
  statsList.push([
    "On-Hold",
    statusCount[2],
    (val) => {
      return (
        "Add " +
        (val - statusCount[2]) +
        " more Entr" +
        ynes(val - statusCount[2]) +
        ' to "On-Hold"!'
      );
    },
  ]);
  statsList.push([
    "Dropped",
    statusCount[3],
    (val) => {
      return (
        "Drop " +
        (val - statusCount[3]) +
        " more Entr" +
        ynes(val - statusCount[3]) +
        "!"
      );
    },
  ]);
  statsList.push([
    "Plan to Watch",
    statusCount[4],
    (val) => {
      return (
        "Add " +
        (val - statusCount[4]) +
        " more Entr" +
        ynes(val - statusCount[4]) +
        ' to "Plan to Watch"!'
      );
    },
  ]);
  statsList.push([
    "Total Entries",
    totalCount,
    (val) => {
      return (
        "Add " +
        (val - totalCount) +
        " more Entr" +
        ynes(val - totalCount) +
        "!"
      );
    },
  ]);
  statsList.push([
    "Rewatched",
    rewatchCount,
    (val) => {
      return (
        "Rewatch " +
        (val - rewatchCount) +
        " more Entr" +
        ynes(val - rewatchCount) +
        "!"
      );
    },
  ]);
  statsList.push([
    "Episodes Completed",
    cmplEps,
    (val) => {
      return (
        "Watch " + (val - cmplEps) + " more Episode" + yns(val - cmplEps) + "!"
      );
    },
  ]);

  let maxChars = 0;
  let maxChars1 = 0;
  for (let stat of statsList) {
    let statLabel = stat[0];
    let charCount = statLabel.length;
    if (charCount > maxChars) {
      maxChars = charCount;
    }
    let statLabel1 = stat[1];
    let charCount1 = statLabel1.length;
    if (charCount1 > maxChars1) {
      maxChars1 = charCount1;
    }
  }
  let stab = Math.ceil((maxChars + 2) / 8);
  let stab1 = Math.ceil(maxChars1 / 8);
  for (let stat of statsList) {
    let pr = document.createElement("pre");
    pr.textContent = stat[0] + ": ";
    for (let i = 0; i < stab - Math.floor((stat[0].length + 2) / 8); i++) {
      pr.textContent += "\t";
    }
    pr.textContent += stat[1];
    for (let i = 0; i < stab1 - Math.floor((stat[1] + "").length / 8); i++) {
      pr.textContent += "\t";
    }
    let myDiv = document.createElement("div");
    let inp = document.createElement("input");
    // inp.type = "number";
    inp.id = stat[0];
    inp.onchange = () => {
      document.getElementById(stat[0] + "out").textContent = stat[2](
        document.getElementById(stat[0]).value
      );
    };
    let outputpre = document.createElement("pre");
    outputpre.textContent = "";
    outputpre.id = stat[0] + "out";
    myDiv.style.display = "flex";
    insert(d, myDiv);
    insert(myDiv, pr);
    insert(myDiv, inp);
    insert(myDiv, outputpre);
  }
}
