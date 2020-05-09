let italianMosaicHasLoaded = false,
  dataHasLoaded = false;
let mockData = null;
let diariesList = null;

function setStyles() {
  diariesList.classList.remove("loading");
}

function setupDiariesLinks() {
  mockData.forEach((diary) => {
    let bgCode = coverColorCode(
      diary.initials,
      diary.location,
      diary.age,
      diary.profession,
      diary.gender
    );
    let inkCode = inkColorCode(
      diary.initials,
      diary.location,
      diary.age,
      diary.profession,
      diary.gender
    );

    let initials = "",
      age = "",
      firstLetter = diary.initials[0].toLowerCase();
    for (let i = 0; i < diary.initials.length; i++) {
      initials += diary.initials[i] + ".";
    }

    if (diary.age != "") {
      age = ", " + diary.age + " anos";
    }

    let diaryLink = document.createElement("div");
    diaryLink.classList.add(
      "diary-link",
      `first_${firstLetter}`,
      `cover_${bgCode}`,
      `ink_${inkCode}`
    );

    // the heading
    let header = document.createElement("header");
    let h1 = document.createElement("h1");
    h1.innerHTML = initials + age;
    header.appendChild(h1);
    if (diary.location != "") {
      let h2 = document.createElement("h2");
      h2.innerHTML = diary.location;
      header.appendChild(h2);
    }
    diaryLink.appendChild(header);

    // the decoration
    let deco = document.createElement("div");
    deco.classList.add("diary-decoration");
    diaryLink.append(deco);

    // the link & eventually etc
    let anchor = document.createElement("a");
    anchor.title = `Acesse o diário de ${initials}`;
    anchor.href = diary.link;
    anchor.appendChild(document.createTextNode("Ler este diário"));
    diaryLink.appendChild(anchor);

    diariesList.appendChild(diaryLink);
  });
}

(function () {
  diariesList = document.getElementById("diaries-list");
  document.fonts.load('1rem "italian_mosaic_ornamentsRg"').then(() => {
    italianMosaicHasLoaded = true;
    if (dataHasLoaded) {
      setStyles();
    }
  });
})();

fetch("../data/catalogo.json")
  .then((response) => {
    return response.json();
  })
  .then((json) => {
    mockData = json;
    dataHasLoaded = true;

    setupDiariesLinks();
    if (italianMosaicHasLoaded) {
      setStyles();
    }
  });
