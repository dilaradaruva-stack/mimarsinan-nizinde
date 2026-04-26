const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvQE_iCLn_t17_pPsZRbQBUFkos0t5uo6c3hdR3I7Mol7dkO-ISnKLeR0pm8lRDTVZQbUDYJCuB3s8/pub?gid=0&single=true&output=csv";
fetch(url, { redirect: 'follow' })
  .then(res => res.text())
  .then(text => console.log(text.split("\\n").slice(0, 3).join("\\n")));

