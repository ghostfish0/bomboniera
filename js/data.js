let verbose = false
let shuffleImport = true
let diversifySecondYears = true
let diversifyFirstYears = false

// residences info
let residences_name = []
let capacity = { "first year": [], "second year": [] }
let residences_id = {}

// students info
let st_name = []
let tuple = []
let st_region = []
let sex = [] // 0 is female, 1 is male
let is2ndYear = []

// happiness matrix
let happiness = []
let soltable = {}
let startid = 0;
let endid = 0;
let startid_1 = 0;
let endid_1 = 0;
let curr_regions = []
let regions = {}
let happiness_curr = 0;
let diversity_curr = 0;


async function importData(sheetName) {
  if (verbose) console.log("Importing data..." + sheetName)

  while (residences_name.length) residences_name.pop()
  for (let entry in residences_id) delete residences_id[entry]
  while (capacity["first year"].length) capacity["first year"].pop()
  while (capacity["second year"].length) capacity["second year"].pop()

  const file = document.getElementById('data-spreadsheet').files[0];
  const reader = new FileReader();
  return new Promise((resolve, reject) => {

    reader.onload = function(e) {
      const workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
      let sheet = workbook.Sheets["capacity_" + sheetName]
      let data = XLSX.utils.sheet_to_json(sheet)
      if (verbose) console.log("Residence data: ", data)
      data.forEach((entry) => {
        residences_name.push(entry["residence"])
        residences_id[entry["residence"]] = residences_name.length - 1
        capacity["first year"].push(entry["first year"])
        capacity["second year"].push(entry["second year"])
      })

      sheet = workbook.Sheets["info_" + (sheetName == "male" ? "secondi" : "seconde")]
      data = XLSX.utils.sheet_to_json(sheet)
      if (verbose) console.log("second year data: ", data)
      if (shuffleImport) shuffleArray(data)
      startid = st_name.length
      data.forEach((entry) => {
        is2ndYear.push(true)
        st_name.push(entry.student)
        tuple.push(+entry.tuple)
        st_region.push(entry.region)
        sex.push(sheetName == "male")

        happiness.push([])
        Object.entries(entry).forEach(([key, value]) => { if (+key >= 0) happiness[happiness.length - 1][residences_id[value]] = +key })
      })
      endid = st_name.length

      startid_1 = st_name.length
      sheet = workbook.Sheets["info_" + (sheetName == "male" ? "primi" : "prime")]
      data = XLSX.utils.sheet_to_json(sheet)
      if (verbose) console.log("first year data: ", data)
      if (shuffleImport) shuffleArray(data)
      data.forEach((entry) => {
        is2ndYear.push(false)
        st_name.push(entry.student)
        tuple.push(false)
        st_region.push(entry.region)
        sex.push(sheetName == "male")
        happiness.push(false)
      })
      endid_1 = st_name.length

      curr_regions = [...new Set(st_region)]

      resolve()
    }

    reader.onerror = reject

    reader.readAsArrayBuffer(file);
  })
}

async function initDiversity(sheetName) {
  regions[sheetName] = {}
  stats = regions[sheetName]
  stats.overall = { "first year": {}, "second year": {} }

  if (verbose) console.log("init diversity", st_region)


  for (let i = 0; i < st_region.length; i++) {
    if ((sheetName == "male" && !sex[i]) || (sheetName == "female" && sex[i])) continue
    let rg = st_region[i]
    let year = is2ndYear[i] ? "second year" : "first year"
    stats.overall[year][rg] = stats.overall[year][rg] + 1 || 1;
  }
  Object.keys(stats.overall).forEach((year) => {
    let st_count = capacity[year].reduce((a, b) => a + b, 0);
    curr_regions.forEach(rg => stats.overall[year][rg] /= st_count)
    for (let i = 0; i < capacity[year].length; i++) {
      res = residences_name[i]
      stats[res] = stats[res] || {}
      stats[res][year] = {}
      curr_regions.forEach(rg => {
        stats[res][year][rg] = {
          min: Math.floor(capacity[year][i] * stats.overall[year][rg]),
          max: Math.ceil(capacity[year][i] * stats.overall[year][rg])
        }
      })
    }
  })
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function splitmix32(a) {
  return function() {
    a |= 0;
    a = a + 0x9e3779b9 | 0;
    let t = a ^ a >>> 16;
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ t >>> 15;
    t = Math.imul(t, 0x735a2d97);
    return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
  }
}

const prng = splitmix32(Date.now() * Math.random())
