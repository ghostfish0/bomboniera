const main = document.getElementById("main")

function writetotable() {
  const entries = Object.entries(soltable).map((entry) => entry[1]);
  const maxlength = Math.max(...entries.map(row => row.length))
  const rows = Array.from({ length: maxlength }).map((_, j) => entries.map(row => row[j]));
  const data = [residences_name, ...rows.map(row => row.map(item => item === undefined || item === null || item === '' ? '' : item))];

  let html = '<table><thead>' + Array.from(data[0], (x) => '<th><div>' + x + '</div></th>').join('') + '</thead>';
  for (let i = 1; i < data.length; i++) {
    html += '<tr>';
    for (let j = 0; j < data[i].length; j++) {
      if (data[i][j] === '') {
        html += '<td></td>';
        continue;
      }
      html += '<td><div title=' + '\'' + data[i][j] + '\'' + '>' + data[i][j] + '</div></td>';
    }
    html += '</tr>';
  }
  html += '</table>';

  main.innerHTML = html;
  return;
}
