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
  console.log(mylinks);
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
    console.log("???");
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
  if (binds != null) {
    binds = JSON.parse(binds);
    display();
  } else {
    p.innerText =
      "Please drag and drop file to parse and make sure covers folder is in images folder";
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
  optionss = document.getElementsByClassName("options");

  for (let i = 0; i < filtboxarray[5].length; i++) {
    const cur = filtboxarray[5][i];
    lbl = document.createElement("label");
    lbl.classList.add("option");
    lbl.classList.add("stay1");
    lbl.innerHTML +=
      cur +
      "<input id='genre" +
      cur +
      "' type='checkbox' class='stay1 genrebox' onclick='ts(this)'>";
    spn = document.createElement("span");
    spn.classList.add("stay1");
    spn.classList.add("checkmark");
    insert(lbl, spn);
    insert(optionss[1], lbl);
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
  document.getElementById("mainbody").addEventListener("click", (e) => {
    if (!e.target.classList.contains("stay1")) {
      for (let j = 0; j < optionss.length; j++) {
        optionss[j].style.display = "none";
      }
    }
    if (e.target.classList.contains("selector")) {
      document.getElementById(
        e.target.id.substring(0, e.target.id.length - 6) + "options"
      ).style.display = "grid";
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
        selectors[2].textContent = firststatus + " + [" + (checkcount - 1) + "]";
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
        checkcount += (genreops[k].checked || genreops[k].readOnly);
        if ((genreops[k].checked || genreops[k].readOnly) && firstgenre == "Genre")
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

  if (languageselected == 0) {
    ensw.style.backgroundColor = "rgba(228,95,58,1)";
    jpsw.style.backgroundColor = "rgba(228,95,58,0)";
  } else {
    jpsw.style.backgroundColor = "rgba(228,95,58,1)";
    ensw.style.backgroundColor = "rgba(228,95,58,0)";
  }
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

    ind = findnthstrfromi(str2[i], "/", 9, 0);

    frontchop = str2[i].substring(ind + 1);
    ind = findnthstrfromi(frontchop, '"', 1, 0);
    foundfile = frontchop.substring(0, ind);
    binds[foundtitle] = foundfile;
  }
  localStorage.setItem("binds", JSON.stringify(binds));
  myimg = document.createElement("img");
  myimg.src =
    "../images/covers/" +
    binds[Object.keys(binds)[(Math.random() * Object.keys(binds).length) << 0]];
  insert(d, myimg);
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

function display() {
  console.log("display");
  d.innerHTML = "";
  p.innerHTML = "";
}
