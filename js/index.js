import solver from './solver.js';

async function allocate() {
  await importData("male")
  await initDiversity("male")
  await solver("male", happiness, capacity, tuple, st_region, soltable)
  await importData("female")
  await initDiversity("female")
  await solver("female", happiness, capacity, tuple, st_region, soltable)
  initDragnDrop()
  initChart()
  document.getElementById('verbose').addEventListener('change',(show_additional_info) => {
    if (verbose) console.log("Toggle Show additional info")
    document.querySelectorAll('.info').forEach((e) => {
      if (show_additional_info.target.checked) {
        e.style.display = 'block';
      } else {
        e.style.display = 'none';
      }
    })
  }
  )
}

allocate()

window.allocate = allocate;
