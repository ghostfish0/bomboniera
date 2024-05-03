function writetotable() {
  const entries = Object.entries(sl_output).map((entry) => entry[1]);
  console.log(entries)
  const maxlength = Math.max(...entries.map(row => row.length))
  const rows = Array.from({ length: maxlength }).map((_, j) => entries.map(row => row[j]));
  const id = [Object.keys(sl_output), ...rows.map(row => row.map(item => item === undefined || item === null || item === '' ? '' : item))];
  console.log(id)

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
      html += st_is2ndYear[st] ? "info_secondi " : "info_primi " + " "
      html += 'res_' + id[0][j] + ' '
      html += '\' id=\''
      html += st
      html += '\' title=\"'
      html += st_choices[st].join('&#013;')
      html += '\">'
      // html += '<div class="name">'
      html += st_name[st]
      // html += '</div>'
      html += '<div class="info">'
      html += 'id: ' + st
      html += (st_sex[st] ? " ♂️" : " ♀️") + " "
      html += (st_is2ndYear[st] ? "🦅" : "🐣") + "<br>"
      html += "🌎 " + [... st_region[st]].join(" & ") + "<br>"
      if (st_is2ndYear[st]) {
        let happi = st_choices[st].length - st_choices[st].indexOf(id[0][j])
        html += (happi > 1 ? "😆".repeat(happi) : "😭")
      }
      html += '<br>'
      html += '</div>'
      html += '</div></td>'
    }
    html += '</tr>';
  }
  html += '</table>';

  document.getElementById("main").innerHTML = html;
}
