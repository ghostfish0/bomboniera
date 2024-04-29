async function initDragnDrop() {
  console.log("initDragDrop")

  let cells = document.querySelectorAll('#main td div');
  // console.log(cells)

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
    e.dataTransfer.setData('text/title', this.title);
    e.dataTransfer.setData('text/id', this.id);
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
      dragSrcEl.title = this.title;
      dragSrcEl.id = this.id;
      e.currentTarget.innerHTML = e.dataTransfer.getData('text/html');
      e.currentTarget.title = e.dataTransfer.getData('text/title');
      e.currentTarget.id = e.dataTransfer.getData('text/id');
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

}

