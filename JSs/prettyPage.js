var filecontent = "";
var binds;
var languageselected = 0; // meaningless switch variable
var ensw;
var jpsw;
var folderselected = 0;
var folders = [];
var selectors = [];
var optionss = [];
var selectopen = 0;
var nonzerocount;
var checkstatuses;
var groupstatuses;
var filtvalues;
var yeararray = [];
var yeararray2 = [];

var newfileinput;

function start() {
  languageselected = sessionStorage.getItem("lang");
  if (languageselected == null) {
    languageselected = 0;
  }
  makeDatas();

  window.onresize = reportWindowSize;
}

function reportWindowSize() {
  // RESIZE EVERYTHING
  console.log(window.innerWidth, window.innerHeight);
  nextbar = document.getElementById("nextbar");
  mylinks = document.getElementsByClassName("underbuttons");
  if (window.innerWidth > 1280) {
    nextbar.style.width = "914px";
  } else if (window.innerWidth > 768) {
    nextbar.style.width = "850px";
  } else if (window.innerWidth > 384) {
    nextbar.style.width = "400px";
  } else {
    nextbar.style.width = "300px";
  }
  if (window.innerWidth < 1745) {
    for (let i = 0; i < mylinks.length; i++) {
      mylinks[i].style.display = "none";
    }
  } else {
    for (let i = 0; i < mylinks.length; i++) {
      mylinks[i].style.display = "block";
    }
  }
}

function btdn() {
  window.alert("Button that does nothing.");
}

function clickfolder(n) {
  window.location.search = "folder=" + n;
}

function ts(cb) {
  if (cb.readOnly) cb.checked = cb.readOnly = false;
  else if (!cb.checked) cb.readOnly = cb.indeterminate = true;
}

function swln() {
  if (languageselected == 1) {
    ensw.style.backgroundColor = "rgba(228,95,58,1)";
    jpsw.style.backgroundColor = "rgba(228,95,58,0)";
    languageselected = 0;
  } else {
    jpsw.style.backgroundColor = "rgba(228,95,58,1)";
    ensw.style.backgroundColor = "rgba(228,95,58,0)";
    languageselected = 1;
  }
  sessionStorage.setItem("lang", languageselected);
}

function init() {
  generalinit();
  noLinks();
  binds = localStorage.getItem("binds");
  newfileinput = document.createElement("input");
  newfileinput.type = "file";
  newfileinput.innerText =
    "Please drag and drop file to parse and make sure covers folder is in images folder";
  insert(document.getElementById("mainbody"),newfileinput);
  console.log(newfileinput)
  if (binds != null) {
    binds = JSON.parse(binds);
    window.onload = display;
    newfileinput.hidden = true;
  } else {
    newfileinput.hidden = false;
  }
  ensw = document.getElementById("langop1");
  jpsw = document.getElementById("langop2");
  folders = document.getElementsByClassName("folder");
  varparams = new URLSearchParams(window.location.search);
  folderselected = parseInt(varparams.get("folder"));
  if (isNaN(folderselected)) {
    folderselected = 0;
  }
  folders[folderselected].style.color = "rgb(225,95,58)";
  selectors = document.getElementsByClassName("selector");
  moreselectors = document.getElementsByClassName("smallector");
  selectors = [...selectors, ...moreselectors];
  optionss = document.getElementsByClassName("options");
  smalloptionss = document.getElementsByClassName("smalloptions");
  bottomsearch = document.getElementById("searchform");
  bottomsearch.addEventListener("submit", (e) => {
    display();
    e.preventDefault();
  });

  for (let i = 0; i < filtboxarray[5].length; i++) {
    const cur = filtboxarray[5][i];
    lbl = document.createElement("label");
    lbl.classList.add("option");
    lbl.classList.add("stay1");
    lbl.innerHTML +=
      cur +
      "<input name=genre id='genre" +
      cur +
      "' type='checkbox' class='stay1 genrebox' onclick='ts(this)'>";
    spn = document.createElement("span");
    spn.classList.add("stay1");
    spn.classList.add("checkmark");
    insert(lbl, spn);
    insert(optionss[1], lbl);
  }

  yeararray = [];
  yeararray2 = [];
  for (let i = 2000 + curyear + 1; i >= 2000; i--) {
    yeararray.push(i);
  }
  for (let i = 1990; i >= 1900; i -= 10) {
    yeararray.push(i + "s");
  }

  filtvalues = [
    ["Movie", "TV", "OVA", "ONA", "Special"],
    [...filtboxarray[5]],
    [...filtboxarray[1].reverse()],
    ["Fall", "Summer", "Spring", "Winter", ""],
    [...yeararray],
    [...filtboxarray[3]],
  ];

  for (let i = 0; i < yeararray.length; i++) {
    const cur = yeararray[i];
    lbl = document.createElement("label");
    lbl.classList.add("smalloption");
    lbl.classList.add("stay1");
    lbl.classList.add("stay2");
    lbl.innerHTML +=
      cur +
      "<input name=year id='year" +
      cur +
      "' type='checkbox' class='stay1 stay2 yearbox'>";
    spn = document.createElement("span");
    spn.classList.add("stay1");
    spn.classList.add("stay2");
    spn.classList.add("checkmark");
    insert(lbl, spn);
    insert(document.getElementById("yearoptions"), lbl);
  }

  for (i = 0; i < 4; i++) {
    let rect = selectors[i].getBoundingClientRect();
    optionss[i].style.left = rect.left + "px";
    selectors[i].addEventListener("focus", (e) => {
      document.getElementById(
        e.target.id.substring(0, e.target.id.length - 6) + "options"
      ).style.display = "grid";
      document
        .getElementById(
          e.target.id.substring(0, e.target.id.length - 6) + "options"
        )
        .focus({ preventScroll: true });
    });
  }
  moreopsdiv = document.getElementById("moreoptions");
  filterbtn = document.getElementById("submitbtn");
  let rect = filterbtn.getBoundingClientRect();
  let rect1 = document.getElementById("mainbody").getBoundingClientRect();
  moreopsdiv.style.right = rect1.width - rect.right + "px";
  document.getElementById("mainbody").addEventListener("click", (e) => {
    if (!e.target.classList.contains("stay1")) {
      for (let j = 0; j < optionss.length; j++) {
        optionss[j].style.display = "none";
      }
    }
    if (!e.target.classList.contains("stay2")) {
      for (let j = 0; j < smalloptionss.length; j++) {
        smalloptionss[j].style.display = "none";
      }
    }
    if (e.target.classList.contains("selector")) {
      document.getElementById(
        e.target.id.substring(0, e.target.id.length - 6) + "options"
      ).style.display = "grid";
    }
    if (e.target.classList.contains("smallector")) {
      document.getElementById(
        e.target.id.substring(0, e.target.id.length - 6) + "options"
      ).style.display = "grid";
    }
    if (e.target.classList.contains("nearlyselector")) {
      document.getElementById(
        e.target.id.substring(0, e.target.id.length - 6) + "options"
      ).style.display = "flex";
    }

    if (e.target.classList.contains("nearlynearlyselector")) {
      document.getElementById(
        e.target.parentElement.id.substring(
          0,
          e.target.parentElement.id.length - 6
        ) + "options"
      ).style.display = "flex";
    }
  });

  typeops = document.getElementsByClassName("typebox");
  for (let i = 0; i < typeops.length; i++) {
    typeops[i].addEventListener("change", (e) => {
      let checkcount = 0;
      let firsttype = "Type";
      for (let k = 0; k < typeops.length; k++) {
        checkcount += typeops[k].checked;
        if (typeops[k].checked && firsttype == "Type")
          firsttype = typeops[k].id.substring(4);
      }
      if (checkcount > 1) {
        selectors[0].textContent = firsttype + " + [" + (checkcount - 1) + "]";
      } else {
        selectors[0].textContent = firsttype;
      }
    });
  }

  statusops = document.getElementsByClassName("statusbox");
  for (let i = 0; i < statusops.length; i++) {
    statusops[i].addEventListener("change", (e) => {
      let checkcount = 0;
      let firststatus = "Status";
      for (let k = 0; k < statusops.length; k++) {
        checkcount += statusops[k].checked;
        if (statusops[k].checked && firststatus == "Status")
          firststatus = statusops[k].id.substring(6);
      }
      if (checkcount > 1) {
        selectors[2].textContent =
          firststatus + " + [" + (checkcount - 1) + "]";
      } else {
        selectors[2].textContent = firststatus;
      }
    });
  }

  genreops = document.getElementsByClassName("genrebox");
  for (let i = 0; i < genreops.length; i++) {
    genreops[i].addEventListener("change", (e) => {
      let checkcount = 0;
      let firstgenre = "Genre";
      for (let k = 0; k < genreops.length; k++) {
        checkcount += genreops[k].checked || genreops[k].readOnly;
        if (
          (genreops[k].checked || genreops[k].readOnly) &&
          firstgenre == "Genre"
        )
          firstgenre = genreops[k].id.substring(5);
      }
      if (checkcount > 1) {
        selectors[1].textContent = firstgenre + " + [" + (checkcount - 1) + "]";
      } else {
        selectors[1].textContent = firstgenre;
      }
    });
  }

  sortops = document.getElementsByClassName("sortrad");
  for (let i = 0; i < sortops.length; i++) {
    sortops[i].addEventListener("change", (e) => {
      selectors[3].textContent = e.target.id.substring(4);
    });
  }

  seasonops = document.getElementsByClassName("seasonbox");
  for (let i = 0; i < seasonops.length; i++) {
    seasonops[i].addEventListener("change", (e) => {
      let checkcount = 0;
      let firstseason = "Season";
      for (let k = 0; k < seasonops.length; k++) {
        checkcount += seasonops[k].checked;
        if (seasonops[k].checked && firstseason == "Season")
          firstseason = seasonops[k].id.substring(6);
      }
      if (checkcount > 1) {
        selectors[4].textContent =
          firstseason + " + [" + (checkcount - 1) + "]";
      } else {
        selectors[4].textContent = firstseason;
      }
    });
  }

  yearops = document.getElementsByClassName("yearbox");
  for (let i = 0; i < yearops.length; i++) {
    yearops[i].addEventListener("change", (e) => {
      let checkcount = 0;
      let firstyear = "Year";
      for (let k = 0; k < yearops.length; k++) {
        checkcount += yearops[k].checked;
        if (yearops[k].checked && firstyear == "Year")
          firstyear = yearops[k].id.substring(4);
      }
      if (checkcount > 1) {
        selectors[5].textContent = firstyear + " + [" + (checkcount - 1) + "]";
      } else {
        selectors[5].textContent = firstyear;
      }
    });
  }

  ratingops = document.getElementsByClassName("ratingbox");
  for (let i = 0; i < ratingops.length; i++) {
    ratingops[i].addEventListener("change", (e) => {
      let checkcount = 0;
      let firstrating = "Rating";
      for (let k = 0; k < ratingops.length; k++) {
        checkcount += ratingops[k].checked;
        if (ratingops[k].checked && firstrating == "Rating")
          firstrating = ratingops[k].id.substring(6);
      }
      if (checkcount > 1) {
        selectors[6].textContent =
          firstrating + " + [" + (checkcount - 1) + "]";
      } else {
        selectors[6].textContent = firstrating;
      }
    });
  }

  if (languageselected == 0) {
    ensw.style.backgroundColor = "rgba(228,95,58,1)";
    jpsw.style.backgroundColor = "rgba(228,95,58,0)";
  } else {
    jpsw.style.backgroundColor = "rgba(228,95,58,1)";
    ensw.style.backgroundColor = "rgba(228,95,58,0)";
  }
  newfileinput.addEventListener("change", function () {
    const reader = new FileReader();
    reader.onload = (e) => {
      filecontent = e.target.result;
      newfileinput.hidden = true;
      parseHTML();
    };
    reader.readAsText(this.files[0]);
  });
  window.addEventListener("drop", (e) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      filecontent = e.target.result;
      parseHTML();
    };
    reader.readAsText(e.dataTransfer.items[0].getAsFile());
    e.preventDefault();
  });
  window.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  display();
  // myimg = document.createElement("img");
  // myimg.src = "https://cdn.myanimelist.net/images/anime/1026/135253l.jpg";
  // insert(d, myimg);
}

function parseHTML() {
  str1 = filecontent.split("list-item");
  str2 = [];
  for (let i = 0; i < str1.length; i++) {
    if (str1[i][0] == '"') str2.push(str1[i]);
  }
  binds = {};
  for (let i = 0; i < str2.length; i++) {
    ind = findnthstrfromi(str2[i], 'sort">', 2, 0);
    frontchop = str2[i].substring(ind + 6);
    ind = findnthstrfromi(frontchop, "</a>", 1, 0);
    foundtitle = frontchop.substring(0, ind);
    let andind = foundtitle.indexOf("&");
    if (andind != -1) {
      foundtitle =
        foundtitle.substring(0, andind) +
        "&" +
        foundtitle.substring(andind + 5);
    }

    ind = findnthstrfromi(str2[i], "/", 9, 0);

    frontchop = str2[i].substring(ind + 1);
    ind = findnthstrfromi(frontchop, '"', 1, 0);
    let ind1 = findnthstrfromi(frontchop, "?", 1, 0);
    if (ind1 < ind && ind1 != -1) ind = ind1;
    foundfile = frontchop.substring(0, ind);
    binds[foundtitle] = foundfile;
  }
  localStorage.setItem("binds", JSON.stringify(binds));
  display();
}

function findnthstrfromi(str, sstr, n = 1, start = 0) {
  if (
    sstr.length > str.length ||
    n > str.length - start ||
    start + 2 > str.length - start
  ) {
    console.error("Invalid parameters");
    return -1;
  }
  result = -1;
  for (let i = start; i < str.length - (sstr.length - 1); i++) {
    if (str.substring(i, i + sstr.length) == sstr) {
      n = n - 1;
    }
    if (n == 0) {
      result = i;
      return result;
    }
  }
  return result;
}

function realmod(x, n) {
  let result = x % n;
  while (result < 0) {
    result += n;
  }
  return result;
}

function getdateforupd(e) {
  let result = "--";
  if (e.status == "Completed") {
    result = e.airenddate;
  }
  if (e.status == "Plan to Watch") {
    if (e.airStatus == "Aired") {
      result = e.airenddate;
    }
    if (e.airStatus == "Airing") {
      let modval = realmod(daycount(e.airstartdate), 7);
      result = ndaysbefore(curdate, modval);
    }
  }
  if (e.status == "On-Hold") {
    if (isDate(e.dubenddate)) {
      let modval = realmod(daycount(e.dubenddate), 7);
      result = ndaysbefore(curdate, modval);
    } else {
      if (e.airStatus == "Aired") {
        result = e.airenddate;
      }
      if (e.airStatus == "Airing") {
        let modval = realmod(daycount(e.airstartdate), 7);
        result = ndaysbefore(curdate, modval);
      }
    }
  }
  return result;
}

function compareUpdatedDate(a, b) {
  let adate = getdateforupd(a);
  let bdate = getdateforupd(b);

  acode =
    parseInt(adate.substring(6, 8)) * 10000 +
    parseInt(adate.substring(3, 5)) * 100 +
    parseInt(adate.substring(0, 2));
  bcode =
    parseInt(bdate.substring(6, 8)) * 10000 +
    parseInt(bdate.substring(3, 5)) * 100 +
    parseInt(bdate.substring(0, 2));
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

function display() {
  d.innerText = "";
  p.innerHTML = "";
  document.getElementsByClassName("itemcontainer")[0].innerHTML = "";

  let sorttarget = document
    .querySelector('input[name="sort"]:checked')
    .id.substring(4);

  data.sort(compareTitles);
  switch (sorttarget) {
    case "Default":
      data.sort(compareTitles);
      data.sort(compareStatus);
      break;
    case "Watched date":
      data.sort(compareWatchDate).reverse();
      break;
    case "Updated date":
      //something special here
      data.sort(compareUpdatedDate).reverse();
      break;
    case "Release date":
      data.sort(compareAirStart).reverse();
      break;
    case "End date":
      data.sort(compareAirFinish).reverse();
      break;
    case "Name A-Z":
      data.sort(compareTitles);
      break;
    case "MAL score":
      data.sort(compareMALScore).reverse();
      break;
    case "Total episodes":
      data.sort(compareEpisodes).reverse();
      break;
    default:
      break;
  }

  let count = 0;

  let allchecks = document.querySelectorAll('input[type="checkbox"]');
  checkstatuses = [];
  groupstatuses = [];
  let temparray = [];
  nonzerocount = 0;
  let lastname = "type";
  let j = -1;
  for (let ch of allchecks) {
    let val = 0;
    if (ch.checked) {
      val = 1;
    }
    if (ch.readOnly) {
      val = 2;
    }
    if (val != 0) {
      nonzerocount++;
    }
    checkstatuses.push(val);
    if (ch.name != lastname) {
      lastname = ch.name;
      groupstatuses.push(temparray);
      temparray = [];
      j++;
    }
    temparray.push(val);
  }
  groupstatuses.push(temparray);
  let results = [];
  for (let e of data) {
    if (passfail(e)) {
      results.push(e);
      count++;
    }
  }
  for (let e of results) {
    myitem = document.createElement("div");
    myitem.classList.add("aitem");
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
              temptitle.substring(0, i) +
              "&gt;&gt;" +
              temptitle.substring(i + 2);
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
    let dubcount = 0;
    let subcount = 0;
    if (e.airStatus == "Aired") {
      subcount = e.episodes;
    } else if (e.airStatus == "Airing") {
      if (e.episodes > 0) {
        subcount = e.episodes - Math.ceil(-daycount(e.airenddate) / 7);
      } else {
        console.log("????");
        console.log(e);
      }
    }
    if (e.status == "Completed") {
      dubcount = e.episodes;
    }
    if (e.status == "Plan to Watch" || e.status == "Watching") {
      dubcount = subcount;
    }
    if (isDate(e.dubenddate)) {
      let myvar = subcount - Math.ceil(-daycount(e.dubenddate) / 7);
      dubcount = myvar;
    }
    if (covervar == undefined) {
      console.error(e.title);
    }
    myitem.innerHTML =
      '<div class="leftpart"><img class="coverimg" src="../images/covers/' +
      covervar +
      '"><div class="infobtn"> <img class="infoicon" src="../images/info.svg"><div class="lilbridge"></div><div class="information"><span class="infotitle">' +
      e.title +
      '</span><div class="shortstats"><span class="rated">' +
      e.rated +
      '</span><span class="malscore">' +
      (e.MALscore == 0 ? "?" : e.MALscore) +
      '</span></div><div class="lowerinfo"><span class="infolabel">Aired: </span>' +
      (defaultdatetoreadable(e.airstartdate) == "-"
        ? "?"
        : defaultdatetoreadable(e.airstartdate)) +
      " to " +
      (defaultdatetoreadable(e.airenddate) == "-"
        ? "?"
        : defaultdatetoreadable(e.airenddate)) +
      '<br><span class="infolabel">Status: </span>' +
      e.airStatus +
      '<br><span class="infolabel">Genres: </span>' +
      e.genres.join(", ") +
      '</div></div></img></div></div><div class="rightpart"><div class="toprow"><span class="fake-dropdown">' +
      e.status +
      '</span><img src="../images/eye.svg" class="eyebtn"></img></div><span class="title">' +
      e.title +
      '</span><div class="epinfo"><span ' +
      (subcount == 0 ? "hidden " : "") +
      'class="subcount">CC ' +
      subcount +
      "</span><span " +
      (dubcount == 0 ? "hidden " : "") +
      'class="dubcount">' +
      dubcount +
      "</span><span " +
      (e.type == "Movie" || e.episodes == 0 ? "hidden " : "") +
      'class="totalcount">' +
      e.episodes +
      "</span></div></div>";
    myitem.getElementsByClassName("title")[0].textContent = e.title;
    insert(document.getElementsByClassName("itemcontainer")[0], myitem);
  }
  document.getElementById("resultcount").innerText = count + " anime";
  console.log(count);
}

function certaincondition(val, i, j, e) {
  switch (i) {
    case 0:
      return e.type == filtvalues[i][j];
    case 1:
      if (val == 1) {
        return !e.genres.includes(filtvalues[i][j]);
      } else {
        return e.genres.includes(filtvalues[i][j]);
      }
    case 2:
      return e.airStatus == filtvalues[i][j];
    case 3:
      return (
        e.premiered.substring(0, e.premiered.indexOf(" ")) == filtvalues[i][j]
      );
    case 4:
      return (
        e.premiered.substring(e.premiered.indexOf(" ") + 1) == filtvalues[i][j]
      );
    case 5:
      return e.rated == filtvalues[i][j];
  }
}

function passfail(element) {
  if (
    document.getElementById("filtersearch").value == "" &&
    nonzerocount == 0 &&
    folderselected == 0
  ) {
    return true;
  }

  let pass = [];
  pass[0] = true;
  pass[1] = false; // type
  pass[2] = true; // genre
  pass[3] = false; // airstatus
  pass[4] = false; // Season
  pass[5] = false; // Year
  pass[6] = false; // Rating

  for (let i = 0; i < groupstatuses.length; i++) {
    for (let j = 0; j < groupstatuses[i].length; j++) {
      if (
        groupstatuses[i][j] != 0 &&
        certaincondition(groupstatuses[i][j], i, j, element)
      ) {
        pass[i + 1] = true;
        if (i == 1) pass[i + 1] = false;
      }
    }
  }

  for (let i = 0; i < groupstatuses.length; i++) {
    if (sumArrToi(groupstatuses[i]) == 0) pass[i + 1] = true;
  }

  for (let i = 1; i < pass.length; i++) {
    pass[0] = pass[0] && pass[i];
  }

  searchbox = document.getElementById("filtersearch");
  searchterms = searchbox.value.toLowerCase().split(" ");
  if (searchbox.value != "") {
    for (let i = 0; i < searchterms.length; i++) {
      let curterm = searchterms[i];
      pass[0] = pass[0] && element.title.toLowerCase().includes(curterm);
    }
  }

  let foldernames = [
    "Watching",
    "On-Hold",
    "Plan to Watch",
    "Completed",
    "Dropped",
  ];
  if (folderselected > 0) {
    pass[0] = pass[0] && element.status == foldernames[folderselected - 1];
  }

  if (pass[0]) {
    return true;
  }

  return false;
}
