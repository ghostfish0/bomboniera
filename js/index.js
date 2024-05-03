import solver from './solver.js';

async function allocate() {
  await Promise.resolve(resetAll());
  await importData("male")
  await initDiversity("male")
  await solver("male", sl_happiness, rs_capacity, st_tuple, st_region, sl_output)
  await importData("female")
  await initDiversity("female")
  await solver("female", sl_happiness, rs_capacity, st_tuple, st_region, sl_output)
  initDragnDrop()
  if (!chart) initChart()
  document.getElementById('verbose').addEventListener('change', (show_additional_info) => {
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

function SolToXLSX() {
  let wb = XLSX.utils.book_new();

  // Create an array of arrays for the worksheet data
  let ws_data = [];

  for (let key in sl_output) {
    for (let i = 0; i < sl_output[key].length; i++) {
      if (!ws_data[i]) {
        ws_data[i] = [];
      }
      ws_data[i][key] = st_name[sl_output[key][i]];
    }
  }
  ws_data = [rs_name, ... ws_data]

  let ws = XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, 'soltable.xlsx');
}

window.allocate = allocate;
window.exportXLSX = SolToXLSX;
