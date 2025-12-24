window.generate = function () {
  let m = +math.value, e = +eng.value, b = +bio.value;
  let total = m + e + b;
  let avg = total / 3;

  let div =
    avg >= 75 ? "I" :
    avg >= 60 ? "II" :
    avg >= 45 ? "III" : "IV";

  report.innerText =
`TOTAL: ${total}
AVERAGE: ${avg.toFixed(1)}
DIVISION: ${div}`;
}
