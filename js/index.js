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

  // For each key in soltable
  for (let key in soltable) {
    // For each item in the array for this key
    for (let i = 0; i < soltable[key].length; i++) {
      // If this row doesn't exist yet in ws_data, add it
      if (!ws_data[i]) {
        ws_data[i] = [];
      }

      // Add this item to the row
      ws_data[i][key] = st_name[soltable[key][i]];
    }
  }

  ws_data = [residences_name, ... ws_data]

  console.log(ws_data)

  // Create a new worksheet with data
  let ws = XLSX.utils.aoa_to_sheet(ws_data);

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // Write the workbook to a file
  XLSX.writeFile(wb, 'soltable.xlsx');
}

window.allocate = allocate;
window.exportXLSX = SolToXLSX;
