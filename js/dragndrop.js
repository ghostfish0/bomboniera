async function initDragnDrop() {
  if (verbose) console.log("initDragDrop")

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
    e.dataTransfer.setData('text/id', this.id);
    e.dataTransfer.setData('text/title', this.title);
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

      let res0 = Array.from(this.classList).find(cls => cls.startsWith('res_')).split('res_')[1];
      let res1 = e.dataTransfer.getData('text/res').split('res_')[1];
      let i0 = sl_output[res0].indexOf(id0);
      let i1 = sl_output[res1].indexOf(id1);

      [sl_output[res0][i0], sl_output[res1][i1]] = [sl_output[res1][i1], sl_output[res0][i0]];

      let html0 = "";
      html0 += 'id: ' + id1
      html0 += (st_sex[id1] ? " ♂️" : " ♀️") + " ";
      html0 += (st_is2ndYear[id1] ? "🦅" : "🐣") + "<br>";
      html0 += "🌎 " + [...st_region[id1]].join(" & ") + "<br>"
      if (st_is2ndYear[id1]) {
        let happi = st_choices[id1].length - st_choices[id1].indexOf(res0)
        html0 += (happi > 1 ? "😆".repeat(happi) : "😭")
      }
      html0 += '<br>'
      let html1 = "";
      html1 += 'id: ' + id0
      html1 += (st_sex[id0] ? " ♂️" : " ♀️") + " ";
      html1 += (st_is2ndYear[id0] ? "🦅" : "🐣") + "<br>";
      html1 += "🌎 " + [...st_region[id0]].join(" & ") + "<br>"
      if (st_is2ndYear[id0]) {
        let happi = st_choices[id0].length - st_choices[id0].indexOf(res1)
        html1 += (happi > 1 ? "😆".repeat(happi) : "😭")
      }
      html1 += '<br>'

      dragSrcEl.innerHTML = this.innerHTML;
      dragSrcEl.id = this.id;
      dragSrcEl.title = this.title;
      dragSrcEl.classList.add(res1);
      dragSrcEl.classList.remove(res0);
      dragSrcEl.querySelector('.info').innerHTML = html1;

      e.currentTarget.id = e.dataTransfer.getData('text/id');
      e.currentTarget.title = e.dataTransfer.getData('text/title');
      e.currentTarget.innerHTML = e.dataTransfer.getData('text/html');
      e.currentTarget.classList.add(res0);
      e.currentTarget.classList.remove(res1);
      e.currentTarget.querySelector('.info').innerHTML = html0;

      updateChart()
      console.log(calculateZ())
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

function calculateZ() {
  let z = 0
  for (let res in sl_output) {
    sl_output[res].forEach(e => {
      // console.log(e, res, st_choices[e].length - st_choices[e].indexOf(res))
      z += st_choices[e].length - st_choices[e].indexOf(res) - 1
    });
  }
  return z
}
