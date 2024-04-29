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
      let st = id[i][j]
      if (st === '') {
        html += '<td></td>';
        continue;
      }
      html += '<td><div class=\''
      html += is2ndYear[st] ? "info_secondi " : "info_primi " + " "
      html += 'res_' + residences_name[j] + ' '
      html += '\' id=\''
      html += st
      html += '\'>'
      // html += '<div class="name">'
      html += st_name[st]
      // html += '</div>'
      html += '<div class="info">'
      html += 'id: ' + st
      html += (sex[st] ? " ♂️" : " ♀️") + " "
      html += (is2ndYear[st] ? "🦅" : "🐣") + "<br>"
      html += "🌎 " + st_region[st] + "<br>"
      if (is2ndYear[st]) html += (happiness[st][j] > 0 ? "😆".repeat(happiness[st][j]) : "😭")
      html += '<br>'
      html += '</div>'
      html += '</div></td>'
    }
    html += '</tr>';
  }
  html += '</table>';

  main.innerHTML = html;
  return;
}
