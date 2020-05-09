let italianMosaicHasLoaded = false,
  dataHasLoaded = false;
let mockData = null;
let diariesList = null;

function setStyles() {
  diariesList.classList.remove("loading");
}

function setupDiariesLinks() {
  mockData.forEach((diary) => {
    console.log(diary);
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
