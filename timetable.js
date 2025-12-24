const subjects = [
  "Math", "English", "Kiswahili",
  "Biology", "Chemistry", "Physics",
  "Geography", "History"
];

window.generate = function () {
  let text = "";
  for (let d = 1; d <= 5; d++) {
    text += `DAY ${d}\n`;
    for (let p = 1; p <= 5; p++) {
      text += `Period ${p}: ${subjects[Math.floor(Math.random()*subjects.length)]}\n`;
    }
    text += "\n";
  }
  tt.textContent = text;
};
