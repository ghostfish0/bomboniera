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
      html += '<td><div>'
      // html += '<div class="name">'
      html += st_name[id[i][j]]
      // html += '</div>'
      html += '<div class="info">'
      html += 'id: ' + (id[i][j]) + '<br>'
      html += 'res_auto: ' + residences_name[j] + '<br>'
      html += 'region: ' + st_region[id[i][j]] + '<br>'
      html += 'happiness: ' + happiness[id[i][j]][j] + "/" + (residences_name.length - 1) + '<br>'
      html += '</div>'
      html += '</div></td>'
    }
    html += '</tr>';
  }
  html += '</table>';

  main.innerHTML = html;
  return;
}
