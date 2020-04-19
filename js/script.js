let mobile = false;
let pgW = 400,
  marg = pgW / 20,
  smBrkpnt = pgW * 2 + marg * 2;

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
}

window.addEventListener("resize", detectMobile);

detectMobile();
