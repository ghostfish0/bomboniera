function generateTable(data) {
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
  return html;
}

document.getElementById("main").innerHTML = generateTable(data);

