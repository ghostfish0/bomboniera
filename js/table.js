const main = document.getElementById("main")

function writetotable(el, data) {
  let html = '<table><thead>' + Array.from(data[0], (x) => '<th><div>' + residences_name[x] + '</div></th>').join('') + '</thead>';
  for (let i = 1; i < data.length; i++) {
    html += '<tr>';
    for (let j = 0; j < data[i].length; j++) {
      if (data[i][j] === '') {
        html += '<td></td>';
        continue;
      }
      html += '<td><div title=' + '\'' + students_name[data[i][j]] + '\'' + '>' + students_name[data[i][j]] + '</div></td>';
    }
    html += '</tr>';
  }
  html += '</table>';

  el.innerHTML = html;
  return;
}

writetotable(main, data);

