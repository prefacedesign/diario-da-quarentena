let mockData;

let inkColors = 15,
  bgColors = 17;

let mobile = false;
let pgW = 400,
  marg = pgW / 20,
  smBrkpnt = pgW * 2 + marg * 2;

let audio = new Audio("../sounds/page-flip-4.mp3");

let pageIndex = 0;
let pages;
let mobilePaginationScheme = false;
let pageOffset = 2;
let minPage = 0;
let flipDelay = 250;

let diaryOpeningOrClosing = false;

function detectMobile() {
  if (!pages) {
    pages = document.querySelectorAll(".page");
  }
  let w = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  );
  mobile = w < smBrkpnt;

  // detects a change in size which should redo the pagination
  if (mobile && !mobilePaginationScheme) {
    mobilePaginationScheme = true;
    pageOffset = 1;
    minPage = 1;
    flipDelay = 0;
    if (pageIndex == 0) {
      advancesPages(false);
    }
    if (pageIndex == pages.length - 2) {
      blockNavigation(false, [false, true]);
    }
  } else if (!mobile && mobilePaginationScheme) {
    mobilePaginationScheme = false;

    if (pageIndex >= pages.length - 2) {
      blockNavigation(true, [false, true]);
    }

    // if current page is even i'll set index to its
    // even pair
    if (pageIndex % 2 != 0) {
      pages[pageIndex].classList.remove("current");
      pageIndex -= 1;
      pages[pageIndex].classList.add("current");
    }
    pageOffset = 2;
    minPage = 0;
    flipDelay = 250;
  }
}

function advancesPages(playSound = true) {
  // are there more pages to flip to?
  if (pageIndex + pageOffset < pages.length) {
    if (playSound) {
      playFlip();
    }
    pages[pageIndex].classList.remove("current");
    pages[pageIndex].classList.add("past");

    if (!mobilePaginationScheme) {
      blockNavigation(true);
      pages[pageIndex + 1].classList.add("past");
      pages[pageIndex + 1].classList.add("zoom-top");
      setTimeout(() => {
        pages[pageIndex + 1].classList.remove("zoom-top");
        pageIndex += pageOffset;
        pages[pageIndex].classList.add("current");
        blockNavigation(false);
        if (pageIndex >= pages.length - 2) {
          blockNavigation(true, [false, true]);
        }
      }, flipDelay);
    } else {
      pageIndex += pageOffset;
      pages[pageIndex].classList.add("current");
      if (pageIndex == pages.length - 1) {
        blockNavigation(true, [false, true]);
      } else {
        blockNavigation(false);
      }
    }
  }
}

function returnsPages(playSound = true) {
  // have we reached the start of the book?
  if (pageIndex - pageOffset >= minPage) {
    if (playSound) {
      playFlip();
    }

    blockNavigation(false, [false, true]);

    pages[pageIndex].classList.remove("current");

    if (!mobilePaginationScheme) {
      blockNavigation(true);
      pages[pageIndex + 1].classList.add("zoom-top");
    }

    pageIndex -= pageOffset;
    pages[pageIndex].classList.remove("past");
    pages[pageIndex].classList.add("current");

    setTimeout(() => {
      if (!mobilePaginationScheme) {
        blockNavigation(false);
        pages[pageIndex + pageOffset + 1].classList.remove("zoom-top");
      }
      pages[pageIndex + 1].classList.remove("past");
    }, flipDelay);
  } else {
    if (pageIndex == minPage) {
      closeDiary();
    }
  }
}

function blockNavigation(block, changeWhich = [true, true]) {
  let navButs = document.querySelectorAll(".navigation button");

  navButs.forEach((b, i) => {
    if (changeWhich[i]) {
      b.disabled = block;
    }
  });
}

function playFlip() {
  audio.currentTime = 0;
  audio.play();
}

function openDiary() {
  if (!diaryOpeningOrClosing) {
    playFlip();
    diary.classList.add("opening");
    diary.classList.remove("closed");
    diaryOpeningOrClosing = true;
    setTimeout(() => {
      diary.classList.remove("opening", "closing", "closed");
      diary.classList.add("open");
      diaryOpeningOrClosing = false;
    }, flipDelay * 3);
  }
}

function closeDiary() {
  if (!diaryOpeningOrClosing) {
    playFlip();
    diary.classList.add("closing");
    diary.classList.remove("open");
    diaryOpeningOrClosing = true;
    setTimeout(() => {
      diary.classList.remove("closing", "opening", "open");
      diary.classList.add("closed");
      diaryOpeningOrClosing = false;
    }, flipDelay * 3);
  }
}

function startDebuggingAnimations() {
  let del = 200;

  let bgs = true,
    inks = true,
    patterns = true;

  let iClass = 10;
  if (bgs) {
    setInterval(() => {
      diary.classList.remove(`cover_${iClass}`);
      if (iClass == bgColors) {
        iClass = 1;
      } else {
        iClass++;
      }
      diary.classList.add(`cover_${iClass}`);
    }, (del * bgColors) / 4);
  }

  let alpha = "abcdefghijklmnopqrstuvwxyz";
  let iAlpha = 0;

  if (patterns) {
    setInterval(() => {
      diary.classList.remove(`first_${alpha[iAlpha]}`);
      if (iAlpha == alpha.length - 1) {
        iAlpha = 0;
      } else {
        iAlpha++;
      }
      diary.classList.add(`first_${alpha[iAlpha]}`);
    }, del * 2);
  }

  let iCol = 1;

  if (inks) {
    setInterval(() => {
      diary.classList.remove(`ink_${iCol}`);
      if (iCol == inkColors) {
        iCol = 1;
      } else {
        iCol++;
      }
      diary.classList.add(`ink_${iCol}`);
    }, del);
  }
}

let diary = document.querySelector(".diary");
let debugAnimations = false;
let fontLoaded = false,
  dataLoaded = false;

(function () {
  window.addEventListener("resize", detectMobile);
  if (debugAnimations) {
    startDebuggingAnimations();
  }
  document.fonts.load('1rem "Patrick Hand"').then(() => {
    fontLoaded = true;
    if (dataLoaded) {
      setDiaryStyle();
      paginateContent();
      detectMobile();
    }
  });
})();

fetch("../data/example.json")
  .then((response) => {
    return response.json();
  })
  .then((json) => {
    mockData = json;
    dataLoaded = true;
    if (fontLoaded) {
      setDiaryStyle();
      paginateContent();
      detectMobile();
    }
  });

// https://stackoverflow.com/a/8831937
String.prototype.hashCode = function () {
  var hash = 0;
  if (this.length == 0) {
    return hash;
  }
  for (var i = 0; i < this.length; i++) {
    var char = this.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

// first_c cover_4 f_color_8
function setDiaryStyle() {
  let firstLetter = mockData.initials[0].toLowerCase();
  let bgCodeSeed =
    mockData.profession + mockData.location + mockData.age + mockData.initials;
  let inkCodeSeed =
    mockData.age + mockData.initials + mockData.location + mockData.profession;
  let bgCode = (Math.abs(bgCodeSeed.hashCode()) % bgColors) + 1;
  let inkCode = (Math.abs(inkCodeSeed.hashCode()) % inkColors) + 1;
  diary.classList.add(
    `first_${firstLetter}`,
    `cover_${bgCode}`,
    `ink_${inkCode}`
  );
  // diary.classList.add(`first_e`, `cover_3`, `ink_15`);
}

function paginateContent() {
  let textContainer = document.getElementById("aux-text-container");
  let lineHeight = textContainer.clientHeight;
  let lineLimit = 16;
  let heightLimit = lineHeight * lineLimit;
  textContainer.innerHTML = ``;

  let html = [];
  // converts the json to html
  mockData.entries.forEach((e) => {
    let tags = [];
    Object.keys(e.open_ended_directives).forEach((key) => {
      if (e.open_ended_directives[key] != "") {
        // title of the directive
        tags.push({
          tag: "h2",
          inner_text: key,
        });

        // student-filled text
        let s = e.open_ended_directives[key];
        let parts = s.split("\n");
        parts.forEach((part) => {
          if (part.length > 0) {
            tags.push({
              tag: "p",
              inner_text: part.trim(),
            });
          }
        });
      }
    });
    if (e.mood != "") {
      tags.push({
        tag: "p",
        inner_text: `Resumo da semana... ${e.mood}`,
      });
    }
    html.push({
      week: e.date,
      tags: tags,
    });
  });

  let pages;
  let pageContainer = document.querySelector(".pages-container");
  let currentTag, currentText;

  html.forEach((week) => {
    pages = [];
    week.tags.forEach((tag) => {
      let hasEndedProcessing = false;
      currentTag = tag.tag;
      currentText = tag.inner_text;
      do {
        let node = document.createElement(currentTag);
        let textNode = document.createTextNode(currentText);
        node.appendChild(textNode);
        textContainer.appendChild(node);

        let lines = parseInt(textContainer.offsetHeight) / lineHeight;
        if (lines > lineLimit) {
          // Breaks it word by word until the limit is reached.
          textContainer.lastChild.innerHTML = "";
          let words = tag.inner_text.split(" ");
          let foundBreakpoint = false;
          let i = 0;
          for (; i < words.length; i++) {
            if (!foundBreakpoint) {
              let oldS = textContainer.lastChild.innerHTML;
              textContainer.lastChild.innerHTML += words[i] + " ";
              lines = parseInt(textContainer.offsetHeight) / lineHeight;
              if (lines > lineLimit) {
                foundBreakpoint = true;
                textContainer.lastChild.innerHTML = oldS;
                pages.push(textContainer.innerHTML);
                textContainer.innerHTML = ``;
                currentText = words[i];
              }
            } else {
              currentText += " " + words[i];
            }
          }
        } else {
          hasEndedProcessing = true;
        }
      } while (!hasEndedProcessing);
    });
    for (let i = 0; i < pages.length; i++) {
      let pageNode = document.createElement("div");
      pageNode.classList.add("page");
      let textContainer = document.createElement("div");
      textContainer.classList.add("text-container");
      textContainer.innerHTML = pages[i];
      pageNode.appendChild(textContainer);
      pageNode.innerHTML += `<h2 class="date">${
        week.week
      }</h2><p class="pg-num">${i + 2}</p>`;
      pageContainer.appendChild(pageNode);
    }
  });
  textContainer.innerHTML = ``;
}
