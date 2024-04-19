var residences_name = []
var residences_id = {}
var students_name = []
var capacity = []
var happiness = []

var soltable = {}
var happiness_curr = 0;
var diversity_curr = 0;

function importData(sheetName) {
  // console.log("Importing data..." + sheetName)

  while (residences_name.length) residences_name.pop()
  for (let entry in residences_id) delete residences_id[entry]
  while (students_name.length) students_name.pop()
  while (capacity.length) capacity.pop()
  while (happiness.length) happiness.pop()

  const file = document.getElementById('data-spreadsheet').files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    // const sheetName = workbook.SheetNames[0];
    var sheet = workbook.Sheets["capacity_" + sheetName];
    XLSX.utils.sheet_to_json(sheet).forEach((entry) => {
      residences_name.push(entry["residence"])
      residences_id[entry["residence"]] = residences_name.length - 1
      capacity.push(entry["second year"])
    })

    sheet = workbook.Sheets["choices_" + sheetName];
    XLSX.utils.sheet_to_json(sheet).forEach((entry) => {
      students_name.push(entry.student)
      happiness.push([])
      Object.entries(entry).forEach(([key, value]) => happiness[happiness.length - 1][residences_id[value]] = +key)
    })
  }

  reader.readAsArrayBuffer(file);
}

