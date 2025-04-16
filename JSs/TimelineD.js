var lineabove;
var linebelow;
var dayzero;
var rows = 24;
var neededrows = 0;
var tryagain = false;
var mytimeline;
var fve;
var fthidx = 0;
var fthe;

function init() {
  linebelow = document.getElementById("timelinebelow");
  lineabove = document.getElementById("timelineabove");
  generalinit();
}

function dte(e) {
  return e.airstartdate;
}

var timecomp = compareAirStart;

class TimeLine {
  constructor(length) {
    this.length = length;
    this.entries = [];
    this.strings = ["", ""];
    for (let i = 0; i < rows; i++) {
      this.strings.push("");
    }
    for (let n = 0; n < this.strings.length; n++) {
      for (let i = 0; i < length; i++) {
        this.strings[n] += " ";
      }
      this.strings[n] = setCharAt(this.strings[n], dayzero, "|");
    }
  }

  checkforspace(layer, index, n) {
    let result = true;
    for (let i = 0; i < n; i++) {
      if (
        this.strings[layer][index + i] != " " &&
        this.strings[layer][index + i] != "|"
      ) {
        result = false;
      }
    }
    return result;
  }

  decidelayer(str, x) {
    for (let i = this.strings.length - 1; i > 1; i--) {
      if (this.checkforspace(i, x, str.length + 1)) {
        if (this.strings.length - i > neededrows)
          neededrows = this.strings.length - i;
        return i;
      }
    }
    neededrows++;
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
      for (let i = 0; i < this.length; i++) {
        this.strings[n] += " ";
      }
      this.strings[n] = setCharAt(this.strings[n], dayzero, "|");
    }
    for (let i = 0; i < this.entries.length; i++) {
      const e = this.entries[i];
      let thisday = daycount(dte(e));
      let x = dayzero - thisday;
      let thisstr = TOPBEND + e.title;
      let chosenlayer = this.decidelayer(thisstr, x);
      if (tryagain) {
        tryagain = false;
        return -1;
      }
      this.strings[chosenlayer] = rep(this.strings[chosenlayer], x, thisstr);
      if (isNaN(countarray[x])) countarray[x] = 0;
      countarray[x]++;
      this.strings[1] = setCharAt(this.strings[1], x, countarray[x]);
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
    let temp = 365 - parseInt(dte(fve).substring(0, 2));
    temp = 0;
    for (let i = 1; i < parseInt(dte(fve).substring(3, 5)); i++) {
      temp += mondays(i, parseInt(dte(fve).substring(6)));
    }
    temp += parseInt(dte(fve).substring(0, 2));
    let offset = 0;
    // for (let i = 0; i < this.length; i++) {
    //   let j = dayzero - i;
    //   let dat = ndaysbefore(curdate, j);
    //   if (dat.substring(0, 2) == "01" && dat.substring(3, 5) != "01") {
    //     let m = mArr[parseInt(dat.substring(3, 5)) - 1];
    //     this.strings[0] = rep(this.strings[0], i, m);
    //   }
    // }
    for (let i = 365 - temp; i < this.length; i += 365) {
      if (((i + temp) / 365 + 1) % 4 == 0) offset++;
      this.strings[0] = rep(
        this.strings[0],
        i + offset,
        String(
          Math.floor(
            (i + offset - 1 + parseInt(dte(fve).substring(3, 5))) / 365.24
          ) +
            1 +
            yrtoyear(parseInt(dte(fve).substring(6)))
        )
      );
      if (this.strings[1][i + offset] == " ")
        this.strings[1] = setCharAt(this.strings[1], i + offset, "|");
    }
    lineabove.innerText = "";
    let tstr = "";
    for (let i = this.strings.length - 1; i > 1; i--) {
      tstr += this.strings[i] + "\n";
    }
    lineabove.innerText += tstr;
    linebelow.innerText = this.strings[1] + "\n" + this.strings[0];
  }

  addEntry(e) {
    if (dte(e) != "") {
      this.entries.push(e);
    }
  }

  resizeasneeded() {
    if (neededrows < this.strings.length - 2) {
      console.log("Shrinking time, down to " + neededrows + "!");
      let newstrings = [this.strings[0], this.strings[1]];
      for (let i = 2; i < this.strings.length; i++) {
        const e = this.strings[i];
        let distftop = this.strings.length - i;
        if (distftop <= neededrows) {
          newstrings.push(e);
        }
      }
      this.strings = newstrings;
    } else if (neededrows > this.strings.length - 2) {
      console.log("Growing time, up to " + neededrows + "!");
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

  data.sort(timecomp);
  for (let i = 0; i < data.length; i++) {
    const e = data[i];
    if (dte(e) != "") {
      dayzero = daycount(dte(e));
      fve = e;
      break;
    }
  }

  for (let i = 0; i < data.length; i++) {
    const e = data[i];
    if (
      dte(e) != "" &&
      dayzero - daycount(dte(e)) + (e.title.length + 2) >= fthidx
    ) {
      fthidx = dayzero - daycount(dte(e)) + (e.title.length + 2);
      fthe = e;
    }
  }

  mytimeline = new TimeLine(fthidx);
  let myline = document.getElementById("line");
  let offset = 0;
  let i = 0;
  while (i + offset < data.length) {
    while (i + offset < data.length) {
      const e = data[i + offset];
      if (dte(e) != "") {
        mytimeline.addEntry(e);
        break;
      } else {
        offset++;
      }
    }
    i++;
  }
  while (true) {
    if (mytimeline.display() != 0) {
      mytimeline.resizeasneeded();
    } else {
      break;
    }
  }
  myline.style = "width:" + fthidx + "ch;margin-left:0px;";
}
