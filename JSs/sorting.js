var arr = [];
var arrPieces = [[],[],[],[],[],[]];
var comparisonCount = 0;
var myVar = 0;
var sfwmode = false;
var binds;
var autoCount = 0;

function init() {
  generalinit();
}

function start() {
  binds = localStorage.getItem("binds");
  if (binds != null) {
    binds = JSON.parse(binds);
  }
  makeDatas();

  middlearray = data.toSorted(compareScores);
  arr = [];
  for (let i = 0; i < middlearray.length; i++) {
    if (middlearray[i].score > 0) {
      arr.push(middlearray[i]);
      arrPieces[middlearray[i].score-5].push(middlearray[i])
    }
  }
  console.log(arr);
  sortProcess();
}

async function sortProcess() {
  let n = arr.length;

  let gaps = [701, 301, 132, 57, 23, 10, 4, 1];

  for (let k = 0; k < gaps.length; k++) {
    let gap = gaps[k];
    for (let i = gap; i < n; i++) {
      let temp = arr[i];
      let j = i;

      while (j >= gap && (await manualCompare(arr[j - gap], temp))) {
        arr[j] = arr[j - gap];
        j -= gap;
      }

      arr[j] = temp;
    }
  }
  console.log(arr);
  console.log("Comparison count for 808 elements: " + comparisonCount);
  console.log("Divided by 808: ", comparisonCount / 808);
  console.log("logn = ", Math.log(808));
  console.log("log^2n = ", Math.log(808) ** 2);
  console.log("nlog^2n = ", 808 * Math.log(808) * Math.log(808));
  console.log("nlogn = ", 808 * Math.log(808));
  CS();
}

function manualCompare(e1, e2) {
  return new Promise((resolve) => {
    comparisonCount++;
    if (e1.score != e2.score) {
      autoCount++;
      resolve(e1.score > e2.score);
    } else {
      // add in some sort of "saving comparisons" code here maybe? although it should already be pretty optimal...
      display(e1, e2);
      document.getElementById("card1div").onclick = () => resolve(1);
      document.getElementById("card2div").onclick = () => resolve(0);
    }
  });
}

function display(e1, e2) {
  CS()
  covervar = fixbind(e1); // first object
  let c1 = document.getElementById("cover1"); // c1 & c2 is a img html element
  c1.src = "../images/covers/" + covervar;
  let t1 = document.getElementById("title1"); // t1 & t2 is p html element
  t1.innerText = e1.title;
  covervar = fixbind(e2); // second object
  let c2 = document.getElementById("cover2");
  c2.src = "../images/covers/" + covervar;
  let t2 = document.getElementById("title2");
  t2.innerText = e2.title;
}

function CS() {
  console.log(String(comparisonCount).padStart(4,'0')+"/"+String(autoCount).padStart(4,'0')+"/"+String(comparisonCount-autoCount).padStart(4,'0'))
}

// does it's best to find a cover filename based on the provided element object
function fixbind(e) {
  if (sfwmode) {
    return "../fallback.jpg";
  }
  let covervar = binds[e.title];
  if (covervar == undefined) {
    if (
      e.title.includes("'") ||
      e.title.includes("*") ||
      e.title.includes("II") ||
      e.title.includes(">>") ||
      e.title.includes(" - A Cruel F")
    ) {
      let temptitle = e.title;
      for (let i = 0; i < temptitle.length; i++) {
        if (temptitle[i] == "'") {
          temptitle =
            temptitle.substring(0, i) +
            String.fromCharCode(8217) +
            temptitle.substring(i + 1);
        } else if (temptitle[i] == "*") {
          temptitle =
            temptitle.substring(0, i) +
            String.fromCharCode(9733) +
            temptitle.substring(i + 1);
        } else if (
          i < temptitle.length - 1 &&
          temptitle[i] == "I" &&
          temptitle[i + 1] == "I"
        ) {
          temptitle =
            temptitle.substring(0, i) +
            String.fromCharCode(8545) +
            temptitle.substring(i + 2);
        } else if (
          i < temptitle.length - 1 &&
          temptitle[i] == "<" &&
          temptitle[i + 1] == "<"
        ) {
          temptitle =
            temptitle.substring(0, i) + "&lt;" + temptitle.substring(i + 2);
        } else if (
          i < temptitle.length - 1 &&
          temptitle[i] == ">" &&
          temptitle[i + 1] == ">"
        ) {
          temptitle =
            temptitle.substring(0, i) + "&gt;&gt;" + temptitle.substring(i + 2);
        } else if (
          i < temptitle.length - 1 &&
          temptitle[i] == " " &&
          temptitle[i + 1] == "-"
        ) {
          temptitle =
            temptitle.substring(0, i) + "  -" + temptitle.substring(i + 2);
          break;
        }
      }
      covervar = binds[temptitle];
    } else {
      covervar = "../fallback.jpg";
      console.log("vv covervar == undefined");
      console.log(e.title);
    }
  }
  return covervar;
}
