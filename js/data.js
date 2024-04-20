let residences_name = []
let residences_id = {}
let students_name = []
let capacity = []
let happiness = []

let soltable = {}
let startid = 0;
let endid = 0;
let happiness_curr = 0;
let diversity_curr = 0;
let mylet = 0;

async function importData(sheetName) {
  // console.log("Importing data..." + sheetName)

  while (residences_name.length) residences_name.pop()
  for (let entry in residences_id) delete residences_id[entry]
  // while (students_name.length) students_name.pop()
  while (capacity.length) capacity.pop()
  while (happiness.length) happiness.pop()

  const file = document.getElementById('data-spreadsheet').files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
    let sheet = workbook.Sheets["capacity_" + sheetName];
    let data = XLSX.utils.sheet_to_json(sheet)
    data.forEach((entry) => {
      residences_name.push(entry["residence"])
      residences_id[entry["residence"]] = residences_name.length - 1
      capacity.push(entry["second year"])
    })

    sheet = workbook.Sheets["choices_" + sheetName]
    data = XLSX.utils.sheet_to_json(sheet)
    shuffleArray(data)
    data.forEach((entry) => {
      students_name.push(entry.student)
      happiness.push([])
      Object.entries(entry).forEach(([key, value]) => happiness[happiness.length - 1][residences_id[value]] = +key)
    })
    startid = (endid == 0 ? 0 : endid)
    endid = students_name.length
  }

  reader.readAsArrayBuffer(file);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
