var longesttitle = 0;
var mytable;

function init() {
  generalinit();
}

function start() {
  makeDatas();

  mytable = JSON.parse(localStorage.getItem("onholds"));
  console.log(mytable);
  if (mytable == null) {
    mytable = {};
  }
  for (let i = 0; i < data.length; i++) {
    if (data[i].title.length > longesttitle && data[i].status == "On-Hold") {
      longesttitle = data[i].title.length;
    }
    if (data[i].title in mytable && data[i].status != "On-Hold") {
      delete mytable[data[i].title];
    }
  }

  data.sort(compareAirFinish).reverse();
  data.sort(intablecomp);

  for (let i = 0; i < data.length; i++) {
    const cur = data[i];
    if (cur.status == "On-Hold") {
      let pr = document.createElement("pre");
      pr.innerHTML = "<b></b> - <b>   Unknown   </b> - <b></b> - <b></b>";
      pr.children[0].textContent = cur.title;
      for (
        let j = 0;
        j <
        Math.ceil((longesttitle + 3) / 8) - Math.floor(cur.title.length / 8);
        j++
      ) {
        pr.children[0].textContent += "\t";
      }
      pr.children[1].style.color = "Red";
      pr.children[1].id = cur.title;
      pr.children[2].innerHTML =
        '<input maxlength="8" hidden=true style="text-align: left;width:7.1ch;"></input>';
      pr.children[2].lastChild.addEventListener("input", function () {
        if (isDate(this.value)) {
          if (daycount(this.value) < daycount(cur.airenddate)) {
            let weekount =
              (daycount(cur.airenddate) - daycount(this.value)) / 7;
            if (weekount == Math.floor(weekount)) {
              pr.children[3].lastChild.value = weekount;
            }
            mytable[cur.title] = this.value;
            localStorage.setItem("onholds", JSON.stringify(mytable));
          }
        }
      });
      pr.children[3].innerHTML =
        '<input maxlength="2" hidden=true style="text-align: left;width:3.1ch;"></input>';
      pr.children[3].lastChild.addEventListener("input", function () {
        if (this.value > 0 && this.value == Math.floor(this.value)) {
          if (cur.airStatus == "Aired") {
            let pastweeks = Math.floor((daycount(cur.airenddate)-daycount(curdate))/7)
            let thedate = ndaysafter(cur.airenddate, (parseInt(this.value)+pastweeks) * 7);
            pr.children[2].lastChild.value = thedate;
            mytable[cur.title] = thedate;
            localStorage.setItem("onholds", JSON.stringify(mytable));
          } else {
            let thedate = ndaysafter(cur.airenddate, this.value * 7);
            pr.children[2].lastChild.value = thedate;
            mytable[cur.title] = thedate;
            localStorage.setItem("onholds", JSON.stringify(mytable));
          }
        }
      });
      if (cur.title in mytable) {
        if (mytable[cur.title] == "1") {
          pr.children[1].style.color = "red";
          pr.children[1].textContent = "No Active Dub";
        } else {
          pr.children[1].style.color = colors.Watching;
          pr.children[1].textContent = " Ongoing Dub ";
          pr.children[2].lastChild.hidden = false;
          pr.children[3].lastChild.hidden = false;
          pr.children[2].lastChild.value = mytable[cur.title];
          let weeksout =
            (daycount(cur.airenddate) - daycount(mytable[cur.title])) / 7;
          if (weeksout > 0) {
            pr.children[3].lastChild.value = weeksout;
          }
        }
      }
      pr.children[1].onclick = function () {
        if (this.style.color == "red") {
          this.style.color = colors.Watching;
          this.textContent = " Ongoing Dub ";
          this.parentElement.children[2].lastChild.hidden = false;
          this.parentElement.children[3].lastChild.hidden = false;
          mytable[this.id] = "0";
          localStorage.setItem("onholds", JSON.stringify(mytable));
        } else {
          this.style.color = "red";
          this.textContent = "No Active Dub";
          mytable[this.id] = "1";
          this.parentElement.children[2].lastChild.hidden = true;
          this.parentElement.children[3].lastChild.hidden = true;
          localStorage.setItem("onholds", JSON.stringify(mytable));
        }
        return false;
      };
      pr.children[1].oncontextmenu = function () {
        if (this.textContent == "No Active Dub") {
          this.style.color = colors.Watching;
          this.textContent = " Ongoing Dub ";
          this.parentElement.children[2].lastChild.hidden = false;
          this.parentElement.children[3].lastChild.hidden = false;
          mytable[this.id] = "0";
          localStorage.setItem("onholds", JSON.stringify(mytable));
        } else {
          console.log(this.style.color)
          this.style.color = "red";
          this.textContent = "No Active Dub";
          mytable[this.id] = "1";
          this.parentElement.children[2].lastChild.hidden = true;
          this.parentElement.children[3].lastChild.hidden = true;
          localStorage.setItem("onholds", JSON.stringify(mytable));
        }
        return false;
      };
      insert(p, pr);
    }
  }
}

function intablecomp(a, b) {
  let v1 = a.title in mytable;
  let v2 = b.title in mytable;
  if (v1 == v2) {
    return 0;
  }
  if (v1 && !v2) {
    return 1;
  }
  if (v2 && !v1) {
    return -1;
  }
}
