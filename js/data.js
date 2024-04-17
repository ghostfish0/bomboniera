const data = [
  ['OO', 'FORE', 'PALA', 'PURN', 'LUCC', 'SHOL', 'PLES'],
  ['‎', '‎', '‎', '‎', '‎', '‎', ''],
  ['‎', '‎', '', '‎', '‎', '', '‎'],
  ['‎', '‎', '‎', '‎', '‎', '‎', '‎'],
  ['‎', '', '‎', '‎', '‎', '‎', '‎'],
  ['‎', '‎', '‎', '‎', '‎', '‎', '‎'],
  ['‎', '‎', '', '‎', '‎', '‎', '‎'],
  ['‎', '‎', '‎', '‎', '‎', '‎', '‎'],
  ['‎', '‎', '‎', '‎', '‎', '‎', '‎'],
  ['‎', '‎', '‎', '', '‎'],
  ['‎', '‎', '‎', '‎', '‎'],
  ['', '‎', '‎', '‎', '‎'],
  ['', '‎', '‎', '‎', '‎'],
  ['', '‎', '', '‎', '‎'],
  ['', '‎', '‎'],
  ['', '‎', '‎'],
  ['', '', '‎'],
  ['', '‎', '‎'],
  ['', '‎', '‎'],
  ['', '‎', '‎'],
  ['', '‎', '‎'],
  ['', '‎', '‎'],
  ['', '‎']
];

function importData() {
    const file = document.getElementById('data-spreadsheet').files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, {header: 1});
        console.log(jsonData);
    };
    reader.readAsArrayBuffer(file);
}

const residences_name = ['OO', 'FORE', 'PALA', 'PURN', 'LUCC']
const students_name = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
const capacity = [3, 3, 1, 2, 1]
const happiness = [
  [0, 1, 2, 3, 4],
  [0, 1, 2, 3, 4],
  [1, 0, 4, 2, 3],
  [1, 0, 4, 2, 3],
  [3, 4, 0, 1, 2],
  [3, 4, 0, 1, 2],
  [4, 0, 3, 2, 1],
  [4, 0, 3, 2, 1],
  [2, 0, 1, 3, 4],
  [2, 0, 1, 3, 4],
]



var happiness_curr = 0;
var diversity_curr = 0;
