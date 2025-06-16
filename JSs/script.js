var rawfiledata;
var sortselector;
var chfilebutton;
var foldselector;
var inputfile;
var p;
var d;
var data = [];
var longestgenres = 0;
var longestdemog = 0;
var longeststudios = 0;
var longestlicensors = 0;
var maxWepisodes = 0;
var maxEpisodes = 0;
var rangevalues = {};
var countarray = [];
var maxwatched = 0;
var fve;
var myArray;
var myArraysplit;
var dayzero;
const avgTV = 20;
const avgMovie = 100;
const avgTVSP = 40;
const avgSP = 20;
const avgONA = 20;
const avgOVA = 20;
var chosenSep = "&!";
const TOPBEND = String.fromCharCode(9484);
const rn = new Date(Date.now());
var curyear = rn.getFullYear() % 100;
var curmon = rn.getMonth() + 1;
var curday = rn.getDate();
if (curyear == 0) {
  curyear = "00";
} else if (curyear < 10) {
  curyear = "0" + curyear;
} else curyear = "" + curyear;

if (curmon == 0) {
  curmon = "00";
} else if (curmon < 10) {
  curmon = "0" + curmon;
} else curmon = "" + curmon;

if (curday == 0) {
  curday = "00";
} else if (curday < 10) {
  curday = "0" + curday;
} else curday = "" + curday;

var curdate = `${curday}-${curmon}-${curyear}`;
curday = parseInt(curday);
curmon = parseInt(curmon);
curyear = parseInt(curyear);
var daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const headers = [
  "Completed",
  "Watching",
  "On-Hold",
  "Dropped",
  "Plan to Watch",
  "Sequels",
  "12ep",
  "24ep",
  "36ep",
  "48ep",
  "60ep",
  "72ep",
  "Not Yet Aired",
  "Airing",
  "Movie",
  "Special",
  "76+ep(>12hrs)",
  "All",
];
const mArr = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const sortOptions = [
  "by Title",
  "by Score",
  "by MAL Score",
  "by Episode Count",
  "by Episodes Watched",
  "by Score Difference",
  "by Air Date",
  "by Type",
  "by Status",
  "by Watch Date",
  "by Demographic",
  "by Rating",
  "by Run Length",
  "by Air Finish",
  "by Pickup Time",
  "by Title Length",
];
var filtboxarray = [
  ["TV", "ONA", "OVA", "Movie", "Special", "TV Special", "Unknown"],
  ["Aired", "Airing", "Not Yet Aired"],
  ["Completed", "Watching", "On-Hold", "Dropped", "Plan to Watch"],
  ["G", "PG", "PG-13", "R", "R+", "Rx"],
  ["Shounen", "Seinen", "Shoujo", "Josei"],
  [
    "Action",
    "Adventure",
    "Avant Garde",
    "Award Winning",
    "Boys Love",
    "Comedy",
    "Drama",
    "Ecchi",
    "Erotica",
    "Fantasy",
    "Girls Love",
    "Gourmet",
    "Hentai",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Slice of Life",
    "Sports",
    "Supernatural",
    "Suspense",
  ],
];
var nicknames = {
  "Is It Wrong to Try to Pick Up Girls in a Dungeon?":"DanMachi",
  "Re:ZERO -Starting Life in Another World-":"Re:ZERO",
  "That Time I Got Reincarnated as a Slime":"TenSura",
  "The Irregular at Magic High School":"Mahouka",
}
var groups = [];
var colors = {
  Watching: "rgb(45,176,57)",
  Completed: "rgb(0,128,255)",
  "On-Hold": "rgb(241,200,62)",
  Dropped: "rgb(255,47,48)",
  Aired: "rgb(195,195,195)",
  Airing: "rgb(145,145,145)",
  NotAired: "rgb(95,95,95)",
  Sequel: "rgb(255,105,64)",
};

class EntryGroup {
  mainEntry = new Entry();
  avgScore = 0.0;
  avgRating = 0.0;
  totalEpisodes = 0;
  watchedEpisodes = 0;
  entries = [];
  groupName = "";
  size = 0;
  remLen = 0;

  curStatus = "";

  constructor() {
    this.mainEntry = new Entry();
    this.avgScore = 0.0;
    this.avgRating = 0.0;
    this.totalEpisodes = 0;
    this.watchedEpisodes = 0;
    this.entries = [];
    this.groupName = "";
    this.size = 0;
    this.curStatus = "";
    this.remLen = 0;
  }

  details() {
    this.entries.sort(compareAirStart);

    let a = this.entries[0];
    for (let i = this.entries.length - 1; i > 0; i--) {
      if (
        this.entries[i].startdate != "" &&
        (compareWatchEnd(this.entries[i], a) == 1 ||
          compareWatchDate(this.entries[i], a) == 1)
      ) {
        a = this.entries[i];
        // break;
      }
    }
    let b = this.entries[0];
    for (let j = this.entries.length - 1; j > 0; j--) {
      if (
        this.entries[j].airenddate != "" &&
        this.entries[j].airstartdate != ""
      ) {
        b = this.entries[j];
        break;
      }
    }
    let result = "";
    if (this.avgScore != 0) {
      result += "Score:" + Math.floor(this.avgScore * 100) / 100 + " | ";
    }
    if (this.avgRating != 0) {
      result += "Rating:" + Math.floor(this.avgRating * 100) / 100 + " | ";
    }
    result +=
      "Watched " + this.watchedEpisodes + "/" + this.totalEpisodes + " | ";
    if (this.entries[0].airstartdate != "") {
      result +=
        "Premiered " +
        defaultdatetoreadable(this.entries[0].airstartdate) +
        " | ";
    }
    if (b.airenddate != "") {
      result += "Last Aired " + defaultdatetoreadable(b.airenddate) + " | ";
    }
    if (a.enddate != "") {
      result += "Last Watched " + defaultdatetoreadable(a.enddate) + " | ";
    } else if (a.startdate != "") {
      result += "Last Watched " + defaultdatetoreadable(a.startdate) + " | ";
    }
    if (this.determinestatus() != "Default") {
      result += "STATUS: " + this.curStatus + " | ";
    }
    if (this.determineRemLen() != 0) {
      result += "Time Committment: " + mns2dhm(this.determineRemLen());
    }
    if (this.size == 0) {
      let cumlen = 0;
      for (let e of this.entries) {
        cumlen += e.determineLen();
      }
      this.remLen = cumlen;
      result += "Total Length: " + mns2dhm(cumlen);
    }
    return result;
  }

  determineLen() {
    this.totalLen = 0;
    for (let i = 0; i < this.entries.length; i++) {
      const e = this.entries[i];
      this.totalLen += e.determineLen();
    }
    this.totalLen /= 2;
    this.totalLen = Math.floor(this.totalLen * 100) / 100;
    return this.totalLen;
  }

  determineRemLen() {
    this.remLen = 0;
    for (let i = 0; i < this.entries.length; i++) {
      const e = this.entries[i];
      if (e.status == "Plan to Watch" || e.status == "On-Hold") {
        if (e.airStatus == "Aired") {
          if (e.type == "TV") {
            this.remLen += e.episodes * avgTV;
          } else if (e.type == "Movie") {
            this.remLen += e.episodes * avgMovie;
          } else if (e.type == "ONA") {
            this.remLen += e.episodes * avgONA;
          } else if (e.type == "OVA") {
            this.remLen += e.episodes * avgOVA;
          } else if (e.type == "TV Special") {
            this.remLen += e.episodes * avgTVSP;
          } else if (e.type == "Special") {
            this.remLen += e.episodes * avgSP;
          }
        }
      } else if (e.status == "Watching") {
        if (e.type == "TV") {
          this.remLen += (e.episodes - e.watchedepisodes) * avgTV;
        } else if (e.type == "Movie") {
          this.remLen += (e.episodes - e.watchedepisodes) * avgMovie;
        } else if (e.type == "ONA") {
          this.remLen += (e.episodes - e.watchedepisodes) * avgONA;
        } else if (e.type == "OVA") {
          this.remLen += (e.episodes - e.watchedepisodes) * avgOVA;
        } else if (e.type == "TV Special") {
          this.remLen += (e.episodes - e.watchedepisodes) * avgTVSP;
        } else if (e.type == "Special") {
          this.remLen += (e.episodes - e.watchedepisodes) * avgSP;
        }
      }
    }
    this.remLen /= 2;
    this.remLen = Math.floor(this.remLen * 100) / 100;
    return this.remLen;
  }

  determinestatus() {
    let airedCount = 0;
    let NYACount = 0;
    let airingCount = 0;
    let ptwCount = 0;
    let compCount = 0;
    let OHCount = 0;
    let wCount = 0;

    for (let i = 0; i < this.entries.length; i++) {
      const e = this.entries[i];
      if (e.status == "Plan to Watch") {
        ptwCount++;
        if (e.airStatus == "Aired") {
          airedCount++;
        } else if (e.airStatus == "Airing") {
          airingCount++;
        } else {
          NYACount++;
        }
      } else if (e.status == "Completed") {
        compCount++;
      } else if (e.status == "On-Hold") {
        OHCount++;
      } else if (e.status == "Watching") {
        wCount++;
      }
    }
    if (this.size == 0) {
      this.curStatus = "Default";
    } else if (wCount > 0) {
      this.curStatus = "Currently Watching";
    } else if (compCount == this.size) {
      this.curStatus = "All Completed";
    } else if (ptwCount + OHCount == this.size && airedCount > 0) {
      this.curStatus = "Yet to Start";
    } else if (compCount + NYACount + airingCount == this.size) {
      this.curStatus = "Waiting for next part";
    } else if (
      OHCount + compCount + NYACount + airingCount == this.size &&
      compCount > 0
    ) {
      this.curStatus = "Waiting for latest dub";
    } else if (OHCount + compCount + NYACount + airingCount == this.size) {
      this.curStatus = "Waiting for first dub";
    } else if (compCount + OHCount + ptwCount == this.size && airedCount > 0) {
      this.curStatus = "Partially Watched";
    }
    return this.curStatus;
  }

  toString() {
    let result = this.groupName + ":\n";
    result +=
      "Score:" +
      Math.floor(this.avgScore * 100) / 100 +
      " Rating:" +
      Math.floor(this.avgRating * 100) / 100 +
      " Watched " +
      this.watchedEpisodes +
      "/" +
      this.totalEpisodes +
      "\n";
    this.entries.forEach((element) => {
      result += "\t" + element.title + "\n";
    });
    return result;
  }

  refresh() {
    this.size = this.entries.length;
    let scoreSum = 0;
    let scoreCount = 0;
    this.entries.forEach((element) => {
      if (element.score != 0) {
        scoreCount++;
        scoreSum += element.score;
      }
    });
    if (scoreCount >= 1) {
      this.avgScore = scoreSum / scoreCount;
    } else {
      this.avgScore = 0.0;
    }

    let ratingSum = 0;
    let ratingCount = 0;
    this.entries.forEach((element) => {
      if (element.MALscore != 0) {
        ratingCount++;
        ratingSum += element.MALscore;
      }
    });
    if (ratingCount >= 1) {
      this.avgRating = ratingSum / ratingCount;
    } else {
      this.avgRating = 0.0;
    }

    this.totalEpisodes = 0;
    this.watchedEpisodes = 0;
    this.entries.forEach((element) => {
      if (element.airStatus == "Aired") this.totalEpisodes += element.episodes;
      this.watchedEpisodes += element.watchedepisodes;
    });
    this.determinestatus();
  }

  add(e) {
    if (this.size == 0) {
      this.mainEntry = e;
      this.groupName = e.title;
      if (e.title.indexOf(":") > 2) {
        this.groupName = e.title.substring(0, e.title.indexOf(":"));
      }
    }
    this.entries.push(e);

    this.size++;
    let scoreSum = 0;
    let scoreCount = 0;
    this.entries.forEach((element) => {
      if (element.score != 0) {
        scoreCount++;
        scoreSum += element.score;
      }
    });
    if (scoreCount >= 1) {
      this.avgScore = scoreSum / scoreCount;
    } else {
      this.avgScore = 0.0;
    }

    let ratingSum = 0;
    let ratingCount = 0;
    this.entries.forEach((element) => {
      if (element.MALscore != 0) {
        ratingCount++;
        ratingSum += element.MALscore;
      }
    });
    if (ratingCount >= 1) {
      this.avgRating = ratingSum / ratingCount;
    } else {
      this.avgRating = 0.0;
    }

    this.totalEpisodes = 0;
    this.watchedEpisodes = 0;
    this.entries.forEach((element) => {
      if (element.airStatus == "Aired") this.totalEpisodes += element.episodes;
      this.watchedEpisodes += element.watchedepisodes;
    });
    this.determinestatus();
  }

  recalcMain() {
    this.entries.sort(compareAirStart);
    this.mainEntry = this.entries[0];
    this.groupName = fixtitle(this.entries[0].title);
    if (this.entries[0].title.indexOf(":") > 2) {
      this.groupName = this.entries[0].title.substring(
        0,
        this.entries[0].title.indexOf(":")
      );
    }
    this.determinestatus();
  }
}

function shouldGroup(a, b) {
  astr = a.title.toLowerCase();
  bstr = b.title.toLowerCase();
  if (
    astr == bstr.substring(0, astr.length) // General check if first a.len charachters of b match a (Sword Art Online, Sword Art Online II) -> true
  ) {
    return true;
  }
  if (astr.indexOf(":") > 2) {
    if (
      astr.substring(0, astr.indexOf(":")) ==
      bstr.substring(0, astr.substring(0, astr.indexOf(":")).length)
    ) {
      // (hopefully this does a thing?)
      return true;
    }
  }
  if (
    astr.charAt(astr.length - 1) == ")" &&
    astr.substring(0, astr.lastIndexOf(" ")) ==
      bstr.substring(
        0,
        astr.substring(0, astr.lastIndexOf(" ")).length //
      )
  ) {
    // tries to ignore anything in parentheses at the end of A. eg(Jojo's Bizzare Adventure (2012), Jojo's Bizzare Adventure: Stardust Crusaders) -> true
    return true;
  }
  if (
    astr.length >= 20 &&
    bstr.length >= 20 &&
    astr.substring(0, 20) == bstr.substring(0, 20)
  ) {
    // if the first 20 characters match then its good eg (Rascal Does Not Dream of Bunny Girl Senpai,Rascal Does Not Dream of a Dreaming Girl) -> true
    return true;
  }
  if (
    astr.length >= 23 &&
    bstr.length >= 23 &&
    astr.substring(astr.length - 23) == bstr.substring(bstr.length - 23)
  ) {
    // if the last 20 characters match then its good eg (KonoSuba: God's Blessing on This Wonderful World!, KonoSuba: An Explosion on This Wonderful World!) -> true
    return true;
  }
}

function shouldGroupGroup(g, b) {
  stra = g.groupName.toLowerCase();
  strb = b.title.toLowerCase();
  if (
    stra == strb.substring(0, stra.length) // General check if first a.len charachters of b match a (Sword Art Online, Sword Art Online II) -> true
  ) {
    return true;
  }
  if (
    stra == strb.substring(strb.length - stra.length) // General check if first a.len charachters of b match a (Sword Art Online, Sword Art Online II) -> true
  ) {
    // but MAYBE it matches backwar- oh wait it doesnt even matter because they're sorted in alphabetical order
    return true;
  }
  if (
    stra.charAt(stra.length - 1) == ")" &&
    strb.charCodeAt(stra.substring(0, stra.lastIndexOf(" ")).length) < 65 &&
    stra.substring(0, stra.lastIndexOf(" ")) ==
      strb.substring(
        0,
        stra.substring(0, stra.lastIndexOf(" ")).length //
      )
  ) {
    // tries to ignore anything in parentheses at the end of A. eg(Jojo's Bizzare Adventure (2012), Jojo's Bizzare Adventure: Stardust Crusaders) -> true
    return true;
  }
  if (
    stra.length >= 20 &&
    strb.length >= 20 &&
    stra.substring(0, 20) == strb.substring(0, 20)
  ) {
    // if the first 20 characters match then its good eg (Rascal Does Not Dream of Bunny Girl Senpai,Rascal Does Not Dream of a Dreaming Girl) -> true
    return true;
  }
  if (
    stra.length >= 23 &&
    strb.length >= 23 &&
    stra.substring(stra.length - 23) == strb.substring(strb.length - 23)
  ) {
    // if the last 20 characters match then its good eg (KonoSuba: God's Blessing on This Wonderful World!, KonoSuba: An Explosion on This Wonderful World!) -> true
    return true;
  }
}

function forceGroup(name, itemname) {
  groups.push(new EntryGroup());
  for (let i = 0; i < data.length; i++) {
    if (data[i].title == itemname) {
      groups[groups.length - 1].add(data[i]);
      break;
    }
  }
  groups[groups.length - 1].groupName = name;
}

function forceUnGroup(itemname) {
  let grindex = -1;
  let itindex = -1;
  for (let i = 0; i < groups.length; i++) {
    if (grindex != -1) break;
    for (let j = 0; j < groups[i].entries.length; j++) {
      if (groups[i].entries[j].title == itemname) {
        grindex = i;
        itindex = j;
        break;
      }
    }
  }
  if (grindex == -1) {
    console.log(itemname + " failed to find and therefore failed to remove");
    return;
  }
  groups[grindex].entries.splice(itindex, 1);
  groups[grindex].refresh();
}

function buildNewGroup(name, entris) {
  groups.push(new EntryGroup());
  for (let k = 0; k < entris.length; k++) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].title == entris[k]) {
        groups[groups.length - 1].add(data[i]);
        continue;
      }
    }
  }
  if (groups[groups.length - 1].size != entris.length) {
    for (let i = 0; i < entris.length; i++) {
      const e = entris[i];
      if (!(e in groups[groups.length - 1].entries)) {
        console.log(name + " not found in list (likely due to name change)");
      }
    }
  }
  groups[groups.length - 1].groupName = name;
}

function disbandGroup(gname) {
  let grindex = -1;
  for (let i = 0; i < groups.length; i++) {
    if (groups[i].groupName == gname) {
      grindex = i;
    }
  }
  if (grindex == -1) {
    console.log(gname + " failed to find and therefore failed to disband");
    return;
  }
  groups.splice(grindex, 1);
}

function migrateGroup(gname, newgname) {
  let grindex = -1;
  for (let i = 0; i < groups.length; i++) {
    if (groups[i].groupName == gname) {
      grindex = i;
    }
  }
  if (grindex == -1) {
    console.log(gname + " failed to find and therefore failed to disband");
    return;
  }
  let entris = [];
  for (let e of groups[grindex].entries) {
    entris.push(e.title);
  }
  groups.splice(grindex, 1);
  massPutInGroup(newgname, entris);
}

function massPutInGroup(grouptitle, entris) {
  for (let i = 0; i < entris.length; i++) {
    const e = entris[i];
    putInGroup(grouptitle, e);
  }
}

function putInGroup(grouptitle, itemtitle) {
  let grindex = -1;
  let itindex = -1;
  for (let i = 0; i < groups.length; i++) {
    if (groups[i].groupName == grouptitle) {
      grindex = i;
    }
    if (groups[i].groupName == itemtitle) {
      itindex = i;
    }
  }
  if (grindex == -1) {
    console.log(grouptitle + " not found (This is an error)");
    return;
  }
  if (itindex == -1) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].title == itemtitle) {
        groups[grindex].add(data[i]);
        return;
      }
    }
    console.log(
      itemtitle +
        " not found, name must have changed, just remove that bit of hard coding. (Tried to put in group " +
        grouptitle +
        ")"
    );
  } else {
    groups[grindex].add(groups[itindex].mainEntry);
    groups.splice(itindex, 1);
  }
}

function renameGroup(grouptitle, newtitle) {
  let grindex = -1;
  for (let i = 0; i < groups.length; i++) {
    if (groups[i].groupName == grouptitle) {
      grindex = i;
    }
  }
  if (grindex == -1) {
    console.log(
      grouptitle +
        ' not found and therefore could not rename to "' +
        newtitle +
        '"'
    );
    return;
  }
  groups[grindex].groupName = newtitle;
}

function isInGroup(itemname) {
  for (let i = 0; i < groups.length; i++) {
    const grop = groups[i];
    for (let j = 0; j < grop.entries.length; j++) {
      const it = grop.entries[j];
      if (it.title == itemname) {
        return true;
      }
    }
  }
  return false;
}

function rerecruit(gname) {
  let grindex = -1;
  for (let i = 0; i < groups.length; i++) {
    if (groups[i].groupName == gname) {
      grindex = i;
    }
  }
  if (grindex == -1) {
    console.log(gname + " not found and therefore rerecruit fail");
    return;
  }
  let mygroup = groups[grindex];
  for (let j = 0; j < data.length; j++) {
    const e = data[j];
    if (!isInGroup(e.title)) {
      if (shouldGroupGroup(mygroup, e)) {
        mygroup.add(e);
      }
    }
  }
}

function bispartnofa(a, b) {
  let result = 0;
  if (a.title + " Part 2" == b.title) {
    result = 2;
  }
  if (a.title.substring(0, a.title.length - 6) + "Part 3" == b.title) {
    result = 3;
  }
  return result;
}

function gfrome(e) {
  let grindex = -1;
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    for (let j = 0; j < g.entries.length; j++) {
      if (g.entries[j].title == e.title) {
        grindex = i;
      }
    }
  }
  if (grindex == -1) {
    return null;
  }
  let mygroup = groups[grindex];
  return mygroup;
}

function groupNextWatchEntry(g) {
  if (g == null) {
    return null;
  }
  let choice = g.entries[0];
  for (let i = 0; i < g.entries.length; i++) {
    const e = g.entries[i];
    if (e.status != "Completed") {
      choice = e;
      break;
    }
  }
  return choice;
}

function getNext(e) {
  let dagroup = gfrome(e);
  let thisindex = dagroup.entries.indexOf(e);
  if (thisindex != dagroup.entries.length - 1) {
    return dagroup.entries[thisindex + 1];
  } else {
    return null;
  }
}

function isEntryNextWatch(e) {
  if (e == null) {
    throw new Error("Null");
  }
  e.isNext = groupNextWatchEntry(gfrome(e)).title == e.title;
  return e.isNext;
}

function isEntryNextWatchFromTitle(str) {
  let e = entryFromTitle(str);
  return isEntryNextWatch(e);
}

function assembleGroups() {
  data.sort(compareTitles);
  let offset = 1;
  let tempgroup;
  for (let i = 0; i < data.length - 1; i++) {
    tempgroup = null;
    const element = data[i];
    if (shouldGroup(element, data[i + offset])) {
      // match
      tempgroup = new EntryGroup();
      tempgroup.add(element);
      tempgroup.add(data[i + offset]);
      tempgroup.recalcMain();
      while (true) {
        offset++;
        if (i + offset >= data.length) {
          break;
        }
        if (
          shouldGroup(tempgroup.mainEntry, data[i + offset]) ||
          shouldGroupGroup(tempgroup, data[i + offset])
        ) {
          tempgroup.add(data[i + offset]);
          tempgroup.recalcMain();
        } else {
          break;
        }
      }
      i = i + offset - 1;
      offset = 1;

      groups.push(tempgroup);
    }
  }
  // gotta love some hard coding
  putInGroup(
    "The Irregular at Magic High School",
    "The Honor Student at Magic High School"
  );
  forceUnGroup("Magic Maker: How to Make Magic in Another World");
  disbandGroup("The Melancholy of Haruhi Suzumiya");
  massPutInGroup("The Disappearance of Haruhi Suzumiya", [
    "The Melancholy of Haruhi Suzumiya",
    "The Melancholy of Haruhi Suzumiya Season 2",
  ]);
  putInGroup("One Piece", "Monsters: 103 Mercies Dragon Damnation");
  buildNewGroup("Monster Musume: Everyday Life with Monster Girls", [
    "Monster Musume: Everyday Life with Monster Girls",
    "Monster Musume: Everyday Life with Monster Girls OVA",
  ]);
  putInGroup("Laid-Back Camp", "Room Camp");
  putInGroup(
    "Laid-Back Camp",
    "Room Camp: Saunas and Grub and Three-Wheeler Bikes"
  );
  disbandGroup("Monster");
  putInGroup("That Time I Got Reincarnated as a Slime", "The Slime Diaries");
  buildNewGroup("Gushing over Magical Girls", [
    "Gushing over Magical Girls",
    "Mahou Shoujo ni Akogarete 2nd Season",
  ]);
  putInGroup("The Dangers in My Heart", "Boku no Kokoro no Yabai Yatsu Movie");
  putInGroup(
    "Rascal Does Not Dream of Bunny Girl Senpai",
    "Seishun Buta Yarou wa Santa Claus no Yume wo Minai"
  );
  massPutInGroup("JoJo's Bizarre Adventure", [
    "Thus Spoke Kishibe Rohan",
    "JoJo no Kimyou na Bouken Part 7: Steel Ball Run",
  ]);
  migrateGroup("Boruto", "Naruto");
  putInGroup(
    "Anohana",
    "Ano Hi Mita Hana no Namae wo Bokutachi wa Mada Shiranai.: Menma e no Tegami"
  );
  putInGroup("Beyond the Boundary", "Kyoukai no Kanata: Mini Gekijou");
  putInGroup("Made in Abyss", "Marulk's Daily Life");
  // groups.forEach((element) => {
  //   element.recalcMain();
  // });
  disbandGroup("Initial D Extra Stage");
  disbandGroup("Initial D Battle Stage");
  forceGroup("Initial D", "Initial D Extra Stage");
  rerecruit("Initial D");
  disbandGroup("Owarimonogatari");
  disbandGroup("Monogatari Series");
  buildNewGroup("Monogatari", [
    "Koyomi History",
    "Owarimonogatari Second Season",
  ]);
  rerecruit("Monogatari");
  disbandGroup("Kuroko no Basket");
  renameGroup("Kuroko's Basketball", "Kuroko");
  rerecruit("Kuroko");
  rerecruit("Nisekoi");
  renameGroup("Haikyu!!", "Haikyu");
  rerecruit("One Piece");
  rerecruit("Haikyu");
  renameGroup("Danganronpa 3", "Danganronpa");
  rerecruit("Danganronpa");
  putInGroup(
    "Danganronpa",
    "Super Danganronpa 2.5: Nagito Komaeda and the Destroyer of the World"
  );
  renameGroup("Food Wars! The Second Plate", "Food Wars!");
  disbandGroup("Food Wars! The Third Plate");
  rerecruit("Food Wars!");
  disbandGroup("Fate/strange Fake");
  disbandGroup("Fate/Zero");
  putInGroup("Fate/Grand Order", "Fate/Grand Order -First Order-");
  putInGroup("Fate/Grand Order", "Fate/Grand Carnival");
  renameGroup("Fate/stay night", "Fate");
  rerecruit("Fate");
  forceUnGroup("Fate/Apocrypha");
  disbandGroup("Kizumonogatari Part 1");
  massPutInGroup("Monogatari", [
    "Kizumonogatari Part 1: Iron-Blooded",
    "Kizumonogatari Part 2: Hot-Blooded",
    "Kizumonogatari Part 3: Cold-Blooded",
    "Nekomonogatari Black",
  ]);
  let sologroup = new EntryGroup();
  for (let j = 0; j < data.length; j++) {
    const e = data[j];
    if (!isInGroup(e.title)) {
      if (e.status == "Completed") {
        sologroup.add(e);
      } else {
        let tempgrp = new EntryGroup();
        tempgrp.add(e);
        groups.push(tempgrp);
      }
    }
  }
  if (sologroup.size != 0) {
    sologroup.size = 0;
    sologroup.entries.sort(compareTitles);
    sologroup.groupName = "Individuals";
    groups.push(sologroup);
  }

  groups.sort(compareGroupSize).reverse();

  for (let i = 0; i < groups.length; i++) {
    const e = groups[i];
    let n = 1;
    let m = 1;
    e.entries.sort(compareAirStart);
    for (let j = 0; j < e.entries.length; j++) {
      const element = e.entries[j];
      let iofs = element.title.indexOf("Season");
      // Season 5 Part 2
      if (iofs != -1) {
        for (let seasonNumber = 1; seasonNumber < 10; seasonNumber++) {
          if (element.title.substring(iofs) == "Season " + seasonNumber) {
            n = seasonNumber + 1;
            element.position = "Season " + seasonNumber;
            break;
          }
          for (let partnumber = 1; partnumber < 10; partnumber++) {
            if (
              element.title.substring(iofs, iofs + 15) ==
              "Season " + seasonNumber + " Part " + partnumber
            ) {
              n = seasonNumber + 1;
              element.position =
                "Season " + seasonNumber + " Part " + partnumber;
            }
          }
        }
      }
      if (element.position != "") continue;
      if (j > 0 && bispartnofa(e.entries[j - 1], element)) {
        let x = bispartnofa(e.entries[j - 1], element);
        if (x) {
          element.position = e.entries[j - (x - 1)].position + " Part " + x;
        }
      } else if (
        j > 1 &&
        e.entries[j - 1].title + " " ==
          element.title.substring(0, e.entries[j - 1].title.length + 1) &&
        element.type == "TV"
      ) {
        element.position = e.entries[j - 1].position + " Part 2";
      } else if (element.type == "TV") {
        element.position = "Season " + n++;
      } else if (element.type == "Movie") {
        element.position = "Movie " + m++;
      } else if (
        element.episodes > 6 &&
        (element.type == "ONA" || element.type == "OVA")
      ) {
        element.position = "Season " + n++;
      } else {
        if (n > 1) element.position = "Season " + (n - 1) + " Special";
        else element.position = "Special";
      }
    }
  }
}

sortOptions.sort().reverse();

class Entry {
  // General information
  title = "Placeholder Title";
  MALscore = 0.0;
  airStatus = "";
  premiered = "";
  airstartdate = "";
  airenddate = "";
  type = "TV";
  genres = [];
  studios = [];
  licensors = [];

  demog = "";
  rated = "";

  position = "";
  ranking = 0;
  // user-Specific information
  status = "Completed";
  score = 0;
  watchedepisodes = 0;
  episodes = 0;
  startdate = "";
  enddate = "";
  isNext = false;
  rewatched = 0;

  constructor() {
    this.title = "Placeholder Title";
    this.airStatus = "";
    this.score = 0;
    this.type = "";
    this.watchedepisodes = 0;
    this.episodes = 0;
    this.status = "";
    this.startdate = curdate;
    this.enddate = curdate;
    this.premiered = "";
    this.genres = [];
    this.demog = "";
    this.studios = [];
    this.licensors = [];
    this.airstartdate = curdate;
    this.airenddate = curdate;
    this.rated = "";
    this.MALscore = 0.0;
    this.position = "";
    this.len = 0;
    this.isNext = false;
    this.rewatched = 0;
    this.ranking = 0;
  }

  extractNum(field) {
    let result = 0;
    switch (field) {
      case "title":
        result = this.title.toLowerCase().charCodeAt(0) - 96;
        if (result < 1 || result > 26) {
          result = 0;
        }
        break;
      case "airStatus":
        result = filtboxarray[1].indexOf(this.airStatus) + 1;
        break;
      case "type":
        result = filtboxarray[0].indexOf(this.type) + 1;
        break;
      case "status":
        result = filtboxarray[2].indexOf(this.status) + 1;
        break;
      case "startdate":
      case "enddate":
      case "airstartdate":
      case "airenddate":
        result = daycount(this[field]);
        break;
      case "rated":
        result = filtboxarray[3].indexOf(this.rated) + 1;
        break;
      default:
        result = this[field];
        break;
    }
    return result;
  }

  testMethod() {
    return this["MALscore"];
  }

  toString() {
    return this.title;
  }

  determineLen() {
    this.len = 0;
    if (this.title == "The Disastrous Life of Saiki K.") {
      this.len = 20 * avgTV;
      this.len /= 2;
      this.len = Math.floor(this.len * 100) / 100;
      return this.len;
    }
    if (this.episodes == 0) {
      if (this.type == "TV") {
        this.len += 12 * avgTV;
      } else if (this.type == "Movie") {
        this.len += avgMovie;
      } else if (this.type == "ONA") {
        this.len += 12 * avgONA;
      } else if (this.type == "OVA") {
        this.len += 12 * avgOVA;
      } else if (this.type == "TV Special") {
        this.len += 1 * avgTVSP;
      } else if (this.type == "Special") {
        this.len += 6 * avgSP;
      } else {
        this.len += 12 * avgTV;
      }
    } else {
      if (this.type == "TV") {
        this.len += this.episodes * avgTV;
      } else if (this.type == "Movie") {
        this.len += this.episodes * avgMovie;
      } else if (this.type == "ONA") {
        this.len += this.episodes * avgONA;
      } else if (this.type == "OVA") {
        this.len += this.episodes * avgOVA;
      } else if (this.type == "TV Special") {
        this.len += this.episodes * avgTVSP;
      } else if (this.type == "Special") {
        this.len += this.episodes * avgSP;
      }
    }

    this.len /= 2;
    this.len = Math.floor(this.len * 100) / 100;
    return this.len;
  }

  determineDayCount() {
    if (this.startdate == "") {
      return 1;
    }
    if (this.enddate == "") {
      return daycount(this.startdate) + 1;
    }
    let elapseddays = daycount(this.startdate) - daycount(this.enddate) + 1;
    return elapseddays;
  }

  determineRemLen() {
    if (this.remLen != 0) {
      this.remLen = 0;
      if (this.type == "TV") {
        this.remLen += (this.episodes - this.watchedepisodes) * avgTV;
      } else if (this.type == "Movie") {
        this.remLen += (this.episodes - this.watchedepisodes) * avgMovie;
      } else if (this.type == "ONA") {
        this.remLen += (this.episodes - this.watchedepisodes) * avgONA;
      } else if (this.type == "OVA") {
        this.remLen += (this.episodes - this.watchedepisodes) * avgOVA;
      } else if (this.type == "TV Special") {
        this.remLen += (this.episodes - this.watchedepisodes) * avgTVSP;
      } else if (this.type == "Special") {
        this.remLen += (this.episodes - this.watchedepisodes) * avgSP;
      }
      this.remLen /= 2;
      this.remLen = Math.floor(this.remLen * 100) / 100;
    }
    return this.remLen;
  }

  determineProgressLen() {
    return this.determineLen() - this.determineRemLen();
  }

  determinePercentCompletion() {
    return this.determineProgressLen() / this.determineLen();
  }
}

function toEntry(obj) {
  let result = new Entry();
  for (const key in obj) {
    result[key] = obj[key];
  }
  return result;
}

function dayOfWeek(dc) {
  let result = (-dc + daycount("27-10-24")) % 7;
  if (result < 0) {
    result += 7;
  }
  return result % 7;
}

function isnumeric(str) {
  if (typeof str == "string") {
    if (str.charAt(0) == "-") {
      str = str.substring(1);
    }
    let result = true;
    let dotCount = 0;
    for (let e of str) {
      if (e == ".") {
        dotCount++;
        continue;
      }
      if (e.charCodeAt(0) >= 48 && e.charCodeAt(0) <= 57) {
        continue;
      } else {
        result = false;
        return false;
      }
    }
    return result && dotCount <= 1;
  } else if (typeof str == "number") {
    return true;
  } else {
    return false;
  }
}

function stringsPercentMatch(a, b) {
  let match = 0;
  if (a.length <= b.length) {
    for (let i = 0; i < a.length; i++) {
      if (a[i] == b[i]) {
        match++;
      }
    }
    if (a.length < b.length) {
      for (let i = 0; i < a.length; i++) {
        if (b[b.length - i - 1] == a[a.length - i - 1]) {
          match++;
        }
      }
    }
    return match / Math.max(a.length, b.length);
  } else {
    return stringsPercentMatch(b, a);
  }
}

function fixtitle(str) {
  if (str.charAt(str.length - 1) == ")") {
    return str.substring(0, str.lastIndexOf(" "));
  } else {
    return str;
  }
}

function ds2ymd(ds) {
  if (!isnumeric(ds) || ds == Infinity) return ds;
  if (ds == Math.floor(ds)) {
    // whole number of days
    if (ds < 31) return ds + "d";
    if (ds < 365) return Math.floor(ds / 31) + "M" + (ds % 31) + "d";
    return (
      Math.floor(ds / 365) +
      "Y" +
      Math.floor((ds % 365) / 31) +
      "M" +
      ((ds % 365) % 31) +
      "d"
    );
  } else {
    // fraction of days
    let secs = Math.floor(ds * 24 * 60 * 60);
    if (secs < 60) return secs + "s";
    if (secs < 60 * 60) return Math.floor(secs / 60) + "m" + (secs % 60) + "s";
    if (secs < 24 * 60 * 60)
      return (
        (Math.floor(secs / 60 / 60) % 60) +
        "h" +
        (Math.floor(secs / 60) % 60) +
        "m" +
        (secs % 60) +
        "s"
      );
    if (secs < 31 * 24 * 60 * 60)
      return (
        (Math.floor(secs / 24 / 60 / 60) % 24) +
        "d" +
        (Math.floor(secs / 60 / 60) % 60) +
        "h" +
        (Math.floor(secs / 60) % 60) +
        "m" +
        (secs % 60) +
        "s"
      );
    if (secs < 365 * 24 * 60 * 60)
      return (
        (Math.floor(secs / 31 / 24 / 60 / 60) % 31) +
        "M" +
        (Math.floor(secs / 24 / 60 / 60) % 24) +
        "d" +
        (Math.floor(secs / 60 / 60) % 60) +
        "h" +
        (Math.floor(secs / 60) % 60) +
        "m" +
        (secs % 60) +
        "s"
      );
    return (
      Math.floor(secs / 365 / 24 / 60 / 60) +
      "Y" +
      (Math.floor((secs * 12) / 365 / 24 / 60 / ~60) % 12) +
      "M" +
      (Math.floor(secs / 24 / 60 / 60) % 31) +
      "d" +
      (Math.floor(secs / 60 / 60) % 60) +
      "h" +
      (Math.floor(secs / 60) % 60) +
      "m" +
      (secs % 60) +
      "s"
    );
  }
}

function isOptimizedDate(str) {
  if (str.charAt(0) == "-") {
    return inversemns2dhm(str.substring(1));
  }
  let result = true;
  if (str.indexOf("Y") != -1) {
    //has years number, remove it as year number is always valid
    str = str.substring(str.indexOf("Y") + 1);
  }
  if (str.indexOf("M") != -1) {
    //has months number
    let monthstring = str.substring(0, str.indexOf("M"));
    let x = parseInt(monthstring);
    if (x > 11) {
      result = false;
    }
    str = str.substring(str.indexOf("M") + 1);
  }
  if (str.indexOf("d") != -1) {
    //has days number
    let yearstring = str.substring(0, str.indexOf("d"));
    let x = parseInt(yearstring);
    if (x > 30) {
      result = false;
    }
    str = str.substring(str.indexOf("d") + 1);
  }
  if (str.indexOf("h") != -1) {
    // has hours number
    let hourstring = str.substring(0, str.indexOf("h"));
    let x = parseInt(hourstring);
    if (x > 23) {
      result = false;
    }
    str = str.substring(str.indexOf("h") + 1);
  }
  if (str.indexOf("m") != -1) {
    // has minutes number
    let minutestring = str.substring(0, str.indexOf("m"));
    let x = parseInt(minutestring);
    if (x > 59) {
      result = false;
    }
    str = str.substring(str.indexOf("m") + 1);
  }
  if (str.indexOf("s") != -1) {
    // has seconds number
    let secondstring = str.substring(0, str.indexOf("s"));
    let x = parseInt(secondstring);
    if (x > 59) {
      result = false;
    }
    str = str.substring(str.indexOf("s") + 1);
  }
  return result;
}

function inversemns2dhm(str) {
  // Takes string of form 58d7h20m and returns correct number of minutes (83960 in this case)
  if (str.charAt(0) == "-") {
    return -inversemns2dhm(str.substring(1));
  }
  let result = 0;
  if (str.indexOf("Y") != -1) {
    // has years number
    let yearstring = str.substring(0, str.indexOf("Y"));
    result += parseInt(yearstring) * 365 * 24 * 60;
    str = str.substring(str.indexOf("Y") + 1);
  }
  if (str.indexOf("d") != -1) {
    // has days number
    let daystring = str.substring(0, str.indexOf("d"));
    result += parseInt(daystring) * 24 * 60;
    str = str.substring(str.indexOf("d") + 1);
  }
  if (str.indexOf("h") != -1) {
    // has hours number
    let hourstring = str.substring(0, str.indexOf("h"));
    result += parseInt(hourstring) * 60;
    str = str.substring(str.indexOf("h") + 1);
  }
  if (str.indexOf("m") != -1) {
    // has minutes number
    let minutestring = str.substring(0, str.indexOf("m"));
    result += parseInt(minutestring);
    str = str.substring(str.indexOf("m") + 1);
  }
  if (str.indexOf("s") != -1) {
    // has seconds number
    let secondstring = str.substring(0, str.indexOf("s"));
    result += parseInt(secondstring) / 60;
  }
  return result;
}

function mns2dhm(mns) {
  if (mns < 0) return "-" + mns2dhm(-mns);
  if (mns == Math.floor(mns)) {
    // whole number of minutes
    if (mns < 60) return mns + "m";
    if (mns < 24 * 60) return Math.floor(mns / 60) + "h" + (mns % 60) + "m";
    if (mns < 365 * 24 * 60)
      return (
        Math.floor(mns / 24 / 60) +
        "d" +
        Math.floor((mns % (24 * 60)) / 60) +
        "h" +
        (mns % 60) +
        "m"
      );
    return (
      Math.floor(mns / 365 / 24 / 60) +
      "Y" +
      Math.floor((mns % (365 * 24 * 60)) / 24 / 60) +
      "d" +
      Math.floor((mns % (24 * 60)) / 60) +
      "h" +
      (mns % 60) +
      "m"
    );
  } else {
    // some fraction of minutes
    let secs = Math.floor(mns * 60);
    if (secs < 60) return secs + "s";
    if (secs < 60 * 60) return Math.floor(secs / 60) + "m" + (secs % 60) + "s";
    if (secs < 24 * 60 * 60)
      return (
        (Math.floor(secs / 60 / 60) % 60) +
        "h" +
        (Math.floor(secs / 60) % 60) +
        "m" +
        (secs % 60) +
        "s"
      );
    if (secs < 365 * 24 * 60 * 60)
      return (
        Math.floor(secs / 24 / 60 / 60) +
        "d" +
        Math.floor((secs % (24 * 60 * 60)) / 60 / 60) +
        "h" +
        Math.floor((secs % (60 * 60)) / 60) +
        "m" +
        (secs % 60) +
        "s"
      );
    return (
      Math.floor(secs / 365 / 24 / 60 / 60) +
      "Y" +
      Math.floor((secs % (365 * 24 * 60 * 60)) / 24 / 60 / 60) +
      "d" +
      Math.floor((secs % (24 * 60 * 60)) / 60 / 60) +
      "h" +
      Math.floor((secs % (60 * 60)) / 60) +
      "m" +
      (secs % 60) +
      "s"
    );
  }
}

function yns(x) {
  if (x == 1) {
    return "";
  } else {
    return "s";
  }
}

function ynes(x) {
  if (x == 1) {
    return "y";
  } else {
    return "ies";
  }
}

function switchfile() {
  if (sortselector != null) sortselector.hidden = true;
  if (chfilebutton != null) chfilebutton.hidden = true;
  if (foldselector != null) foldselector.hidden = true;
  if (inputfile != null) inputfile.hidden = false;
}

function daycountinverse(thisday) {
  let dybit = 1;
}

function ndaysbefore(e, n) {
  if (n < 0) return ndaysafter(e, -n);
  let result = e;
  for (let i = 0; i < n; i++) {
    result = onedaybefore(result);
  }
  return result;
}

function ndaysafter(e, n) {
  if (n < 0) return ndaysbefore(e, -n);
  let result = e;
  for (let i = 0; i < n; i++) {
    result = onedayafter(result);
  }
  return result;
}

function onedayafter(e) {
  let yrbit = parseInt(e.substring(6, 8));
  let mnbit = parseInt(e.substring(3, 5));
  let dybit = parseInt(e.substring(0, 2));
  if (mnbit == 0) {
    mnbit = 10;
  }
  if (dybit == 0) {
    dybit = 14;
  }

  if (dybit < mondays(mnbit, yrbit)) {
    return pwz(dybit + 1) + "-" + pwz(mnbit) + "-" + pwz(yrbit);
  }
  if (mnbit < 12) {
    return "01-" + pwz(mnbit + 1) + "-" + pwz(yrbit);
  }
  if (yrbit != 99) {
    return "01-01-" + pwz(yrbit + 1);
  }
  return "01-01-00";
}

function pwz(e) {
  if (e < 10) {
    e = "0" + e;
  } else if (e == 0) {
    e = "00" + e;
  }
  return e;
}

function onedaybefore(e) {
  // dd-mm-yy
  let yrbit = parseInt(e.substring(6, 8));
  let mnbit = parseInt(e.substring(3, 5));
  let dybit = parseInt(e.substring(0, 2));
  if (mnbit == 0) {
    mnbit = 10;
  }
  if (dybit == 0) {
    dybit = 14;
  }

  if (dybit > 1) {
    return pwz(dybit - 1) + "-" + pwz(mnbit) + "-" + pwz(yrbit);
  }
  if (mnbit > 1) {
    return (
      pwz(mondays(mnbit - 1, yrbit)) + "-" + pwz(mnbit - 1) + "-" + pwz(yrbit)
    );
  }
  if (yrbit > 0) {
    return "31-12-" + pwz(yrbit - 1);
  }
  return "31-12-99";
}

function isLeapYear(yr) {
  return yr % 4 == 0 && yr % 100 != 0;
}

function daycount(e) {
  if (e == "") return 0;
  if (e == curdate) return 0;
  let yrbit = parseInt(e.substring(6, 8));
  let mnbit = parseInt(e.substring(3, 5));
  let dybit = parseInt(e.substring(0, 2));
  if (yrbit <= 50) yrbit += 100;
  if (mnbit == 0) mnbit = 10;
  if (dybit == 0) dybit = 14;
  let tempcy = curyear;
  if (tempcy <= 50) tempcy += 100;
  let tempcm = curmon;
  let tempcd = curday;
  let result = 0;
  let rewinddaycounts = [
    31, //jan
    28 + isLeapYear(yrbit), //feb
    31, //mar
    30, //apr
    31, //mai
    30, //jun
    31, //jul
    31, //aug
    30, //sep
    31, //oct
    30, //nov
    31, //dec
  ];
  let rewinddaycounts1 = [
    31, //jan
    28 + isLeapYear(curyear), //feb
    31, //mar
    30, //apr
    31, //mai
    30, //jun
    31, //jul
    31, //aug
    30, //sep
    31, //oct
    30, //nov
    31, //dec
  ];
  result -= dybit - 1;
  if (mnbit > 1) result -= sumArrToi(rewinddaycounts, mnbit - 2);
  result += curday - 1;
  if (curmon > 1) result += sumArrToi(rewinddaycounts1, curmon - 2);
  result += 365 * (tempcy - yrbit);
  if (yrbit < 100) result--;
  let numyears = tempcy - yrbit;
  if (numyears > 0 && isLeapYear(yrbit)) result++;
  let myFunc = (n, a) => {
    if (n < 0) return -Math.ceil((-n - 4 + (a % 4)) / 4);
    return Math.ceil((n - 4 + (a % 4)) / 4);
  };
  if (numyears != 0) result += myFunc(numyears, Math.min(tempcy, yrbit));
  return result;
}

function sumArrToi(arr, i) {
  let result = 0;
  if (i >= arr.length) i = arr.length - 1;
  for (let j = 0; j <= i; j++) {
    result += arr[j];
  }
  return result;
}

function massTestDCW(startdate, enddate) {
  let dcs = daycount(startdate);
  let dce = daycount(enddate);
  let myArray = [];
  let starttime = new Date();
  for (let i = dcs; i >= dce; i--) {
    const e = ndaysbefore(curdate, i);
    myArray.push(e);
  }
  let endtime = new Date();
  console.log(endtime - starttime);
  starttime = new Date();
  for (let e of myArray) {
    daycountworking(e);
  }
  endtime = new Date();
  console.log(endtime - starttime);
  starttime = new Date();
  for (let e of myArray) {
    daycount(e);
  }
  endtime = new Date();
  console.log(endtime - starttime);
}

function testdaycount(e) {
  let dw = daycountworking(e);
  let dc = daycount(e);
  if (dw == dc) {
    console.log(
      "daycountworking(e) works for date " + defaultdatetoreadable(e)
    );
  } else {
    console.error(
      "daycountworking(e) not working for date " +
        defaultdatetoreadable(e) +
        ", \n\tdaycountworking(" +
        e +
        ") = " +
        dw +
        "\n\tdaycount(" +
        e +
        ") = " +
        dc +
        "\n\tit gave the day count for " +
        defaultdatetoreadable(ndaysbefore(curdate, dw))
    );
  }
}

function tdc(e) {
  let dw = daycountworking(e);
  let dc = daycount(e);
  return dw == dc;
}

function daycountarchived(e) {
  if (e == "") return 0;
  if (e == curdate) return 0;
  // if (e in dateMemo) {
  //   return dateMemo[e];
  // }
  let temp = e;
  let i = 0;
  let yrbit = parseInt(e.substring(6, 8));
  let mnbit = parseInt(e.substring(3, 5));
  let dybit = parseInt(e.substring(0, 2));
  if (yrbit > 50) yrbit -= 100;
  if (mnbit == 0) mnbit = 10;
  if (dybit == 0) dybit = 14;
  if (
    yrbit < curyear ||
    (yrbit == curyear && mnbit < curmon) ||
    (yrbit == curyear && mnbit == curmon && dybit < curday)
  ) {
    while (temp != curdate) {
      i++;
      temp = onedayafter(temp);
    }
  } else {
    while (temp != curdate) {
      i--;
      temp = onedaybefore(temp);
    }
  }
  // dateMemo[e] = i;
  return i;
}

function specialdaycount(e) {
  let special = false;
  if (e == "00-00-25") special = true;
  if (e == curdate) return 0;
  let temp = e;
  let i = 0;
  let yrbit = parseInt(e.substring(6, 8));
  let mnbit = parseInt(e.substring(3, 5));
  let dybit = parseInt(e.substring(0, 2));
  if (yrbit > 50) yrbit -= 100;
  if (mnbit == 0) mnbit = 10;
  if (dybit == 0) dybit = 14;
  if (
    yrbit < curyear ||
    (yrbit == curyear && mnbit < curmon) ||
    (yrbit == curyear && mnbit == curmon && dybit < curday)
  ) {
    while (temp != curdate) {
      i++;
      temp = onedayafter(temp);
    }
  } else {
    while (temp != curdate) {
      i--;
      temp = onedaybefore(temp);
    }
  }
  if (i > 0) {
    let temp = e;
    for (let j = i; j > 0; j--) {
      dateMemo[temp] = j;
      temp = onedayafter(temp);
    }
  } else {
    for (let j = i; j < 0; j++) {
      dateMemo[temp] = j;
      temp = onedaybefore(temp);
    }
  }
  return i;
}

function mean(arr) {
  let result = 0;
  arr.forEach((e) => {
    result += e;
  });
  return result / arr.length;
}

function mondays(mon, yr) {
  if (mon > 12) mon = mon % 12;
  switch (mon) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    case 2:
      if (yr % 4 != 0 || yr % 100 == 0) return 28;
      return 29;
    default:
      return 30;
  }
}

function getVals() {
  let parent = this.parentNode;
  let slides = parent.getElementsByTagName("input");
  let slide1 = parseFloat(slides[0].value);
  let slide2 = parseFloat(slides[1].value);
  if (slide1 > slide2) {
    let tmp = slide2;
    slide2 = slide1;
    slide1 = tmp;
  }

  let displayElement = parent.getElementsByClassName("rangeValues")[0];
  let tempvalues = [slide1, slide2];
  rangevalues[parent.id] = tempvalues;
  displayElement.innerHTML = parent.id + ": " + slide1 + " - " + slide2;
}

function yrtoyear(yr) {
  if (yr < 50) {
    return 2000 + yr;
  }
  return 1900 + yr;
}

function defaultdatetoreadable(input) {
  // dd-mm-yy
  if (input == "") return "-";
  let result = "";
  if (input.substring(3, 5) != "00")
    result += mArr[parseInt(input.substring(3, 5)) - 1] + " ";
  if (input.substring(0, 2) != "00") result += input.substring(0, 2) + " ";
  if (parseInt(input.substring(6, 8)) >= 50) result += "19";
  if (parseInt(input.substring(6, 8)) < 50) result += "20";
  /*if (input.substring(6, 8) != "00")*/ result += input.substring(6, 8);
  if (input.substring(3, 5) == "00") result += "\t";
  return result;
}

function compareGroupStatus(a, b) {
  let ORDER = [
    "Currently Watching",
    "Partially Watched",
    "Yet to Start",
    "Waiting for first dub",
    "Waiting for latest dub",
    "Waiting for next part",
    "All Completed",
    "Default",
  ];
  acode = ORDER.indexOf(a.curStatus);
  bcode = ORDER.indexOf(b.curStatus);
  if (acode > bcode) {
    return 1;
  } else if (acode < bcode) {
    return -1;
  }
  return 0;
}

function compareGroupRemEp(a, b) {
  acode = a.totalEpisodes - a.watchedEpisodes;
  bcode = b.totalEpisodes - b.watchedEpisodes;
  if (acode > bcode) {
    return 1;
  } else if (acode < bcode) {
    return -1;
  }
  return 0;
}

function compareGroupTimeCom(a, b) {
  acode = a.determineRemLen();
  bcode = b.determineRemLen();
  if (acode == 0) {
    acode = 10000000;
  }
  if (bcode == 0) {
    bcode = 10000000;
  }
  if (acode > bcode) {
    return 1;
  } else if (acode < bcode) {
    return -1;
  }
  return 0;
}

function compareGroupTotalLength(a, b) {
  acode = a.determineLen();
  bcode = b.determineLen();
  if (acode == 0) {
    acode = 10000000;
  }
  if (bcode == 0) {
    bcode = 10000000;
  }
  if (acode > bcode) {
    return 1;
  } else if (acode < bcode) {
    return -1;
  }
  return 0;
}

function compareGroupAirFinish(a1, b1) {
  let a = a1.entries[0];
  for (let i = 1; i < a1.entries.length; i++) {
    if (
      a1.entries[i].airenddate != "" &&
      compareAirFinish(a1.entries[i], a) == -1
    ) {
      a = a1.entries[i];
    }
  }
  let b = b1.entries[0];
  for (let j = 1; j > b1.entries.length; j--) {
    if (
      b1.entries[j].airenddate != "" &&
      compareAirFinish(b1.entries[i], b) == -1
    ) {
      b = b1.entries[j];
    }
  }

  acode =
    parseInt(a.airenddate.substring(6, 8)) * 10000 +
    parseInt(a.airenddate.substring(3, 5)) * 100 +
    parseInt(a.airenddate.substring(0, 2));
  bcode =
    parseInt(b.airenddate.substring(6, 8)) * 10000 +
    parseInt(b.airenddate.substring(3, 5)) * 100 +
    parseInt(b.airenddate.substring(0, 2));
  if (acode < 400000) acode += 1000000;
  if (bcode < 400000) bcode += 1000000;
  if (isNaN(acode)) acode = 0;
  if (isNaN(bcode)) bcode = 0;
  if (acode % 10000 == 0) acode += 1014;
  if (bcode % 10000 == 0) bcode += 1014;
  if (acode % 100 == 0) acode += 14;
  if (bcode % 100 == 0) bcode += 14;
  if (acode > bcode) {
    return 1;
  } else if (acode < bcode) {
    return -1;
  }
  return 0;
}

function compareGroupWatchDate(a1, b1) {
  let a = a1.entries[0];
  for (let i = a1.entries.length - 1; i > 0; i--) {
    if (
      a1.entries[i].startdate != "" &&
      (compareWatchDate(a1.entries[i], a) == 1 ||
        compareWatchDate(a1.entries[i], a) == 1)
    ) {
      a = a1.entries[i];
      // break;
    }
  }
  let b = b1.entries[0];
  for (let j = b1.entries.length - 1; j > 0; j--) {
    if (
      b1.entries[j].startdate != "" &&
      (compareWatchDate(b1.entries[j], b) == 1 ||
        compareWatchDate(b1.entries[j], b) == 1)
    ) {
      b = b1.entries[j];
      // break;
    }
  }

  acode =
    parseInt(a.startdate.substring(6, 8)) * 10000 +
    parseInt(a.startdate.substring(3, 5)) * 100 +
    parseInt(a.startdate.substring(0, 2));
  bcode =
    parseInt(b.startdate.substring(6, 8)) * 10000 +
    parseInt(b.startdate.substring(3, 5)) * 100 +
    parseInt(b.startdate.substring(0, 2));
  if (acode < 400000) acode += 1000000;
  if (bcode < 400000) bcode += 1000000;
  if (isNaN(acode)) acode = 0;
  if (isNaN(bcode)) bcode = 0;
  if (acode % 10000 == 0) acode += 1014;
  if (bcode % 10000 == 0) bcode += 1014;
  if (acode % 100 == 0) acode += 14;
  if (bcode % 100 == 0) bcode += 14;
  if (acode > bcode) {
    return 1;
  } else if (acode < bcode) {
    return -1;
  }
  return 0;
}

function compareGroupType(a, b) {
  if (a.entries[0].type > b.entries[0].type) {
    return 1;
  } else if (a.entries[0].type < b.entries[0].type) {
    return -1;
  }
  return 0;
}

function compareGroupPickup(a, b) {
  let ad = daycount(a.entries[0].airenddate) - daycount(a.entries[0].enddate);
  let bd = daycount(b.entries[0].airenddate) - daycount(b.entries[0].enddate);
  if (ad > bd) {
    return 1;
  } else if (ad < bd) {
    return -1;
  }
  return 0;
}

function compareGroupTLength(a, b) {
  let al = a.groupName.length;
  let bl = b.groupName.length;
  if (al > bl) {
    return 1;
  } else if (al < bl) {
    return -1;
  }
  return 0;
}

function compareGroupSize(a, b) {
  if (a.size > b.size) {
    return 1;
  } else if (a.size < b.size) {
    return -1;
  }
  return 0;
}

function compareGroupNames(a, b) {
  if (a.groupName > b.groupName) {
    return 1;
  } else if (a.groupName < b.groupName) {
    return -1;
  }
  return 0;
}

function compareGroupRunLength(ag, bg) {
  a1 = ag.entries[0];
  a2 = ag.entries[ag.entries.length - 1];
  b1 = bg.entries[0];
  b2 = bg.entries[bg.entries.length - 1];
  a1code =
    parseInt(a1.airstartdate.substring(6, 8)) * 365 +
    parseInt(a1.airstartdate.substring(3, 5)) * 30 +
    parseInt(a1.airstartdate.substring(0, 2));
  a2code =
    parseInt(a2.airenddate.substring(6, 8)) * 365 +
    parseInt(a2.airenddate.substring(3, 5)) * 30 +
    parseInt(a2.airenddate.substring(0, 2));
  b1code =
    parseInt(b1.airstartdate.substring(6, 8)) * 365 +
    parseInt(b1.airstartdate.substring(3, 5)) * 30 +
    parseInt(b1.airstartdate.substring(0, 2));
  b2code =
    parseInt(b2.airenddate.substring(6, 8)) * 365 +
    parseInt(b2.airenddate.substring(3, 5)) * 30 +
    parseInt(b2.airenddate.substring(0, 2));
  if (a1code < 15000) a1code += 36500;
  if (b1code < 15000) b1code += 36500;
  if (a2code < 15000) a2code += 36500;
  if (b2code < 15000) b2code += 36500;
  acode = a2code - a1code;
  bcode = b2code - b1code;
  if (isNaN(acode)) acode = 0;
  if (isNaN(bcode)) bcode = 0;
  if (acode > bcode) {
    return 1;
  } else if (acode < bcode) {
    return -1;
  }
  return 0;
}

function compareGroupScore(a, b) {
  if (a.avgScore > b.avgScore) {
    return 1;
  } else if (a.avgScore < b.avgScore) {
    return -1;
  }
  return 0;
}

function compareGroupRating(a, b) {
  if (a.avgRating > b.avgRating) {
    return 1;
  } else if (a.avgRating < b.avgRating) {
    return -1;
  }
  return 0;
}

function compareGroupEpisodes(a, b) {
  if (a.totalEpisodes > b.totalEpisodes) {
    return 1;
  } else if (a.totalEpisodes < b.totalEpisodes) {
    return -1;
  }
  return 0;
}

function compareGroupWatchedEpisodes(a, b) {
  if (a.watchedEpisodes > b.watchedEpisodes) {
    return 1;
  } else if (a.watchedEpisodes < b.watchedEpisodes) {
    return -1;
  }
  return 0;
}

function compareGroupDifference(a, b) {
  if (a.avgScore - a.avgRating > b.avgScore - b.avgRating) {
    return 1;
  } else if (a.avgScore - a.avgRating < b.avgScore - b.avgRating) {
    return -1;
  }
  return 0;
}

function compareGroupDemographic(a, b) {
  if (a.entries[0].demog > b.entries[0].demog) {
    return 1;
  } else if (a.entries[0].demog < b.entries[0].demog) {
    return -1;
  }
  return 0;
}

function compareGroupRated(a, b) {
  if (a.entries[0].rated > b.entries[0].rated) {
    return 1;
  } else if (a.entries[0].rated < b.entries[0].rated) {
    return -1;
  }
  return 0;
}

function compareGroupAirDate(a1, b1) {
  a = a1.entries[0];
  b = b1.entries[0];
  acode =
    parseInt(a.airstartdate.substring(6, 8)) * 10000 +
    parseInt(a.airstartdate.substring(3, 5)) * 100 +
    parseInt(a.airstartdate.substring(0, 2));
  bcode =
    parseInt(b.airstartdate.substring(6, 8)) * 10000 +
    parseInt(b.airstartdate.substring(3, 5)) * 100 +
    parseInt(b.airstartdate.substring(0, 2));
  if (acode < 400000) acode += 1000000;
  if (bcode < 400000) bcode += 1000000;
  if (isNaN(acode)) acode = 1000000000;
  if (isNaN(bcode)) bcode = 1000000000;
  if (acode % 10000 == 0) acode += 1014;
  if (bcode % 10000 == 0) bcode += 1014;
  if (acode % 100 == 0) acode += 14;
  if (bcode % 100 == 0) bcode += 14;
  if (acode > bcode) {
    return 1;
  } else if (acode < bcode) {
    return -1;
  }
  return 0;
}

function compareTitles(a, b) {
  if (a.title.toLowerCase() > b.title.toLowerCase()) {
    return 1;
  } else if (a.title.toLowerCase() < b.title.toLowerCase()) {
    return -1;
  }
  return 0;
}

function compareTypes(a, b) {
  if (a.type > b.type) {
    return 1;
  } else if (a.type < b.type) {
    return -1;
  }
  return 0;
}

function compareScores(a, b) {
  if (a.score > b.score) {
    return 1;
  } else if (a.score < b.score) {
    return -1;
  }
  return 0;
}

function compareWEpisodes(a, b) {
  if (a.watchedepisodes > b.watchedepisodes) {
    return 1;
  } else if (a.watchedepisodes < b.watchedepisodes) {
    return -1;
  }
  return 0;
}

function compareEpisodes(a, b) {
  if (a.episodes > b.episodes) {
    return 1;
  } else if (a.episodes < b.episodes) {
    return -1;
  }
  return 0;
}

function compareMALScore(a, b) {
  if (a.MALscore > b.MALscore) {
    return 1;
  } else if (a.MALscore < b.MALscore) {
    return -1;
  }
  return 0;
}

function compareStatus(a, b) {
  if (a.status > b.status) {
    return 1;
  } else if (a.status < b.status) {
    return -1;
  }
  return 0;
}

function compareAirStatus(a, b) {
  if (a.airStatus > b.airStatus) {
    return 1;
  } else if (a.airStatus < b.airStatus) {
    return -1;
  }
  return 0;
}

function compareDifference(a, b) {
  if (a.score - a.MALscore > b.score - b.MALscore) {
    return 1;
  } else if (a.score - a.MALscore < b.score - b.MALscore) {
    return -1;
  }
  return 0;
}

function compareAirStart(a, b) {
  acode =
    parseInt(a.airstartdate.substring(6, 8)) * 10000 +
    parseInt(a.airstartdate.substring(3, 5)) * 100 +
    parseInt(a.airstartdate.substring(0, 2));
  bcode =
    parseInt(b.airstartdate.substring(6, 8)) * 10000 +
    parseInt(b.airstartdate.substring(3, 5)) * 100 +
    parseInt(b.airstartdate.substring(0, 2));
  if (acode < 400000) acode += 1000000;
  if (bcode < 400000) bcode += 1000000;
  if (isNaN(acode)) acode = 1000000000;
  if (isNaN(bcode)) bcode = 1000000000;
  if (acode % 10000 == 0) acode += 1014;
  if (bcode % 10000 == 0) bcode += 1014;
  if (acode % 100 == 0) acode += 14;
  if (bcode % 100 == 0) bcode += 14;
  if (acode > bcode) {
    return 1;
  } else if (acode < bcode) {
    return -1;
  }
  return 0;
}

function compareAirFinish(a, b) {
  acode =
    parseInt(a.airenddate.substring(6, 8)) * 10000 +
    parseInt(a.airenddate.substring(3, 5)) * 100 +
    parseInt(a.airenddate.substring(0, 2));
  bcode =
    parseInt(b.airenddate.substring(6, 8)) * 10000 +
    parseInt(b.airenddate.substring(3, 5)) * 100 +
    parseInt(b.airenddate.substring(0, 2));
  if (acode < 400000) acode += 1000000;
  if (bcode < 400000) bcode += 1000000;
  if (isNaN(acode)) acode = 100000000;
  if (isNaN(bcode)) bcode = 100000000;
  if (acode % 10000 == 0) acode += 1014;
  if (bcode % 10000 == 0) bcode += 1014;
  if (acode % 100 == 0) acode += 14;
  if (bcode % 100 == 0) bcode += 14;
  if (acode > bcode) {
    return 1;
  } else if (acode < bcode) {
    return -1;
  }
  return 0;
}

function compareRunLength(a, b) {
  // 03-05-24
  // if (a.airenddate == "") {
  //   a2code = curdate;
  // }
  // if (b.airenddate == "") {
  //   b2code = curdate;
  // }
  a1code =
    parseInt(a.airstartdate.substring(6, 8)) * 365 +
    parseInt(a.airstartdate.substring(3, 5)) * 30 +
    parseInt(a.airstartdate.substring(0, 2));
  a2code =
    parseInt(a.airenddate.substring(6, 8)) * 365 +
    parseInt(a.airenddate.substring(3, 5)) * 30 +
    parseInt(a.airenddate.substring(0, 2));
  b1code =
    parseInt(b.airstartdate.substring(6, 8)) * 365 +
    parseInt(b.airstartdate.substring(3, 5)) * 30 +
    parseInt(b.airstartdate.substring(0, 2));
  b2code =
    parseInt(b.airenddate.substring(6, 8)) * 365 +
    parseInt(b.airenddate.substring(3, 5)) * 30 +
    parseInt(b.airenddate.substring(0, 2));

  if (a1code < 15000) a1code += 36500;
  if (b1code < 15000) b1code += 36500;
  if (a2code < 15000) a2code += 36500;
  if (b2code < 15000) b2code += 36500;
  acode = a2code - a1code;
  bcode = b2code - b1code;
  if (isNaN(acode)) acode = 0;
  if (isNaN(bcode)) bcode = 0;
  if (acode > bcode) {
    return 1;
  } else if (acode < bcode) {
    return -1;
  }
  return 0;
}

function compareWatchEnd(a, b) {
  acode =
    parseInt(a.enddate.substring(6, 8)) * 10000 +
    parseInt(a.enddate.substring(3, 5)) * 100 +
    parseInt(a.enddate.substring(0, 2));
  bcode =
    parseInt(b.enddate.substring(6, 8)) * 10000 +
    parseInt(b.enddate.substring(3, 5)) * 100 +
    parseInt(b.enddate.substring(0, 2));
  if (acode < 400000) acode += 1000000;
  if (bcode < 400000) bcode += 1000000;
  if (isNaN(acode)) acode = 0;
  if (isNaN(bcode)) bcode = 0;
  if (acode % 10000 == 0) acode += 1014;
  if (bcode % 10000 == 0) bcode += 1014;
  if (acode % 100 == 0) acode += 14;
  if (bcode % 100 == 0) bcode += 14;
  if (acode > bcode) {
    return 1;
  } else if (acode < bcode) {
    return -1;
  }
  return 0;
}

function compareWatchDate(a, b) {
  acode =
    parseInt(a.startdate.substring(6, 8)) * 10000 +
    parseInt(a.startdate.substring(3, 5)) * 100 +
    parseInt(a.startdate.substring(0, 2));
  bcode =
    parseInt(b.startdate.substring(6, 8)) * 10000 +
    parseInt(b.startdate.substring(3, 5)) * 100 +
    parseInt(b.startdate.substring(0, 2));
  if (acode < 400000) acode += 1000000;
  if (bcode < 400000) bcode += 1000000;
  if (isNaN(acode)) acode = 0;
  if (isNaN(bcode)) bcode = 0;
  if (acode % 10000 == 0) acode += 1014;
  if (bcode % 10000 == 0) bcode += 1014;
  if (acode % 100 == 0) acode += 14;
  if (bcode % 100 == 0) bcode += 14;
  if (acode > bcode) {
    return 1;
  } else if (acode < bcode) {
    return -1;
  }
  return 0;
}

function compareDemog(a, b) {
  if (a.demog > b.demog) {
    return 1;
  } else if (a.demog < b.demog) {
    return -1;
  }
  return 0;
}

function compareRated(a, b) {
  if (a.rated > b.rated) {
    return 1;
  } else if (a.rated < b.rated) {
    return -1;
  }
  return 0;
}

function compareTimeCom(a, b) {
  if (a.status == "Completed" || a.episodes == 0) {
    return 1;
  }
  if (b.status == "Completed" || b.episodes == 0) {
    return -1;
  }
  let atime = a.episodes - a.watchedepisodes;
  let btime = b.episodes - b.watchedepisodes;
  switch (a.type) {
    case "Movie":
      atime *= avgMovie;
      break;
    case "TV Special":
      atime *= avgTVSP;
      break;
    default:
      atime *= avgTV;
      break;
  }
  switch (b.type) {
    case "Movie":
      btime *= avgMovie;
      break;
    case "TV Special":
      btime *= avgTVSP;
      break;
    default:
      btime *= avgTV;
      break;
  }
  if (atime > btime) {
    return 1;
  } else if (atime < btime) {
    return -1;
  }
  return 0;
}

function compareRewatched(a, b) {
  if (a.rewatched > b.rewatched) {
    return 1;
  } else if (a.rewatched < b.rewatched) {
    return -1;
  }
  return 0;
}

function comparePickupTime(a, b) {
  let ad = daycount(a.airenddate) - daycount(a.enddate);
  let bd = daycount(b.airenddate) - daycount(b.enddate);
  if (ad > bd) {
    return 1;
  } else if (ad < bd) {
    return -1;
  }
  return 0;
}

function compareTitleLength(a, b) {
  let al = a.title.length;
  let bl = b.title.length;
  if (al > bl) {
    return 1;
  } else if (al < bl) {
    return -1;
  }
  return 0;
}

function setCharAt(str, index, chr) {
  if (index < 0) return str;
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
}

function rep(str, index, str2) {
  let res = str;
  for (let i = 0; i < str2.length; i++) {
    res = setCharAt(res, index + i, str2[i]);
  }
  return res;
}

function parseThisText(txt) {
  let temp = rawfiledata;
  rawfiledata = txt;
  let ar = parseAllTextGen();
  rawfiledata = temp;
  return ar;
}

function parseAllMText() {
  data = [];
  let arrr = [];
  let tempsplitdata = rawfiledata.split("\n");
  if (tempsplitdata[0] == "Viewing Your Anime List\r") {
    return parseAllText();
  }
  let temp1splitdata = [];
  for (let i = 7; i < tempsplitdata.length - 2; i++) {
    const e = tempsplitdata[i];
    if (e.split("\t").length == 5) {
      temp1splitdata.push("^" + e);
    } else {
      temp1splitdata.push(e);
    }
  }
  let temp = "";
  for (let i = 0; i < temp1splitdata.length; i++) {
    temp += temp1splitdata[i] + "\n";
  }
  let stopReading = false;
  let splitdata = temp.split("^");
  splitdata.shift();
  let special = false;
  for (let i = 0; i < splitdata.length; i++) {
    const e = splitdata[i];
    let item = new Entry();
    index1 = e.indexOf("\t") + 2;
    index2 = e.indexOf("Edit - More");
    if (e.substring(index2 - 10, index2) == "Publishing") {
      item.airStatus = "Airing";
      index2 -= 11;
    } else if (e.substring(index2 - 17, index2) == "Not Yet Published") {
      item.airStatus = "Not Yet Aired";
      index2 -= 18;
    } else {
      item.airStatus = "Aired";
    }
    item.title = e.substring(index1, index2);

    let temp = e.substring(e.indexOf("Edit - More") + 12);
    index1 = temp.indexOf("\t");
    if (isNaN(temp.substring(0, index1))) {
      item.score = 0;
    } else {
      item.score = Number(temp.substring(0, index1));
    }

    temp = temp.substring(index1 + 3);
    if (temp.indexOf(" / ") != -1) {
      // Either Unread or Reading
      index1 = temp.indexOf(" / ");
      if (temp[0] == "-" && stopReading) {
        // Unread
        item.status = "Plan to Watch";
        item.watchedepisodes = 0;
      } else {
        // Reading
        item.status = "Watching";
        item.watchedepisodes = temp.substring(0, index1);
        if (isNaN(temp.substring(0, index1))) {
          item.watchedepisodes = 0;
        } else {
          item.watchedepisodes = Number(temp.substring(0, index1));
        }
      }
      index2 = temp.indexOf("\n");
      if (isNaN(temp.substring(index1 + 3, index2 - 2))) {
        item.episodes = item.watchedepisodes;
      } else {
        item.episodes = Number(temp.substring(index1 + 3, index2 - 2));
      }
      temp = temp.substring(index2 + 1);
      index1 = temp.indexOf("\n");
      temp = temp.substring(index1 + 1);
    } else {
      // Completed
      stopReading = true;
      item.status = "Completed";
      index1 = temp.indexOf("\n");
      item.watchedepisodes = Number(temp.substring(0, index1));
      item.episodes = Number(temp.substring(0, index1));
      temp = temp.substring(index1 + 1);
      index1 = temp.indexOf("\n");
      temp = temp.substring(index1 + 1);
    }
    if (item.watchedepisodes > maxWepisodes)
      maxWepisodes = item.watchedepisodes;
    if (item.episodes > maxEpisodes) maxEpisodes = item.episodes;

    index1 = temp.indexOf("\t");
    item.type = temp.substring(0, index1);

    temp = temp.substring(index1 + 1);

    index1 = temp.indexOf("\t");
    if (index1 == 0) {
      // No start available
      item.startdate = "";
    } else {
      // start available
      item.startdate = temp.substring(0, index1);
    }
    temp = temp.substring(index1 + 1);

    index1 = temp.indexOf("\t");
    if (index1 == 0) {
      // No end available
      item.enddate = "";
    } else {
      // end available
      item.enddate = temp.substring(0, index1);
    }
    temp = temp.substring(index1 + 1);

    index1 = temp.indexOf("\t");
    if (index1 == 0) {
      // No genre(s) available
      item.genres = [];
    } else {
      // At least one genre available
      item.genres = temp.substring(0, index1).split(", ");
      if (index1 > longestgenres) longestgenres = index1;
    }
    temp = temp.substring(index1 + 1);

    index1 = temp.indexOf("\t");
    if (index1 == 0) {
      // No demographic available
      item.demog = [];
    } else {
      // demographic available
      item.demog = temp.substring(0, index1).split(", ");
      if (index1 > longestdemog) longestdemog = index1;
    }
    temp = temp.substring(index1 + 1);

    index1 = temp.indexOf("\t");
    if (index1 == 0) {
      // No studio(s) available
      item.studios = [];
    } else {
      // At least one studio available
      item.studios = temp.substring(0, index1).split(", ");
      if (index1 > longeststudios) longeststudios = index1;
    }
    temp = temp.substring(index1 + 1);

    index1 = temp.indexOf("\t");
    if (index1 == 0) {
      // No air start available
      item.airstartdate = "";
    } else {
      // air start available
      item.airstartdate = temp.substring(0, index1);
    }
    temp = temp.substring(index1 + 1);

    index1 = temp.indexOf("\t");
    if (index1 == 0) {
      // No air end available
      item.airenddate = "";
    } else {
      // air end available
      item.airenddate = temp.substring(0, index1);
    }
    temp = temp.substring(index1 + 1);

    if (isNaN(temp)) {
      item.MALscore = 0;
    } else {
      item.MALscore = Number(temp);
    }
    arrr.push(item);
  }

  arrr.forEach((e) => {
    e.genres.sort();
  });

  let temparrr = arrr.toSorted(compareAirStart);
  for (let i = 0; i < temparrr.length; i++) {
    const e = temparrr[i];
    if (e.airstartdate != "") {
      dayzero = e.airstartdate;
      fve = e;
      break;
    }
  }

  return arrr;
}

function parseAllTextGen() {
  data = [];
  let arrr = [];
  let tempsplitdata = rawfiledata.split("\n");
  if (tempsplitdata[0] == "Viewing Your Manga List\r") {
    // return parseAllMTextGen();
    return parseAllMText();
  }
  let temp1splitdata = [];
  let x = 0;
  for (x = 0; x < tempsplitdata.length; x++) {
    if (tempsplitdata[x] == "ALL ANIME Stats  Filters\r") {
      break;
    }
  }
  // use content in tempsplitdata[x+1] to determine what parts exist
  let headerdata = tempsplitdata[x + 1].split("\t");
  headerdata[headerdata.length - 1] = headerdata[
    headerdata.length - 1
  ].substring(0, headerdata[headerdata.length - 1].length - 1);

  for (let i = x + 2; i < tempsplitdata.length - 2; i++) {
    if (tempsplitdata[i].split(/Edit - More|Add - More/).length == 2) {
      temp1splitdata.push("^" + tempsplitdata[i]);
    } else {
      temp1splitdata.push(tempsplitdata[i]);
    }
  }
  let temp = temp1splitdata.join("\n");
  let stopWatching = false;
  let splitdata = temp.split("^");
  let special = false;
  splitdata.shift();
  for (let i = 0; i < splitdata.length; i++) {
    const e = splitdata[i];
    let item = new Entry();
    let temp = e;
    let index1 = 0;
    if (headerdata.includes("#")) {
      // Number present
      index1 = temp.indexOf("\t");
      temp = temp.substring(index1 + 1);
    }
    if (headerdata.includes("Image")) {
      // Image "present" (obviously doesn't display in text, but it does add an extra tab)
      temp = temp.substring(1);
    }
    // let index2 = e.indexOf(/Edit - More|Add - More/);
    index1 = temp.split(/Edit - More|Add - More/)[0].length;
    if (temp.substring(index1 - 6, index1) == "Airing") {
      item.airStatus = "Airing";
      index1 -= 7;
    } else if (temp.substring(index1 - 13, index1) == "Not Yet Aired") {
      item.airStatus = "Not Yet Aired";
      index1 -= 14;
    } else {
      item.airStatus = "Aired";
    }
    item.title = temp.substring(0, index1 - 1);
    if (item.title.charAt(item.title.length - 1) == "Ⅱ") {
      item.title = item.title.substring(0, item.title.length - 1) + "II";
    }
    if (
      item.title.startsWith("Shinjiteita Nakama-tachi ni Dungeon Okuchi") ||
      item.title.startsWith("Backstabbed in a Backwater Dungeon")
    ) {
      item.title = "Backstabbed in a Backwater Dungeon";
    }
    for (let j = 0; j < item.title.length; j++) {
      const c = item.title[j];
      if (c.charCodeAt(0) == 8217) {
        item.title = setCharAt(item.title, j, "'");
      }
      if (c.charCodeAt(0) == 9733) {
        item.title = setCharAt(item.title, j, "*");
      }
    }
    index1 = temp.split(/Edit - More|Add - More/)[0].length;
    temp = temp.substring(index1 + 11);
    if (
      temp.charAt(0) == "\r" &&
      (headerdata.includes("Score") || headerdata.includes("Type"))
    ) {
      // Notes
      index1 = temp.indexOf("\r\n");
      temp = temp.substring(index1 + 2);
    } else {
      temp = temp.substring(1);
    }

    if (temp.substring(0, 9) == "Add notes") {
      index1 = temp.indexOf("\r\n");
      temp = temp.substring(index1 + 2);
    }

    if (headerdata.includes("Score")) {
      // score
      index1 = temp.indexOf("\t");
      if (isNaN(temp.substring(0, index1))) {
        item.score = 0;
      } else {
        item.score = Number(temp.substring(0, index1));
      }

      temp = temp.substring(index1 + 1);
    }
    if (headerdata.includes("Type")) {
      // Type
      index1 = temp.indexOf("\t");
      item.type = temp.substring(0, index1);
      temp = temp.substring(index1 + 1);
    }
    if (headerdata.includes("Progress")) {
      // Progress
      temp = temp.substring(2);
      if (temp.indexOf(" / ") != -1) {
        // Either Unwatched or Watching
        index1 = temp.indexOf(" / ");
        if (temp[0] == "-" && stopWatching) {
          // Only for Unwatched things
          item.status = "Plan to Watch";
          item.watchedepisodes = 0;
        } else {
          // Only for Watching things
          item.status = "Watching";
          item.watchedepisodes = temp.substring(0, index1);
          if (isNaN(temp.substring(0, index1))) {
            item.watchedepisodes = 0;
          } else {
            item.watchedepisodes = Number(temp.substring(0, index1));
          }
        }
        let index2 = temp.indexOf("\n");
        if (isNaN(temp.substring(index1 + 3, index2 - 2))) {
          item.episodes = item.watchedepisodes;
        } else {
          item.episodes = Number(temp.substring(index1 + 3, index2 - 2));
        }
        temp = temp.substring(index2 + 1);
      } else {
        // Completed
        stopWatching = true;
        item.status = "Completed";
        index1 = temp.indexOf("\n");
        item.watchedepisodes = Number(temp.substring(0, index1));
        item.episodes = Number(temp.substring(0, index1));
        temp = temp.substring(index1 + 1);
      }
      if (item.watchedepisodes > maxWepisodes)
        maxWepisodes = item.watchedepisodes;
      if (item.episodes > maxEpisodes) maxEpisodes = item.episodes;
    }
    if (headerdata.includes("Started Date")) {
      // startdate
      index1 = temp.indexOf("\t");
      if (isDate(temp.substring(0, 8))) {
        if (index1 == 0) {
          item.startdate = "";
        } else {
          item.startdate = temp.substring(0, index1);
        }
        temp = temp.substring(index1 + 1);
      } else {
        item.startdate = "";
      }
    }
    if (headerdata.includes("Finished Date")) {
      // enddate
      index1 = temp.indexOf("\t");
      if (isDate(temp.substring(0, 8)) || index1 == 0) {
        if (index1 == 0) {
          item.enddate = "";
        } else {
          item.enddate = temp.substring(0, index1);
        }
        temp = temp.substring(index1 + 1);
      } else {
        item.enddate = "";
      }
    }
    if (headerdata.includes("Days")) {
      // useless information
      index1 = temp.indexOf("\t");
      if (!isNaN(temp.substring(0, index1))) {
        temp = temp.substring(index1 + 1);
      }
    }

    if (headerdata.includes("Premiered")) {
      // premiered
      index1 = temp.indexOf("\t");
      if (
        isNaN(temp.substring(index1 - 4, index1)) ||
        temp.substring(index1 - 4, index1) == ""
      ) {
        // No premiere date available
        item.premiered = "";
      } else {
        // Premiere data available
        item.premiered = temp.substring(0, index1);
        temp = temp.substring(index1 + 1);
      }
    }
    if (headerdata.includes("Tags")) {
      // useless information
      index1 = temp.indexOf("\r\n", 1);
      temp = temp.substring(index1 + 2);
    }
    let concern = false;
    if (headerdata.includes("Genres")) {
      // genres
      index1 = temp.indexOf("\t");
      let temp1 = temp.substring(0, index1);
      if (!lookslikegenre(temp1)) {
        // bro dont have any genre
        concern = true;
        item.genres = [];
      } else {
        if (index1 == 0) {
          // No genre(s) available
          item.genres = [];
        } else {
          // At least one genre available
          item.genres = temp.substring(0, index1).split(", ");
          if (index1 > longestgenres) longestgenres = index1;
        }
        temp = temp.substring(index1 + 1);
      }
    }
    if (headerdata.includes("Demogr.")) {
      // demog
      index1 = temp.indexOf("\t");
      let temp1 = temp.substring(0, index1);
      if (!lookslikedemog(temp1) && concern) {
        // no demog :(
        item.demog = [];
      } else {
        if (index1 == 0) {
          // No demographic available
          item.demog = [];
        } else {
          // demographic available
          item.demog = temp.substring(0, index1).split(", ");
          if (index1 > longestdemog) longestdemog = index1;
        }
        temp = temp.substring(index1 + 1);
      }
    }
    if (headerdata.includes("Studios")) {
      // studios
      index1 = temp.indexOf("\t");
      if (index1 == 0) {
        // No studio(s) available
        item.studios = [];
      } else {
        // At least one studio available
        item.studios = temp.substring(0, index1).split(", ");
        if (index1 > longeststudios) longeststudios = index1;
      }
      temp = temp.substring(index1 + 1);
    }
    if (headerdata.includes("Licensors")) {
      // licensors
      index1 = temp.indexOf("\t");
      if (index1 == 0) {
        // No licensors(s) available
        item.licensors = [];
      } else {
        // At least one licensor available
        item.licensors = temp.substring(0, index1).split(", ");
        if (index1 > longestlicensors) longestlicensors = index1;
      }
      temp = temp.substring(index1 + 1);
    }
    if (headerdata.includes("Storage")) {
      // useless information
      index1 = temp.indexOf("\t");
      temp = temp.substring(index1 + 1);
    }
    if (headerdata.includes("Air Start")) {
      // airstartdate
      index1 = temp.indexOf("\t");
      if (index1 == 0) {
        // No air start available
        item.airstartdate = "";
      } else {
        // air start available
        item.airstartdate = temp.substring(0, index1);
      }
      temp = temp.substring(index1 + 1);
    } else {
      item.airstartdate = "";
    }
    if (headerdata.includes("Air End")) {
      // airenddate
      index1 = temp.indexOf("\t");
      // Default air finish to undefined
      item.airenddate = "";
      if (index1 == 0) {
        // No air end available
        if (item.airStatus == "Airing") {
          // Item is airing
          if (item.episodes != 0) {
            // Episode Count is known, so count out how long it will be until it finishes, assuming one episode releases every 7 days
            if (
              daycount(
                ndaysafter(item.airstartdate, (item.episodes - 1) * 7)
              ) >= 0 &&
              item.airStatus == "Airing"
            ) {
              // Predicted end date already passed, but item is not complete yet, obviously prediction was wrong
            } else {
              item.airenddate = ndaysafter(
                item.airstartdate,
                (item.episodes - 1) * 7
              );
            }
          } else {
            // Episode Count is not known, assume that there will be 12 episodes and count out from there
            if (daycount(item.airstartdate) < 75) {
              // Started less than 12 weeks ago, assume 12 episodes such that it will end at some point in the future
              item.airenddate = ndaysafter(item.airstartdate, 11 * 7);
            } else {
              // Difficult to say how many episodes there will be
            }
          }
          // Make one up if airing (REMOVED)
          // item.airenddate = curdate;
        } else if (item.airStatus == "Not Yet Aired") {
          // item is not yet aired
          if (
            item.airstartdate.substring(3, 5) != "00" &&
            item.airstartdate != ""
          ) {
            // At the very least the month is defined, which allows us to usually be within 7 days of the correct value
            if (item.episodes != 0) {
              // Despite not existing yet, we already know the number of episodes and the start date
              item.airenddate = ndaysafter(
                item.airstartdate,
                (item.episodes - 1) * 7
              );
            } else {
              // We know the start date but not the number of episodes, use 12
              item.airenddate = ndaysafter(item.airstartdate, 11 * 7);
            }
          }
        }
      } else {
        // air end available
        item.airenddate = temp.substring(0, index1);
      }
      temp = temp.substring(index1 + 1);
    } else {
      item.airenddate = "";
    }
    if (headerdata.includes("Rated")) {
      // rated
      index1 = temp.indexOf("\t");
      if (index1 == 0) {
        // No rating available
        item.rated = "";
      } else {
        // rating available
        item.rated = temp.substring(0, index1);
      }
      temp = temp.substring(index1 + 1);
    }
    if (headerdata.includes("MAL Score")) {
      // MALscore
      index1 = temp.split(/\t|\r\n/)[0].length;
      let temp1 = temp.substring(0, index1);
      if (isNaN(temp1)) {
        item.MALscore = 0;
      } else {
        item.MALscore = Number(temp1);
      }
      temp = temp.substring(index1 + 1);
    }
    arrr.push(item);
  }
  let redict = localStorage.getItem("rewatched");
  if (redict != null) {
    redict = JSON.parse(redict);
  } else {
    redict = {};
  }
  // arrr.sort(compareMALScore).reverse();
  // let i = 1;
  arrr.forEach((e) => {
    // e.ranking = i++;
    e.genres.sort();
    if (redict[e.title] != undefined) {
      e.rewatched = redict[e.title];
    } else {
      redict[e.title] = 0;
    }
  });
  localStorage.setItem("rewatched", JSON.stringify(redict));

  let temparrr = arrr.toSorted(compareAirStart);
  for (let i = 0; i < temparrr.length; i++) {
    const e = temparrr[i];
    if (e.airstartdate != "") {
      dayzero = e.airstartdate;
      fve = e;
      break;
    }
  }

  return arrr;
}

function parseAllText() {
  data = [];
  let arrr = [];
  let tempsplitdata = rawfiledata.split("\n");
  if (tempsplitdata[0] == "Viewing Your Manga List\r") {
    return parseAllMText();
  }
  let temp1splitdata = [];
  for (let i = 7; i < tempsplitdata.length - 2; i++) {
    const e = tempsplitdata[i];
    if (e.split("\t").length == 6) {
      temp1splitdata.push("^" + e);
    } else {
      temp1splitdata.push(e);
    }
  }
  let temp = temp1splitdata.join("\n");
  let stopWatching = false;
  let splitdata = temp.split("^");
  splitdata.shift();
  let special = false;
  for (let i = 0; i < splitdata.length; i++) {
    const e = splitdata[i];
    let item = new Entry();
    index1 = e.indexOf("\t") + 2;
    index2 = e.indexOf("Edit - More");
    if (e.substring(index2 - 6, index2) == "Airing") {
      item.airStatus = "Airing";
      index2 -= 7;
    } else if (e.substring(index2 - 13, index2) == "Not Yet Aired") {
      item.airStatus = "Not Yet Aired";
      index2 -= 14;
    } else {
      item.airStatus = "Aired";
    }
    item.title = e.substring(index1, index2 - 1);
    if (item.title.charAt(item.title.length - 1) == "Ⅱ") {
      item.title = item.title.substring(0, item.title.length - 1) + "II";
    }

    for (let j = 0; j < item.title.length; j++) {
      const c = item.title[j];
      if (c.charCodeAt(0) == 8217) {
        item.title = setCharAt(item.title, j, "'");
      }
    }

    let temp = e.substring(e.indexOf("Edit - More") + 12);
    index1 = temp.indexOf("\t");
    if (isNaN(temp.substring(0, index1))) {
      item.score = 0;
    } else {
      item.score = Number(temp.substring(0, index1));
    }

    temp = temp.substring(index1 + 1);
    index1 = temp.indexOf("\t");
    item.type = temp.substring(0, index1);

    temp = temp.substring(index1 + 3);
    if (temp.indexOf(" / ") != -1) {
      // Either Unwatched or Watching
      index1 = temp.indexOf(" / ");
      if (temp[0] == "-" && stopWatching) {
        // Only for Unwatched things
        item.status = "Plan to Watch";
        item.watchedepisodes = 0;
      } else {
        // Only for Watching things
        item.status = "Watching";
        item.watchedepisodes = temp.substring(0, index1);
        if (isNaN(temp.substring(0, index1))) {
          item.watchedepisodes = 0;
        } else {
          item.watchedepisodes = Number(temp.substring(0, index1));
        }
      }
      index2 = temp.indexOf("\n");
      if (isNaN(temp.substring(index1 + 3, index2 - 2))) {
        item.episodes = item.watchedepisodes;
      } else {
        item.episodes = Number(temp.substring(index1 + 3, index2 - 2));
      }
      temp = temp.substring(index2 + 1);
    } else {
      // Completed
      stopWatching = true;
      item.status = "Completed";
      index1 = temp.indexOf("\n");
      item.watchedepisodes = Number(temp.substring(0, index1));
      item.episodes = Number(temp.substring(0, index1));
      temp = temp.substring(index1 + 1);
    }
    if (item.watchedepisodes > maxWepisodes)
      maxWepisodes = item.watchedepisodes;
    if (item.episodes > maxEpisodes) maxEpisodes = item.episodes;

    if (temp[8] == "\t" && temp[2] == "-") {
      // Either some start date or some end date or both are available
      if (temp[17] == "\t") {
        // Both are available
        item.startdate = temp.substring(0, 8);
        item.enddate = temp.substring(9, 17);
        temp = temp.substring(18);
      } else {
        // Only one is available, impossible to tell for certain which (This should be a very uncommon case, maybe 3 times total)
        if (item.status == "Watching") {
          // Almost certain that the date is the start
          item.startdate = temp.substring(0, 8);
          item.enddate = "";
          temp = temp.substring(1);
        } else {
          item.startdate = "";
          item.enddate = temp.substring(0, 8);
        }
        temp = temp.substring(9);
      }
    } else {
      item.startdate = "";
      item.enddate = "";
    }

    index1 = temp.indexOf("\t");
    if (isNaN(temp.substring(index1 - 4, index1))) {
      // No premiere date available
      item.premiered = "";
    } else {
      // Premiere data available
      item.premiered = temp.substring(0, index1);
      temp = temp.substring(index1 + 1);
    }

    index1 = temp.indexOf("\t");
    if (index1 == 0) {
      // No genre(s) available
      item.genres = [];
    } else {
      // At least one genre available
      item.genres = temp.substring(0, index1).split(", ");
      if (index1 > longestgenres) longestgenres = index1;
    }
    temp = temp.substring(index1 + 1);

    index1 = temp.indexOf("\t");
    if (index1 == 0) {
      // No demographic available
      item.demog = [];
    } else {
      // demographic available
      item.demog = temp.substring(0, index1).split(", ");
      if (index1 > longestdemog) longestdemog = index1;
    }
    temp = temp.substring(index1 + 1);

    index1 = temp.indexOf("\t");
    if (index1 == 0) {
      // No studio(s) available
      item.studios = [];
    } else {
      // At least one studio available
      item.studios = temp.substring(0, index1).split(", ");
      if (index1 > longeststudios) longeststudios = index1;
    }
    temp = temp.substring(index1 + 1);

    index1 = temp.indexOf("\t");
    if (index1 == 0) {
      // No licensors(s) available
      item.licensors = [];
    } else {
      // At least one licensor available
      item.licensors = temp.substring(0, index1).split(", ");
      if (index1 > longestlicensors) longestlicensors = index1;
    }
    temp = temp.substring(index1 + 1);

    index1 = temp.indexOf("\t");
    if (index1 == 0) {
      // No air start available
      item.airstartdate = "";
    } else {
      // air start available
      item.airstartdate = temp.substring(0, index1);
    }
    temp = temp.substring(index1 + 1);

    index1 = temp.indexOf("\t");
    // Default air finish to undefined
    item.airenddate = "";
    if (index1 == 0) {
      // No air end available
      if (item.airStatus == "Airing") {
        // Item is airing
        if (item.episodes != 0) {
          // Episode Count is known, so count out how long it will be until it finishes, assuming one episode releases every 7 days
          if (
            daycount(ndaysafter(item.airstartdate, (item.episodes - 1) * 7)) >=
              0 &&
            item.airStatus == "Airing"
          ) {
            // Predicted end date already passed, but item is not complete yet, obviously prediction was wrong
          } else {
            item.airenddate = ndaysafter(
              item.airstartdate,
              (item.episodes - 1) * 7
            );
          }
        } else {
          // Episode Count is not known, assume that there will be 12 episodes and count out from there
          if (daycount(item.airstartdate) < 75) {
            // Started less than 12 weeks ago, assume 12 episodes such that it will end at some point in the future
            item.airenddate = ndaysafter(item.airstartdate, 11 * 7);
          } else {
            // Difficult to say how many episodes there will be
          }
        }
        // Make one up if airing (REMOVED)
        // item.airenddate = curdate;
      } else if (item.airStatus == "Not Yet Aired") {
        // item is not yet aired
        if (
          item.airstartdate.substring(3, 5) != "00" &&
          item.airstartdate != ""
        ) {
          // At the very least the month is defined, which allows us to usually be within 7 days of the correct value
          if (item.episodes != 0) {
            // Despite not existing yet, we already know the number of episodes and the start date
            item.airenddate = ndaysafter(
              item.airstartdate,
              (item.episodes - 1) * 7
            );
          } else {
            // We know the start date but not the number of episodes, use 12
            item.airenddate = ndaysafter(item.airstartdate, 11 * 7);
          }
        }
      }
    } else {
      // air end available
      item.airenddate = temp.substring(0, index1);
    }
    temp = temp.substring(index1 + 1);

    index1 = temp.indexOf("\t");
    if (index1 == 0) {
      // No rating available
      item.rated = "";
    } else {
      // rating available
      item.rated = temp.substring(0, index1);
    }
    temp = temp.substring(index1 + 1);

    if (isNaN(temp)) {
      item.MALscore = 0;
    } else {
      item.MALscore = Number(temp);
    }
    arrr.push(item);
  }
  let redict = localStorage.getItem("rewatched");
  if (redict != null) {
    redict = JSON.parse(redict);
  } else {
    redict = {};
  }
  // arrr.sort(compareMALScore).reverse();
  // let i = 1;
  arrr.forEach((e) => {
    // e.ranking = i++;
    e.genres.sort();
    if (redict[e.title] != undefined) {
      e.rewatched = redict[e.title];
    } else {
      redict[e.title] = 0;
    }
  });
  localStorage.setItem("rewatched", JSON.stringify(redict));

  let temparrr = arrr.toSorted(compareAirStart);
  for (let i = 0; i < temparrr.length; i++) {
    const e = temparrr[i];
    if (e.airstartdate != "") {
      dayzero = e.airstartdate;
      fve = e;
      break;
    }
  }

  return arrr;
}

function lookslikedemog(str) {
  if (str.length == 0) {
    return true;
  }
  result = true;
  for (let word of str.split(", ")) {
    if (!["Shounen", "Seinen", "Shoujo", "Josei"].includes(word)) {
      result = false;
    }
  }
  return result;
}

function lookslikegenre(str) {
  if (str.length == 0) {
    return true;
  }
  result = true;
  for (let word of str.split(", ")) {
    if (!filtboxarray[5].includes(word)) {
      result = false;
    }
  }
  return result;
}

function placeSortSelector() {
  for (let i = 0; i < sortOptions.length; i++) {
    const header = document.createElement("option");
    header.textContent = sortOptions[i];
    sortselector.insertBefore(header, sortselector.childNodes[0]);
  }
  sortselector.value = "by MAL Score";
}

function generalinit() {
  mainbody = document.getElementById("mainbody");
  chfilebutton = document.getElementById("chfilebutton");
  inputfile = document.getElementById("inputfile");
  foldselector = document.getElementById("folder-select");
  sortselector = document.getElementById("sort-select");
  mainbody.style = "background-color:rgb(18,18,18);";
  p = document.getElementById("outputp");
  d = document.getElementById("outputd");
  let links = document.createElement("div");
  links.style.color = "rgb(18,18,18)";
  links.innerHTML = `
  <a href="index.html">Normal</a>|||||
  <a href="advFilter.html">AdvFiltering</a>|||||
  <a href="grouping.html">Grouping</a>|||||
  <a href="Timeline.html">Timeline</a>|||||
  <a href="TimelineD.html">Timeline - by Day</a>|||||
  <a href="TimelineW.html">Timeline - by Watched Day</a>|||||
  <a href="WatchGraph.html">Watch Graph</a>|||||
  <a href="recent.html">Recent</a>|||||
  <a href="rewatched.html">Rewatched</a>|||||
  <a href="LATG.html">Custom Graph</a>|||||
  <a href="CountGraph.html">Count Graph</a>|||||
  <a href="stats.html">Stats</a>|||||
  `;
  mainbody.insertBefore(links, mainbody.childNodes[0]);
  if (sortselector != null) sortselector.hidden = true;
  if (chfilebutton != null) chfilebutton.hidden = true;
  if (foldselector != null) foldselector.hidden = true;
  if (inputfile != null) inputfile.hidden = false;
  rawfiledata = localStorage.getItem("rawdata");
  if (sortselector != null)
    sortselector.addEventListener("change", function () {
      display();
    });
  if (inputfile != null)
    inputfile.addEventListener("change", function () {
      let fr = new FileReader();
      fr.onload = function () {
        // rawfiledata = fr.result;
        newfiledata = fr.result;
        oldfiledata = rawfiledata;
        compareDatas(oldfiledata, newfiledata);
        inputfile.value = "";
        // localStorage.setItem("rawdata", fr.result);
        // start();
      };

      fr.readAsText(this.files[0]);
    });

  if (rawfiledata != null) start();
}

function compareDatas(olddata, newdata) {
  inputfile.hidden = true;
  erasePD(); // Erase all text on screen
  let continueButton = document.createElement("button");
  continueButton.innerText = "Continue";
  if (olddata != newdata) {
    // At least one change made
    p.innerHTML += "Differences: ";
    console.log("Datas are different :)");
    localStorage.setItem("olddata", olddata);
    localStorage.setItem("rawdata", newdata);
    continueButton.onclick = function () {
      localStorage.setItem("rawdata", newdata);
      rawfiledata = newdata;
      start();
    };
  } else {
    // no changes made
    console.log("Datas are the same :(");
    olddata = localStorage.getItem("olddata");
    continueButton.onclick = function () {
      start();
    };
    p.innerHTML += "No Changes in Data, Reporting Old Differences: ";
  }
  let datold = makeThisDatas(olddata);
  // datold = rankThisAll(datold);
  let datnew = makeThisDatas(newdata);
  // datnew = rankThisAll(datnew);
  ood = datold.toSorted(compareTitles).toSorted(compareMALScore).reverse();
  ond = datnew.toSorted(compareTitles).toSorted(compareMALScore).reverse();
  if (datold.length > datnew.length) {
    console.log("bro removed an entri(es)");
  }
  if (datold.length < datnew.length) {
    console.log("bro added an entri(es)");
  }
  for (let e1 of datnew) {
    e2 = findEinD(e1, datold);
    // Check for newly added entries (in new data but not old data)
    if (e2 == null) {
      // seems something is lacking in old data, must have been added
      let pr = document.createElement("pre");
      pr.innerText =
        e1.title +
        ":\n\tAdded\n\tStatus: " +
        e1.status +
        ", " +
        e1.airStatus +
        "\n\t" +
        e1.episodes +
        "ep";
      pr.style.color = colors.Watching;
      insert(d, pr);
    }
  }
  let MALChangeList = [];
  let upCount = 0;
  let downCount = 0;
  for (let e1 of datold) {
    e2 = findEinD(e1, datnew);
    // Check for removed entries (in old data but not in new)
    if (e2 == null) {
      // seems something is lacking in new data, must have been removed
      let pr = document.createElement("pre");
      pr.innerText = e1.title + ":\n\tRemoved";
      pr.style.color = "red";
      insert(d, pr);
    } else {
      // current entry is in both sets of data
      let res = compareEntries(e1, e2);
      // res == true means no difference between e1 and e2
      // res == [] means at least one change
      if (res != true) {
        oldplace = ood.indexOf(e1);
        newplace = ond.indexOf(e2);
        if (
          justMALDiff(res) &&
          (oldplace == newplace ||
            Math.abs(Math.round((e1.MALscore - e2.MALscore) * 100) / 100) <
              0.02)
        ) {
          // item only differs in MALScore :(
          MALChangeList.push([
            e1.title,
            Math.round((e1.MALscore - e2.MALscore) * 100) / 100,
          ]);
          if (e1.MALscore > e2.MALscore) {
            upCount++;
          } else {
            downCount++;
          }
        } else {
          // element has 1+ difference(s)
          let pr = document.createElement("pre");
          pr.innerText = e1.title;
          insert(d, pr);
          if (
            oldplace != newplace &&
            Math.abs(Math.round((e1.MALscore - e2.MALscore) * 100) / 100) >=
              0.02
          ) {
            // ranking change
            let pr1 = document.createElement("pre");
            let mystr = "";
            mystr += "#" + oldplace + " ";
            if (oldplace > newplace) {
              mystr += "up";
              pr1.style.color = colors.Watching;
            } else {
              mystr += "down";
              pr1.style.color = "red";
            }
            mystr += " to #" + newplace;
            pr1.innerText = "\t" + mystr;
            insert(d, pr1);
          }
          for (let i = 0; i < res.length; i++) {
            let elem = res[i];
            if (elem == false) {
              let pr1 = document.createElement("pre");
              let str1 = Object.entries(e1)[i][0] + ": ";
              if (Object.entries(e1)[i][0] == "status") {
                switch (Object.entries(e2)[i][1]) {
                  case "Watching":
                    pr1.style.color = colors.Watching;
                    break;
                  case "Completed":
                    pr1.style.color = colors.Completed;
                    break;
                  case "On-Hold":
                    pr1.style.color = colors["On-Hold"];
                    break;
                  case "Dropped":
                    pr1.style.color = colors.Dropped;
                    break;
                  case "Plan to Watch":
                    pr1.style.color = colors.Aired;
                    break;
                  default:
                    pr1.style.color = colors.Aired;
                    break;
                }
              } else if (Object.entries(e1)[i][0] == "genres") {
                if (
                  Object.entries(e1)[i][1].length <
                  Object.entries(e2)[i][1].length
                ) {
                  pr1.style.color = colors.Watching;
                } else if (
                  Object.entries(e1)[i][1].length >
                  Object.entries(e2)[i][1].length
                ) {
                  pr1.style.color = "red";
                }
              } else {
                if (Object.entries(e1)[i][1] < Object.entries(e2)[i][1]) {
                  pr1.style.color = colors.Watching;
                } else if (
                  Object.entries(e1)[i][1] > Object.entries(e2)[i][1]
                ) {
                  pr1.style.color = "red";
                }
              }
              if (
                isDate(Object.entries(e1)[i][1]) ||
                isDate(Object.entries(e2)[i][1])
              ) {
                str1 += defaultdatetoreadable(Object.entries(e1)[i][1]);
                str1 += " -> ";
                str1 += defaultdatetoreadable(Object.entries(e2)[i][1]);
              } else if (Object.entries(e1)[i][0] == "genres") {
                for (let among of Object.entries(e1)[i][1]) {
                  if (!Object.entries(e2)[i][1].includes(among)) {
                    str1 += "-" + among;
                  }
                }
                for (let among of Object.entries(e2)[i][1]) {
                  if (!Object.entries(e1)[i][1].includes(among)) {
                    str1 += "+" + among;
                  }
                }
              } else {
                str1 += Object.entries(e1)[i][1];
                str1 += " -> ";
                str1 += Object.entries(e2)[i][1];
              }
              pr1.innerText = "\t" + str1;
              insert(d, pr1);
            }
          }
        }
      }
    }
  }
  let pr = document.createElement("pre");
  pr.innerHTML = "&#8648;: " + upCount + " &#8650;: " + downCount;
  insert(d, pr);
  console.log(MALChangeList);
  insert(d, continueButton);
}

function justMALDiff(MALIter) {
  if (MALIter[1] == false && MALIter[0] == true) {
    let result = true;
    for (let i = 2; i < MALIter.length; i++) {
      result = result && MALIter[i];
    }
    return result;
  }
  return false;
}

function placeChange(odat, ndat, e) {}

function isDate(str) {
  if (str[2] == "-" && str[5] == "-") {
    return true;
  }
  return false;
}

function isIterable(obj) {
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === "function" && typeof obj != "string";
}

function allBoolTrue(alliter) {
  let result = true;
  for (let e of alliter) {
    result = result && e;
  }
  return result;
}

function compareEntries(e1, e2) {
  let boolarr = [];
  for (let i = 0; i < Object.entries(e1).length; i++) {
    let e = Object.entries(e1)[i];
    let ee = Object.entries(e2)[i];
    if (isIterable(e[1])) {
      let alsoboolarr = [];
      for (let j in e[1]) {
        let element1 = e[1][j];
        let element2 = ee[1][j];
        if (element1 == element2) {
          alsoboolarr[j] = true;
        } else {
          alsoboolarr[j] = false;
        }
      }
      if (allBoolTrue(alsoboolarr)) {
        boolarr[i] = true;
      } else {
        boolarr[i] = false;
      }
    } else {
      if (e[1] == ee[1]) {
        boolarr[i] = true;
      } else {
        boolarr[i] = false;
      }
    }
  }
  if (allBoolTrue(boolarr)) {
    boolarr = true;
  } else {
    boolarr = boolarr;
  }
  return boolarr;
}

function findEinD(e, d) {
  let foundEl = null;
  for (let el of d) {
    if (e.title == el.title) {
      // Found Matching title, could have changed data though
      foundEl = el;
    }
  }
  return foundEl;
}

function makeThisDatas(txt) {
  let arrr = parseThisText(txt);
  let prevE = arrr[0];
  let onholding = false;
  let counter = 0;
  let thisdatas = [];
  for (let i = 0; i < arrr.length; i++) {
    const element = arrr[i];
    thisdatas.push(element);
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
      counter++;
      element.status = "On-Hold";
    }
    prevE = element;
  }
  return thisdatas;
}

function erasePD() {
  d.innerHTML = "";
  p.innerHTML = "";
}

function entryFromTitle(title) {
  if (data[0][0] == "Completed") {
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i][1].length; j++) {
        const e = data[i][1][j];
        if (e.title == title) {
          return e;
        }
      }
    }
  } else {
    for (let i = 0; i < data.length; i++) {
      const e = data[i];
      if (e.title == title) {
        return e;
      }
    }
  }
  return -1;
}

var rows = 6;
function placeFiltBoxes() {
  let filtbox = document.getElementById("filtbox");
  for (let i = 0; i < filtboxarray.length; i++) {
    const e = filtboxarray[i];
    for (let k = 0; k < Math.ceil(e.length / rows); k++) {
      let newdiv = document.createElement("div");
      for (let j = rows * k; j < Math.min(rows * (k + 1), e.length); j++) {
        const e1 = e[j];
        let checkdiv = document.createElement("div");
        checkdiv.className = "checkboxes";
        let newcheckbox = document.createElement("input");
        newcheckbox.type = "checkbox";
        newcheckbox.id = e1;
        newcheckbox.value = e1;
        let newlabel = document.createElement("label");
        newlabel.setAttribute("for", e1);
        newlabel.innerText = e1;
        insert(checkdiv, newcheckbox);
        insert(checkdiv, newlabel);
        insert(newdiv, checkdiv);
      }
      insert(filtbox, newdiv);
      if (k == Math.ceil(e.length / rows) - 1) newdiv.className = "columni";
    }
  }
}

function insert(container, item) {
  container.insertBefore(
    item,
    container.childNodes[container.childNodes.length]
  );
}

function makeDatas() {
  let arrr = parseAllTextGen();
  let prevE = arrr[0];
  let onholding = false;
  let counter = 0;
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
      counter++;
      element.status = "On-Hold";
    }
    prevE = element;
  }
  rankAll();
  console.log(`On-Hold Counter: ${counter}`);
}

function markRewatched(title) {
  let e = entryFromTitle(title);
  if (e != -1) {
    let dict = localStorage.getItem("rewatched");
    if (dict == null) {
      dict = {};
    } else {
      dict = JSON.parse(dict);
    }
    dict[title] = 1;
    let output = JSON.stringify(dict);
    localStorage.setItem("rewatched", output);
  } else {
    console.log(title + " not found");
  }
}

function rankAll() {
  let tempData = data.toSorted(compareMALScore).reverse();
  let j = 1;
  for (let i = 0; i < tempData.length; i++) {
    const e = tempData[i];
    const f = entryFromTitle(e.title);
    if (f.MALscore != 0) f.ranking = j++;
    else f.ranking = j;
  }
}

function rankThisAll(dat) {
  let temp = data;
  data = dat;
  let tempData = data.toSorted(compareMALScore).reverse();
  let j = 1;
  for (let i = 0; i < tempData.length; i++) {
    const e = tempData[i];
    const f = entryFromTitle(e.title);
    if (f.MALscore != 0) f.ranking = j++;
    else f.ranking = j;
  }
  let temp1 = data;
  data = temp;
  return temp1;
}

function distByWatchDate() {
  myArray = [];
  myArraysplit = [];
  let dayzero1;
  let fve1;
  data.sort(compareWatchDate);
  for (let i = 0; i < data.length; i++) {
    const e = data[i];
    if (e.startdate != "") {
      dayzero1 = daycount(e.startdate);
      fve1 = e;
      break;
    }
  }
  for (let i = 0; i <= dayzero1; i++) {
    myArray[i] = [];
    myArraysplit[i] = [];
  }
  for (let i = data.indexOf(fve1); i < data.length; i++) {
    const e = data[i];
    let x = dayzero1 - daycount(e.startdate);
    let y = dayzero1 - daycount(e.enddate);
    myArray[x].push(e);
    for (let j = x; j <= y; j++) {
      myArraysplit[j].push(e);
    }
    if (myArray[x].length > maxwatched) maxwatched = myArray[x].length;
  }
}

function displayInCurOrder() {
  d.innerHTML = "";
  p.innerHTML = "";
  for (const e of data) {
    let tempstr = e.title;
    const pr = document.createElement("pre");
    pr.innerHTML = "<b>" + tempstr + "</b>";
    pr.childNodes[0].innerText = tempstr;
    pr.childNodes[0].onclick = function () {
      localStorage.setItem("transfer", e.title);
      window.open("Details.html", "_blank").focus();
    };
    switch (e.status) {
      case "Completed":
        pr.style.color = colors.Completed;
        break;
      case "Watching":
        pr.style.color = colors.Watching;
        break;
      case "On-Hold":
        if (isEntryNextWatch(e)) {
          pr.style.color = colors["On-Hold"];
        } else {
          pr.style.color = colors.Sequel;
        }
        break;
      case "Dropped":
        pr.style.color = colors.Dropped;
        break;
      case "Plan to Watch":
        if (e.airStatus == "Aired") {
          if (isEntryNextWatch(e)) {
            pr.style.color = colors.Aired;
          } else {
            pr.style.color = colors.Sequel;
          }
        } else if (e.airStatus == "Not Yet Aired") {
          pr.style.color = colors.NotAired;
        } else if (e.airStatus == "Airing") {
          pr.style.color = colors.Airing;
        }
        break;
      default:
        break;
    }
    insert(d, pr);
  }
  p.textContent = "Title";
}

function bubbleSort(comparison) {
  let n = data.length;
  let swapped = true;
  while (swapped) {
    swapped = false;
    for (let i = 1; i < n; i++) {
      if (comparison(data[i - 1], data[i]) == 1) {
        swap(i - 1, i);
        swapped = true;
      }
    }
    n--;
  }
}

var bubbleN = 0;
var bubbleSwapped;
var bubbleComparison;
var bubbleI;
function startStepBubbleSort(comparison) {
  bubbleN = data.length;
  bubbleSwapped = true;
  bubbleComparison = comparison;
  stepBubbleSort();
}

function swap(i, j) {
  let temp = data[i];
  data[i] = data[j];
  data[j] = temp;
  window.scrollTo(0, i * 17);
  displayInCurOrder();
}

function stepBubbleSort() {
  bubbleSwapped = 0;
  bubbleI = 1;
  stepStepBubbleSort();
}

function stepBubbleRemainder() {
  bubbleN = bubbleSwapped;
  console.log("pass " + (data.length - bubbleN) + " complete");
  if (bubbleSwapped) {
    setTimeout(function () {
      stepBubbleSort();
    }, 1);
  } else {
    console.log("Done");
  }
}

function stepStepBubbleSort() {
  if (bubbleComparison(data[bubbleI - 1], data[bubbleI]) == -1) {
    swap(bubbleI - 1, bubbleI);
    bubbleSwapped = bubbleI;
  }
  bubbleI++;
  displayInCurOrder();
  if (bubbleI == bubbleN) {
    setTimeout(function () {
      stepBubbleRemainder();
    }, 1);
  } else {
    setTimeout(function () {
      stepStepBubbleSort();
    }, 1);
  }
}

// Partition function
function partition(low, high) {
  // Choose the pivot
  let pivot = data[high];

  // Index of smaller element and indicates
  // the right position of pivot found so far
  let i = low - 1;

  // Traverse arr[low..high] and move all smaller
  // elements to the left side. Elements from low to
  // i are smaller after every iteration
  for (let j = low; j <= high - 1; j++) {
    if (data[j] < pivot) {
      i++;
      swap(i, j);
    }
  }

  // Move pivot after smaller elements and
  // return its position
  swap(i + 1, high);
  return i + 1;
}

// The QuickSort function implementation
function quickSort(low, high) {
  if (low < high) {
    // pivot is the partition return index of pivot
    let pivot = partition(low, high);

    // Recursion calls for smaller elements
    // and greater or equals elements
    quickSort(low, pivot - 1);
    quickSort(pivot + 1, high);
  }
}

var QSComparison;
function startQS(comparison) {
  QSComparison = comparison;
  quickSort(0, data.length - 1);
}

function overwritedate(str) {
  curdate = str;
  curday = parseInt(str.substring(0, 2));
  curmon = parseInt(str.substring(3, 5));
  curyear = parseInt(str.substring(6, 8));
}

function getNick(str) {
  if (nicknames[str] != undefined) {
    return nicknames[str]
  } else {
    return str
  }
}