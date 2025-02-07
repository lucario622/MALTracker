var lineabove;
var linebelow;
var monthzero;
var rows = 273;
var neededrows = 0;
var tryagain = false;
var mytimeline;
var mult = 1;
var fve;
var prntcount = 1;

function init() {
  linebelow = document.getElementById("timelinebelow");
  lineabove = document.getElementById("timelineabove");
  generalinit();
}

function dte(e) {
  return e.airstartdate;
}

var timecomp = compareAirStart;

function moncount(e) {
  let maybe100 = 100;
  if (parseInt(dte(e).substring(6)) > 50) {
    maybe100 = 0;
  }
  let thismon =
    (100 + curyear - (maybe100 + parseInt(dte(e).substring(6)))) * 12 +
    (curmon - parseInt(dte(e).substring(3, 5)));
  return thismon;
}

class TimeLine {
  constructor(length) {
    this.length = length;
    this.entries = [];
    this.strings = ["", ""];
    for (let i = 0; i < rows; i++) {
      this.strings.push("");
    }
    for (let n = 0; n < this.strings.length; n++) {
      for (let i = 0; i < length * mult; i++) {
        this.strings[n] += " ";
      }
      this.strings[n] = setCharAt(this.strings[n], monthzero, "|");
    }
  }

  checkforspace(layer, index, n) {
    let m = 20;
    let result = true;
    for (let i = 0; i < n; i++) {
      if (
        this.strings[layer][index + i] != " " &&
        this.strings[layer][index + i] != "|"
      ) {
        result = false;
        break;
      }
    }
    return result;
  }

  decidelayer(str, x) {
    for (let i = this.strings.length - 1; i > 1; i--) {
      if (this.checkforspace(i, x, str.length + 1)) {
        // console.log(`Space for ${str} at ${x} on layer ${i}`);
        if (this.strings.length - i > neededrows)
          neededrows = this.strings.length - i;
        return i;
      }
    }
    // console.log(`No Space for ${str} on any layer at index ${x}`);
    neededrows+=1;
    tryagain = true;
    return -1;
  }

  toString() {
    return this.lines + "";
  }

  display() {
    for (let i = 0; i < this.strings.length; i++) {
      this.strings[i] = "";
    }
    countarray = [];
    for (let n = 0; n < this.strings.length; n++) {
      for (let i = 0; i < this.length * mult; i++) {
        this.strings[n] += " ";
      }
      this.strings[n] = setCharAt(this.strings[n], monthzero, "|");
    }
    for (let i = 0; i < this.entries.length; i++) {
      const e = this.entries[i];
      let thismon = moncount(e);
      let x = monthzero - thismon;
      // let thisstr = e.title.charAt(0);
      let thisstr = TOPBEND + e.title;
      let chosenlayer = this.decidelayer(thisstr, x);
      if (tryagain) {
        tryagain = false;
        return -1;
      }
      this.strings[chosenlayer] = rep(this.strings[chosenlayer], x, thisstr);
      if (isNaN(countarray[x])) countarray[x] = 0;
      countarray[x]++;
      for (let i = 2; i < chosenlayer; i++) {
        if (this.strings[i][x] == " ")
          this.strings[i] = setCharAt(this.strings[i], x, "|");
      }
    }
    this.print();
    if (neededrows < this.strings.length - 2) return 1;
    return 0;
  }

  print() {
    for (
      let i = 12 - parseInt(dte(fve).substring(3, 5));
      i < this.length * mult;
      i += 12
    ) {
      this.strings[0] = rep(
        this.strings[0],
        i,
        String(
          (i - 12 + parseInt(dte(fve).substring(3, 5))) / 12 +
            1 +
            yrtoyear(parseInt(dte(fve).substring(6)))
        )
      );
      if (this.strings[1][i] == " ")
        this.strings[1] = rep(this.strings[1], i, "|");
    }
    lineabove.innerText = "";
    let tstr = "";
    for (let i = this.strings.length - 1; i > 1; i--) {
      tstr += this.strings[i] + "\n";
      // console.log("Checkpoint 1." + (239 - i));
    }
    lineabove.innerText += tstr;
    // console.log("Checkpoint 2");
    linebelow.innerText = this.strings[1] + "\n" + this.strings[0];
  }

  addEntry(e) {
    if (dte(e) != "") {
      this.entries.push(e);
    }
  }

  resizeasneeded() {
    if (neededrows < this.strings.length - 2) {
      console.log("Shrinking time, down to " + neededrows);
      let newstrings = [this.strings[0], this.strings[1]];
      for (let i = 2; i < this.strings.length; i++) {
        const element = this.strings[i];
        let distftop = this.strings.length - i;
        if (distftop <= neededrows) {
          newstrings.push(element);
        }
      }
      this.strings = newstrings;
    } else if (neededrows > this.strings.length - 2) {
      console.log("Growing time, up to " + neededrows);
      let newstrings = [this.strings[0], this.strings[1]];
      for (let i = 2; i < neededrows + 2 - this.strings.length; i++) {
        newstrings.push("");
      }
      for (let i = 0; i < neededrows; i++) {
        newstrings.push(this.strings[i + neededrows + 2]);
      }
      this.strings = newstrings;
    }
  }
}

function start() {
  makeDatas();

  data.sort(compareAirStart);
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    if (dte(element) != "") {
      fve = data[i];
      monthzero = moncount(fve);
      break;
    }
  }

  let fthidx = 0;
  let fthe;

  for (let i = 0; i < data.length; i++) {
    const e = data[i];
    if (
      dte(e) != "" &&
      monthzero - moncount(e) + (e.title.length + 2) >= fthidx
    ) {
      fthidx = monthzero - moncount(e) + (e.title.length + 2);
      fthe = e;
    }
  }

  // console.log(fthidx);
  // console.log(fthe);
  // console.log("---");

  mytimeline = new TimeLine(fthidx);
  // console.log(mytimeline.strings[21].length);
  let myline = document.getElementById("line");
  let offset = 0;
  let i = 0;
  while (i + offset < data.length) {
    while (i + offset < data.length) {
      const element = data[i + offset];
      if (dte(element) != "") {
        mytimeline.addEntry(element);
        break;
      } else {
        offset++;
      }
    }
    i++;
  }
  // while (true) {
  //   if (mytimeline.display() != 0) {
  //     mytimeline.resizeasneeded();
  //   } else {
  //     break;
  //   }
  // }
  // let y = 0;
  // let strt = new Date().getTime();
  while (mytimeline.display() != 0) {
    // y++;
    // console.log(new Date().getTime() - strt);
    mytimeline.resizeasneeded();
    // strt = new Date().getTime()
  }
  myline.style = "width:" + fthidx + "ch;margin-left:0px;";
}
