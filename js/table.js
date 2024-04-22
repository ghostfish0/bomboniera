const main = document.getElementById("main")

function writetotable() {
  const entries = Object.entries(soltable).map((entry) => entry[1]);
  const maxlength = Math.max(...entries.map(row => row.length))
  const rows = Array.from({ length: maxlength }).map((_, j) => entries.map(row => row[j]));
  const id = [residences_name, ...rows.map(row => row.map(item => item === undefined || item === null || item === '' ? '' : item))];

  let html = '<table><thead>' + Array.from(id[0], (x) => '<th><div>' + x + '</div></th>').join('') + '</thead>';
  for (let i = 1; i < id.length; i++) {
    html += '<tr>';
    for (let j = 0; j < id[i].length; j++) {
      if (id[i][j] === '') {
        html += '<td></td>';
        continue;
      }
      html += '<td><div title=\''
      html += st_name[id[i][j]] + '&#013;'
      html += 'id: ' + (id[i][j]) + '&#013;'
      html += 'res (by algorithm): ' + residences_name[j] + '&#013;'
      html += 'happiness: ' + happiness[id[i][j]][j] + "/" + (residences_name.length - 1) + '&#013;'
      html += '\'>'
      html += st_name[id[i][j]] + ''
      html += ' _  ' + happiness[id[i][j]][j] + "/" + (residences_name.length - 1) 
      html += ' _  ' + id[i][j]+ '</div>'
      html += '</td>';
    }
    html += '</tr>';
  }
  html += '</table>';

  main.innerHTML = html;
  return;
}
