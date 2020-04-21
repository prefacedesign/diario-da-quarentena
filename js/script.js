let mobile = false;
let pgW = 400,
  marg = pgW / 20,
  smBrkpnt = pgW * 2 + marg * 2;

let pageIndex = 4;
let pages = document.querySelectorAll(".page");
let mobilePaginationScheme = false;
let pageOffset = 2;
let flipDelay = 250;

function detectMobile() {
  let w = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  );
  mobile = w < smBrkpnt;

  // detects a change in size which should redo the pagination
  if (mobile && !mobilePaginationScheme) {
    mobilePaginationScheme = true;
    pageOffset = 1;
    flipDelay = 0;
  } else if (!mobile && mobilePaginationScheme) {
    mobilePaginationScheme = false;

    // if current page is even i'll set index to its
    // even pair
    if (pageIndex % 2 != 0) {
      pageIndex -= 1;
    }
    pageOffset = 2;
    flipDelay = 250;
  }
}

function advancesPages() {
  // are there more pages to flip to?
  if (pageIndex + pageOffset < pages.length) {
    pages[pageIndex].classList.remove("current");
    pages[pageIndex].classList.add("past");
    pages[pageIndex + 1].classList.add("past");

    if (!mobilePaginationScheme) {
      pages[pageIndex + 1].classList.add("zoom-top");
      setTimeout(() => {
        pages[pageIndex + 1].classList.remove("zoom-top");
        pageIndex += pageOffset;
        pages[pageIndex].classList.add("current");
      }, flipDelay);
    } else {
      pageIndex += pageOffset;
      pages[pageIndex].classList.add("current");
    }
  }
}

function returnsPages() {
  // have we reached the start of the book?
  if (pageIndex - pageOffset >= 0) {
    pages[pageIndex].classList.remove("current");

    if (!mobilePaginationScheme) {
      pages[pageIndex + 1].classList.add("zoom-top");
    }

    pageIndex -= pageOffset;
    pages[pageIndex].classList.remove("past");
    pages[pageIndex].classList.add("current");

    setTimeout(() => {
      if (!mobilePaginationScheme) {
        pages[pageIndex + pageOffset + 1].classList.remove("zoom-top");
      }
      pages[pageIndex + 1].classList.remove("past");
    }, flipDelay);
  }
}

window.addEventListener("resize", detectMobile);

detectMobile();
