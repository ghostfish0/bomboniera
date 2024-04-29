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
    e.dataTransfer.setData('text/id', this.id);
    e.dataTransfer.setData('text/res', Array.from(this.classList).find(cls => cls.startsWith('res_')));
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
      let resSrc = Array.from(this.classList).find(cls => cls.startsWith('res_'));
      let resDes = e.dataTransfer.getData('text/res');

      let resSrcid = residences_id[resSrc.split('res_')[1]];
      let resDesid = residences_id[resDes.split('res_')[1]];
      let indexSrc = soltable[resSrcid].indexOf(+this.id);
      let indexDes = soltable[resDesid].indexOf(+dragSrcEl.id);

      [soltable[resSrcid][indexSrc], soltable[resDesid][indexDes]] = [soltable[resDesid][indexDes], soltable[resSrcid][indexSrc]];

      dragSrcEl.innerHTML = this.innerHTML;
      dragSrcEl.id = this.id;
      dragSrcEl.classList.add(resDes)
      dragSrcEl.classList.remove(resSrc)

      e.currentTarget.id = e.dataTransfer.getData('text/id');
      e.currentTarget.innerHTML = e.dataTransfer.getData('text/html');
      e.currentTarget.classList.add(resSrc);
      e.currentTarget.classList.remove(resDes);

      updateChart()
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

