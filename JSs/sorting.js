function init() {
  generalinit();
  binds = localStorage.getItem("binds");
  if (binds != null) {
    binds = JSON.parse(binds);
  }
  display();
}


function start() {
  makeDatas();

  // List of Entries where only 2 are displayed
  middlearray = shuffleArray(data);
  shuffledData = [];
  for (let i = 0; i < middlearray.length; i++) {
    if (middlearray[i].MALscore > 0) {
      shuffledData.push(middlearray[i]);
    }
  }
}