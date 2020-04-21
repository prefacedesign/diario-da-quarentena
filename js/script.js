let mobile = false;
let pgW = 400,
  marg = pgW / 20,
  smBrkpnt = pgW * 2 + marg * 2;

let pageIndex = 4;
let pages = document.querySelectorAll(".page");
function detectMobile() {
  let w = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  );
  mobile = w < smBrkpnt;
  if (mobile) {
    document.body.style.backgroundColor = "cyan";
  } else {
    document.body.style.backgroundColor = "#ffd21f";
  }
function advancesPages() {
  // are there more pages to flip to?
  if (pageIndex + 2 < pages.length) {
    pages[pageIndex].classList.remove("current");
    pages[pageIndex].classList.add("past");
    pages[pageIndex + 1].classList.add("past");

    pages[pageIndex + 1].classList.add("zoom-top");

    setTimeout(() => {
      pages[pageIndex + 1].classList.remove("zoom-top");
      pageIndex += 2;
      pages[pageIndex].classList.add("current");
    }, 250);
  }
}

function returnsPages() {
  // have we reached the start of the book?
  if (pageIndex - 2 >= 0) {
    pages[pageIndex].classList.remove("current");

    pages[pageIndex + 1].classList.add("zoom-top");

    pageIndex -= 2;
    pages[pageIndex].classList.remove("past");
    pages[pageIndex].classList.add("current");

    setTimeout(() => {
      pages[pageIndex + 2 + 1].classList.remove("zoom-top");
      pages[pageIndex + 1].classList.remove("past");
    }, 250);
  }
}

window.addEventListener("resize", detectMobile);

detectMobile();
