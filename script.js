function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",");
  return lines.slice(1).map(line => {
    const values = line.split(",");
    const obj = {};
    headers.forEach((h,i)=>obj[h]=values[i]||"");
    return obj;
  });
}
async function fetchCSV(path){const res=await fetch("data/"+path);return parseCSV(await res.text());}
function generateUsername(name){const p=name.trim().split(/\s+/);return p.length>=2?`${p[0].toLowerCase()}.${p[p.length-1].toLowerCase()}`:p[0].toLowerCase();}
let teachersList=[],studentsList=[];

document.getElementById("loginBtn").onclick=async()=>{
  const role=document.getElementById("role").value;
  const user=document.getElementById("username").value.trim().toLowerCase();
  const pass=document.getElementById("password").value.trim();
  if(!teachersList
