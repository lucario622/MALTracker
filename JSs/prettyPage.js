var filecontent = "";
var binds;
var languageselected = 0; // meaningless switch variable
var ensw;
var jpsw;

function start() {
  languageselected = sessionStorage.getItem("lang")
  makeDatas();

  console.log("so pretty...");

  window.onresize = reportWindowSize;
}

function reportWindowSize() {
  console.log(window.innerWidth, window.innerHeight);
}

function btdn() {
  window.alert("Button that does nothing.");
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
  sessionStorage.setItem("lang",languageselected)
}

function init() {
  generalinit();
  noLinks();
  console.log("test");
  binds = localStorage.getItem("binds");
  if (binds != null) {
    console.log("already data");
    binds = JSON.parse(binds);
    console.log(binds);
    display();
  } else {
    p.innerText =
      "Please drag and drop file to parse and make sure covers folder is in images folder";
  }
  ensw = document.getElementById("langop1");
  jpsw = document.getElementById("langop2");
  if (languageselected == 0) {
    ensw.style.backgroundColor = "rgba(228,95,58,1)";
    jpsw.style.backgroundColor = "rgba(228,95,58,0)";
    console.log("???");
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
  // console.log(filecontent.split("list-item"));
  str1 = filecontent.split("list-item");
  str2 = [];
  for (let i = 0; i < str1.length; i++) {
    if (str1[i][0] == '"') str2.push(str1[i]);
  }
  binds = {};
  for (let i = 0; i < str2.length; i++) {
    // console.log(str2[i])
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
