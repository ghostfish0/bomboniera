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
      let id0 = +this.id;
      let id1 = +dragSrcEl.id;

      let res0 = Array.from(this.classList).find(cls => cls.startsWith('res_'));
      let res1 = e.dataTransfer.getData('text/res');

      let res0id = residences_id[res0.split('res_')[1]];
      let res1id = residences_id[res1.split('res_')[1]];
      let i0 = soltable[res0id].indexOf(id0);
      let i1 = soltable[res1id].indexOf(id1);

      [soltable[res0id][i0], soltable[res1id][i1]] = [soltable[res1id][i1], soltable[res0id][i0]];

      let html0 = "";
      html0 += (sex[id1] ? " ♂️" : " ♀️") + " ";
      html0 += (is2ndYear[id1] ? "🦅" : "🐣") + "<br>";
      html0 += "🌎 " + st_region[id1] + '<br>';
      if (is2ndYear[id1]) html0 += (happiness[id1][res0id] > 0 ? "😆".repeat(happiness[id1][res0id]) : happiness[id1][res0id] < 0 ? "🚫" : "😭")
      html0 += '<br>'
      let html1 = "";
      html1 += (sex[id0] ? " ♂️" : " ♀️") + " ";
      html1 += (is2ndYear[id0] ? "🦅" : "🐣") + "<br>";
      html1 += "🌎 " + st_region[id0] + '<br>';
      if (is2ndYear[id0]) html1 += (happiness[id0][res1id] > 0 ? "😆".repeat(happiness[id0][res1id]) : happiness[id0][res1id] < 0 ? "🚫" : "😭")
      html1 += '<br>'

      dragSrcEl.innerHTML = this.innerHTML;
      dragSrcEl.id = this.id;
      dragSrcEl.classList.add(res1);
      dragSrcEl.classList.remove(res0);
      dragSrcEl.querySelector('.info').innerHTML = html1;

      e.currentTarget.id = e.dataTransfer.getData('text/id');
      e.currentTarget.innerHTML = e.dataTransfer.getData('text/html');
      e.currentTarget.classList.add(res0);
      e.currentTarget.classList.remove(res1);
      e.currentTarget.querySelector('.info').innerHTML = html0;
      
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

