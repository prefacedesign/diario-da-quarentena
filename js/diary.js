let mockData;

let directives = [
  { key: "trabalho_estudo", text: "Trabalho e/ou estudos" },
  { key: "lazer", text: "Lazer e descanso" },
  {
    key: "corpo_objetos_pessoas",
    text: "Relação com meu próprio corpo, objetos e\xa0outras\xa0pessoas",
  },
  { key: "alimentacao", text: "Minha alimentação" },
  { key: "sentimentos", text: "Impressões e sentimentos" },
];

let emojiKeys = {
  raiva: "😡",
  ansioso: "😟",
  entediado: "😒",
  triste: "😞",
  animado: "😊",
  cansado: "😴",
  feliz: "😃",
  satisfeito: "🙂",
  sereno: "😌",
};

let moodKeys = {
  raiva: "com raiva",
  ansioso: "ansioso",
  entediado: "entediado",
  triste: "triste",
  animado: "animado!",
  cansado: "cansado",
  feliz: "feliz",
  satisfeito: "satisfeito",
  sereno: "sereno",
};

let shouldDebugNav = false;

let nEntries = 0;

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
let pageIsFlipping = false;

let diary;
let debugAnimations = false;
let fontLoaded = false,
  dataLoaded = false;

let diaryOpening = false,
  diaryClosing = false;

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
      debugNav("", true);
      pages[pageIndex].classList.remove("current");
      pageIndex -= 1;
      pages[pageIndex].classList.remove("past");
      pages[pageIndex].classList.add("current");
      debugNav();
    }
    pageOffset = 2;
    minPage = 0;
    flipDelay = 250;
  }
}

function debugNav(intro = "", clearConsole = false) {
  if (!shouldDebugNav) {
    return;
  }

  if (clearConsole) {
    console.clear();
  }

  let s1 = "",
    s2 = "";
  for (let i = 0; i < pages.length; i++) {
    let current = " ",
      past = " ";
    if (pages[i].classList.contains("current")) {
      current = "C";
    }
    if (pages[i].classList.contains("past")) {
      past = "P";
    }
    s1 += `${i.toString().padStart(2, "0")}|`;
    s2 += `${current}${past}|`;
  }
  console.log(intro);
  console.log(` ${s1} \n ${s2}`);
}

function advancesPages(playSound = true, delay = flipDelay) {
  debugNav("advancing...", true);
  // are there more pages to flip to?
  if (pageIndex + pageOffset < pages.length && !pageIsFlipping) {
    pageIsFlipping = true;
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
        debugNav("advanced...");
        pageIsFlipping = false;
      }, delay);
    } else {
      pageIndex += pageOffset;
      pages[pageIndex].classList.add("current");
      if (pageIndex == pages.length - 1) {
        blockNavigation(true, [false, true]);
      } else {
        blockNavigation(false);
      }
      debugNav("advanced...");
      pageIsFlipping = false;
    }
  }
}

function returnsPages(playSound = true, delay = flipDelay) {
  debugNav("returning...", true);
  // have we reached the start of the book?
  if (pageIndex - pageOffset >= minPage && !pageIsFlipping) {
    pageIsFlipping = true;
    if (playSound) {
      playFlip();
    }

    blockNavigation(false, [false, true]);

    pages[pageIndex].classList.remove("current");

    if (!mobilePaginationScheme) {
      blockNavigation(true);
      if (pageIndex + 1 < pages.length) {
        pages[pageIndex + 1].classList.add("zoom-top");
      }
    }

    pageIndex -= pageOffset;
    pages[pageIndex].classList.remove("past");
    pages[pageIndex].classList.add("current");

    setTimeout(() => {
      if (!mobilePaginationScheme) {
        blockNavigation(false);
        if (pageIndex + pageOffset + 1 < pages.length) {
          pages[pageIndex + pageOffset + 1].classList.remove("zoom-top");
        }
      }
      pages[pageIndex + 1].classList.remove("past");
      pageIsFlipping = false;
      debugNav("returned...");
    }, delay);
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
  if (!diaryOpening && !diaryClosing) {
    playFlip();
    diary.classList.remove("closed");
    // if on desktop the same code will be summoned when
    // the transition-end event is fired. on mobile the classes
    // need to be changed manually
    if (mobile) {
      diary.classList.add("open");
    } else {
      diary.classList.add("opening");
      diaryOpening = true;
    }
  }
}

function closeDiary() {
  if (!diaryOpening && !diaryClosing) {
    playFlip();
    diary.classList.remove("open");
    // if on desktop the same code will be summoned when
    // the transition-end event is fired. on mobile the classes
    // need to be changed manually
    if (mobile) {
      diary.classList.add("closed");
    } else {
      diary.classList.add("closing");
      diaryClosing = true;
    }
  }
}

function startDebuggingAnimations() {
  let diaryContainer = document.querySelector(".diary-container");
  let del = 400;

  let bgs = true,
    inks = true,
    patterns = true;

  let iClass = 10;
  if (bgs) {
    setInterval(() => {
      if (!debugAnimations) {
        return;
      }
      diaryContainer.classList.remove(`cover_${iClass}`);
      if (iClass == bgColors) {
        iClass = 1;
      } else {
        iClass++;
      }
      diaryContainer.classList.add(`cover_${iClass}`);
    }, (del * bgColors) / 4);
  }

  let alpha = "abcdefghijklmnopqrstuvwxyz";
  let iAlpha = 0;

  if (patterns) {
    setInterval(() => {
      if (!debugAnimations) {
        return;
      }
      diaryContainer.classList.remove(`first_${alpha[iAlpha]}`);
      if (iAlpha == alpha.length - 1) {
        iAlpha = 0;
      } else {
        iAlpha++;
      }
      diaryContainer.classList.add(`first_${alpha[iAlpha]}`);
    }, del * 2);
  }

  let iCol = 1;

  if (inks) {
    setInterval(() => {
      if (!debugAnimations) {
        return;
      }
      diaryContainer.classList.remove(`ink_${iCol}`);
      if (iCol == inkColors) {
        iCol = 1;
      } else {
        iCol++;
      }
      diaryContainer.classList.add(`ink_${iCol}`);
    }, del);
  }
}

// first_c cover_4 f_color_8
function setDiaryStyle() {
  let diaryContainer = document.querySelector(".diary-container");
  let firstLetter = mockData.iniciais[0].toLowerCase();
  let bgCode = coverColorCode(
    mockData.iniciais,
    mockData.local,
    mockData.idade,
    mockData.profissao,
    mockData.genero
  );
  let inkCode = inkColorCode(
    mockData.iniciais,
    mockData.local,
    mockData.idade,
    mockData.profissao,
    mockData.genero
  );
  diaryContainer.classList.add(
    `first_${firstLetter}`,
    `cover_${bgCode}`,
    `ink_${inkCode}`
  );
  // diaryContainer.classList.add(`first_e`, `cover_3`, `ink_15`);
}

function paginateContent() {
  let textContainer = document.getElementById("aux-text-container");
  let lineHeight = textContainer.clientHeight;
  let lineLimit = 16.5;
  textContainer.innerHTML = ``;

  let html = [];
  // converts the json to html
  mockData.entries.forEach((e) => {
    let tags = [
      {
        tag: "h1",
        inner_text: e.date,
      },
    ];
    if (e.emoji != "") {
      tags.push({
        tag: "h3",
        inner_text: `<span class="mood">${
          moodKeys[e.emoji]
        }</span><br><span class="emoji">${emojiKeys[e.emoji]}</span>`,
      });
      nEntries++;
    }

    directives.forEach((directive) => {
      // Object.keys(e.open_ended_directives).forEach((key) => {
      if (
        directive.key in e.open_ended_directives &&
        e.open_ended_directives[directive.key] != ""
      ) {
        // title of the directive
        tags.push({
          tag: "h2",
          inner_text: directive.text,
        });

        nEntries++;

        // student-filled text
        let s = e.open_ended_directives[directive.key];
        let parts = s.split("\n");
        parts.forEach((part) => {
          let trimmedString = part.trim();
          let lastSpace = trimmedString.lastIndexOf(" ");
          if (lastSpace != -1) {
            trimmedString =
              trimmedString.substring(0, lastSpace) +
              `\xa0` +
              trimmedString.substring(lastSpace + 1);
          }
          if (part.length > 0) {
            tags.push({
              tag: "p",
              inner_text: trimmedString,
            });
          }
        });
      }
    });

    if (e.img) {
      let caption = "";
      if (e.legenda) {
        caption = linkify(e.legenda);
      }
      tags.push({
        tag: "img",
        src: e.img,
        caption: caption,
      });
      nEntries++;
    }

    html.push({
      week: e.date,
      tags: tags,
    });
  });

  let pages;
  let pageContainer = document.querySelector(".pages-container");
  let currentTag, currentText;

  let pageCount = 2;

  html.forEach((week) => {
    pages = [];
    let imgSrc = "",
      caption;
    week.tags.forEach((tag) => {
      currentTag = tag.tag;
      if (currentTag == "img") {
        imgSrc = tag.src;
        caption = tag.caption;
      } else {
        currentText = tag.inner_text;
        let hasEndedProcessing = false;
        do {
          let node = document.createElement(currentTag);
          node.innerHTML = currentText;
          textContainer.appendChild(node);

          let lines = textContainer.offsetHeight / lineHeight;
          if (
            lines > lineLimit ||
            (currentTag == "h2" && lines > lineLimit - 2)
          ) {
            // Breaks it word by word until the limit is reached.
            textContainer.lastChild.innerHTML = "";
            let words = tag.inner_text.split(" ");
            let foundBreakpoint = false;
            let i = 0;
            // appends each word until the line limit is reached.
            // saves the page and continues from where it stopped
            for (; i < words.length; i++) {
              if (!foundBreakpoint) {
                let oldS = textContainer.lastChild.innerHTML;
                textContainer.lastChild.innerHTML += words[i] + " ";
                lines = textContainer.offsetHeight / lineHeight;
                if (
                  lines > lineLimit ||
                  (currentTag == "h2" && lines > lineLimit - 2)
                ) {
                  foundBreakpoint = true;
                  textContainer.lastChild.innerHTML = oldS;
                  pages.push(linkify(textContainer.innerHTML));
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
      }
    });

    // has ended the week so if there's still stuff in the
    // textContainer “buffer” it needs to be saved as well.
    if (textContainer.innerHTML != ``) {
      pages.push(linkify(textContainer.innerHTML));
      textContainer.innerHTML = ``;
    }

    if (imgSrc != "") {
      textContainer.innerHTML = `<div class="img-container"><p>${caption}</p></div>`;
      let captionH = textContainer.offsetHeight;
      let maxImgH = lineHeight * lineLimit - captionH;
      pages.push(
        `<div class="img-container"><img style="max-height: ${maxImgH}px;" src="${imgSrc}"><p>${caption}</p></div>`
      );
      textContainer.innerHTML = ``;
    }

    // now that the pages have been built, I'll add them to the DOM.
    // this is an extra step so it's easier to do extra customizations.
    for (let i = 0; i < pages.length; i++) {
      let pageNode = document.createElement("div");
      pageNode.classList.add("page");
      if (i % 2 == 0) {
        // pageNode.onclick = function () {
        //   if (!mobilePaginationScheme) {
        //     returnsPages();
        //   }
        // };
      } else {
        // pageNode.onclick = function () {
        //   if (!mobilePaginationScheme) {
        //     advancesPages();
        //   }
        // };
      }
      if (i == 0) {
        pageNode.classList.add("first-page-of-week");
      }
      let textContainer = document.createElement("div");
      textContainer.classList.add("text-container");
      textContainer.innerHTML = pages[i];
      pageNode.appendChild(textContainer);
      pageNode.innerHTML += `<h2 class="date">${week.week}</h2><p class="pg-num">${pageCount}</p>`;
      pageCount++;
      pageContainer.appendChild(pageNode);
    }
  });
  textContainer.innerHTML = ``;
  textContainer.style.display = "none"; // goodbye dear friend
}

// source: https://stackoverflow.com/a/8943487/888094
function linkify(text) {
  var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  return text.replace(urlRegex, function (url) {
    return `<a href="${url}" target="_blank">${url}</a>`;
  });
}

function metaContent() {
  let location = "",
    profession = "",
    initials = "",
    ageSticker = "",
    ageSummary = "",
    entriesPlural;

  for (let i = 0; i < mockData.iniciais.length; i++) {
    initials += mockData.iniciais[i] + ".";
  }

  if (mockData.local != "") {
    location = `Residente de ${mockData.local}`;
  }

  if (mockData.profissao != "") {
    if (mockData.genero === "m") {
      profession = `é um ${mockData.profissao}`;
    } else if (mockData.genero === "f") {
      profession = `é uma ${mockData.profissao}`;
    } else {
      profession = `é ${mockData.profissao}`;
    }
  } else {
    profession = `tem`;
  }

  if ("idade" in mockData) {
    ageSummary = ` de ${mockData.idade} anos`;
    ageSticker = `, ${mockData.idade} anos`;
  }

  if (nEntries == 1) {
    entriesPlural = "entrada";
  } else {
    entriesPlural = "entradas";
  }

  let diarySummary = document.getElementById("diary-summary");
  diarySummary.innerHTML = `${location}, <span class="initials">${initials}</span> ${profession}${ageSummary}. Preencheu este diário entre os dias 27 de abril e 15 de maio de 2020 como parte das atividades da Pré-ONHB 2020 – Olimpíada Nacional em História do Brasil.<br><br>Este diário conta com ${nEntries} ${entriesPlural} sobre as diferentes maneiras que a pandemia afetou a vida de todos, incluindo <span class="initials">${initials}</span>.`;

  let stickerOnTheCover = document.getElementById("sticker");
  stickerOnTheCover.innerHTML = `<p class="who"><span class="initials">${initials}</span>${ageSticker},</p><p class="location">${mockData.local}.</p>`;
}

function prepareDiary() {
  if (!dataLoaded || !fontLoaded) {
    return;
  }

  diary = document.querySelector(".diary");
  paginateContent();
  metaContent();
  detectMobile();

  document.fonts.load('1rem "italian_mosaic_ornamentsRg"').then(() => {
    setDiaryStyle();
    diary.classList.remove("loading");
  });
}

function setDiaryData (data) {
  mockData = data;
  dataLoaded = true;
  prepareDiary();
}

jQuery(function ($) {

  registerListeners();

  function registerListeners () {
    $(window).on('resize', detectMobile);

    $(".cover").on('transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd', function (e) {
      if (e.originalEvent.propertyName === "transform") {
        if (diaryOpening) {
          diary.classList.remove("opening", "closing", "closed");
          diary.classList.add("open");
          diaryOpening = false;
        } else if (diaryClosing) {
          diary.classList.remove("closing", "opening", "open");
          diary.classList.add("closed");
          diaryClosing = false;
        }
      }
    })

    if (debugAnimations) {
      startDebuggingAnimations();
    }

    try {
      document.fonts.ready.then(() => {
        fontLoaded = true;
        prepareDiary();
      });
    }
    catch (e) {
      alert('Por favor, atualize o seu navegador, ou utilize outro.');
    }
  }

  if (!window.fetchDiary) {
    window.fetchDiary = function () {
      fetch("./data/example.json")
          .then((response) => {
            return response.json();
          })
          .then((json) => {
            setDiaryData(json);
          });
    }
  }
  window.fetchDiary();
});
