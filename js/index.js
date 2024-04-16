let data = [
  ['RESIDENCE 1', 'RESIDENCE 2', 'RESIDENCE 3', 'RESIDENCE 4', 'RESIDENCE 5', 'RESIDENCE 6'],
  ['Student 1', 'Student 2', 'Student 3', 'Student 4', 'Student 5', 'Student 6'],
  ['Student 7', 'Student 8', 'Student 9', 'Student 10', 'Student 11', 'Student 12'],
  ['Student 13', 'Student 14', 'Student 15', 'Student 16', 'Student 17', 'Student 18'],
  ['Student 19', 'Student 20', 'Student 21', 'Student 22', 'Student 23', 'Student 24'],
  ['Student 25', 'Student 26', 'Student 27', 'Student 28', 'Student 29', 'Student 30'],
  ['Student 31', 'Student 32', 'Student 33', 'Student 34', 'Student 35', 'Student 36'],
  ['Student 37', 'Student 38', 'Student 39', 'Student 40', 'Student 41', 'Student 42'],
  ['Student 43', 'Student 44', 'Student 45', 'Student 46', 'Student 47', 'Student 48'],
  ['Student 49', 'Student 50', 'Student 51', 'Student 52', 'Student 53', 'Student 54'],
  ['Student 1', 'Student 2', 'Student 3', 'Student 4', 'Student 5', 'Student 6'],
  ['Student 7', 'Student 8', 'Student 9', 'Student 10', 'Student 11', 'Student 12'],
  ['Student 13', 'Student 14', 'Student 15', 'Student 16', 'Student 17', 'Student 18'],
  ['Student 19', 'Student 20', 'Student 21', 'Student 22', 'Student 23', 'Student 24'],
  ['Student 25', 'Student 26', 'Student 27', 'Student 28', 'Student 29', 'Student 30'],
  ['Student 31', 'Student 32', 'Student 33', 'Student 34', 'Student 35', 'Student 36'],
  ['Student 37', 'Student 38', 'Student 39', 'Student 40', 'Student 41', 'Student 42'],
  ['Student 43', 'Student 44', 'Student 45', 'Student 46', 'Student 47', 'Student 48'],
  ['Student 49', 'Student 50', 'Student 51', 'Student 52', 'Student 53', 'Student 54'],
];

function generateTable(table, data) {
  let html = '<table><thead>' + Array.from(data[0], (x) => '<th><div>' + x + '</div></th>').join('') + '</thead>';
  for (let i = 1; i < data.length; i++) {
    html += '<tr>';
    for (let j = 0; j < data[i].length; j++) {
      html += '<td><div title=' + '\'' + data[i][j] + '\'' + '>' + data[i][j] + '</div></td>';
    }
    html += '</tr>';
  }
  html += '</table>';
  return html;
}

document.getElementById("main").innerHTML = generateTable("main", data);
document.addEventListener('DOMContentLoaded', () => {

  let cells = document.querySelectorAll('#main td div');

  document.getElementById('manual').checked = false;
  document.getElementById('manual').addEventListener('change', () => { // toggle draggable
    cells.forEach(cell => {
      cell.draggable = !cell.draggable;
    });

  });

  function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    e.dataTransfer.setDragImage(crt, 0, 0);
  }

  function handleDragEnd() {
    cells.forEach(c => {
      c.classList.remove('over');
    });
  }

  function handleDragOver(e) {
    e.preventDefault();
    return false;
  }

  function handleDragEnter() {
    this.classList.add('over');
  }

  function handleDragLeave() {
    this.classList.remove('over');
  }

  function handleDrop(e) {
    e.stopPropagation(); // stops the browser from redirecting.
    if (dragSrcEl !== this) {
      dragSrcEl.innerHTML = this.innerHTML;
      e.currentTarget.innerHTML = e.dataTransfer.getData('text/html');
    }
    return false;
  }

  cells.forEach(function(cell) {
    cell.addEventListener('dragstart', handleDragStart);
    cell.addEventListener('dragover', handleDragOver);
    cell.addEventListener('dragenter', handleDragEnter);
    cell.addEventListener('dragleave', handleDragLeave);
    cell.addEventListener('dragend', handleDragEnd);
    cell.addEventListener('drop', handleDrop);
  });

})
