const verbose = true
const shuffleImport = true
const diversifySecondYears = false
const diversifyFirstYears = false
const forceNewResidence = true
const seed = ""
const allocateSecondYears = true
const allocateFirstYears = false

// residences info
let rs_name = []
let rs_capacity = { "first year": [], "second year": [] }
let rs_id = {}

// students info
let st_name = []
let st_tuple = []
let st_region = []
let st_sex = [] // 0 is female, 1 is male
let st_is2ndYear = []
let st_current_residence = []
let st_choices = []

// solver matrices
let sl_happiness = []
let sl_output = {}
let sl_history = []
let ptr_begin_2nd = 0;
let ptr_end_2nd = 0;
let ptr_begin_1st = 0;
let ptr_end_1st = 0;

let regions = []
let regions_expected = {}

// let happiness_curr = 0;
// let diversity_curr = 0;
//

let mostPopularResidence = -1
let leastPopularResidence = -1

function resetAll() {
  rs_name = [];
  rs_capacity = { "first year": [], "second year": [] };
  rs_id = {};

  st_name = [];
  st_tuple = [];
  st_region = [];
  st_sex = [];
  st_is2ndYear = [];
  st_current_residence = [];
  st_choices = [];

  sl_happiness = [];
  sl_output = {};
  ptr_begin_2nd = 0;
  ptr_end_2nd = 0;
  ptr_begin_1st = 0;
  ptr_end_1st = 0;
  regions = [];
  regions_expected = {};
  // happiness_curr = 0;
  // diversity_curr = 0;
  mostPopularResidence = -1;
  leastPopularResidence = -1;
}

async function importData(sheetName) {
  if (verbose) console.log("Importing data..." + sheetName)

  while (rs_name.length) rs_name.pop()
  for (let entry in rs_id) delete rs_id[entry]
  while (rs_capacity["first year"].length) rs_capacity["first year"].pop()
  while (rs_capacity["second year"].length) rs_capacity["second year"].pop()

  const file = document.getElementById('data-spreadsheet').files[0];
  const reader = new FileReader();
  return new Promise((resolve, reject) => {

    reader.onload = function(e) {
      const workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
      let sheet = workbook.Sheets["capacity_" + sheetName]
      let data = XLSX.utils.sheet_to_json(sheet)
      if (verbose) console.log("Residence data: ", data)
      data.forEach((entry) => {
        // if (!rs_name.includes(entry["residence"])){
        // } 
        rs_name.push(entry["residence"])
        rs_id[entry["residence"]] = rs_name.length - 1
        rs_capacity["first year"].push(entry["first year"])
        rs_capacity["second year"].push(entry["second year"])
      })

      // Handle second year data
      sheet = workbook.Sheets["info_" + (sheetName == "male" ? "secondi" : "seconde")]
      data = XLSX.utils.sheet_to_json(sheet)
      if (verbose) console.log("second year data: ", data)
      if (shuffleImport) shuffleArray(data)
      ptr_begin_2nd = st_name.length
      data.forEach((entry) => {
        st_is2ndYear.push(true)
        st_name.push(entry.student.split(", ").join("<br>"))
        st_tuple.push(+entry.tuple)
        st_region.push(new Set(entry.region.split(", ")))
        st_sex.push(sheetName == "male")
        st_current_residence.push(new Set(entry["current residence"].split(", ")))
        st_choices.push(Object.entries(entry).filter(([key, _]) => +key >= 0).map(([_, value]) => value).reverse())

        sl_happiness.push([])
        Object.entries(entry).forEach(([key, value]) => { if (+key >= 0) sl_happiness[sl_happiness.length - 1][rs_id[value]] = +key })
      })
      ptr_end_2nd = st_name.length

      // Handle first year data
      ptr_begin_1st = st_name.length
      sheet = workbook.Sheets["info_" + (sheetName == "male" ? "primi" : "prime")]
      data = XLSX.utils.sheet_to_json(sheet)
      if (verbose) console.log("first year data: ", data)
      if (shuffleImport) shuffleArray(data)
      data.forEach((entry) => {
        st_is2ndYear.push(false)
        st_name.push(entry.student)
        st_tuple.push(false)
        st_region.push(new Set(entry.region.split(", ")))
        st_sex.push(sheetName == "male")
        st_current_residence.push(false)
        st_choices.push([])
        sl_happiness.push(false)
      })
      ptr_end_1st = st_name.length

      if (forceNewResidence) {
        let restotalhappiness = []
        for (let j = 0; j < rs_capacity["second year"].length; j++) {
          restotalhappiness.push(sl_happiness.slice(ptr_begin_2nd, ptr_end_2nd).reduce((a, b) => a + b[j], 0))
        }
        mostPopularResidence = restotalhappiness.reduce((imax, current, i, a) => current > a[imax] ? i : imax, 0);
        leastPopularResidence = restotalhappiness.reduce((imin, current, i, a) => current < a[imin] ? i : imin, 0);
        for (let i = ptr_begin_2nd; i < ptr_end_2nd; i++) {
          if (st_current_residence[i].has(mostPopularResidence))
            sl_happiness[i][mostPopularResidence] = 0;
          if (st_current_residence[i].has(leastPopularResidence) && sl_happiness[i][leastPopularResidence] == 0)
            sl_happiness[i][leastPopularResidence] = 0;
        }
      }
      regions = [...new Set(st_region.map(set => [...set]).flat())].sort()

      resolve()
    }

    reader.onerror = reject

    reader.readAsArrayBuffer(file);
  })
}

async function initDiversity(sheetName) {
  regions_expected[sheetName] = {}
  stats = regions_expected[sheetName]
  stats.overall = { "first year": {}, "second year": {} }

  if (verbose) console.log("init diversity", st_region)


  for (let i = 0; i < st_region.length; i++) {
    if ((sheetName == "male" && !st_sex[i]) || (sheetName == "female" && st_sex[i])) continue
    for (let rg of st_region[i]) {
      let year = st_is2ndYear[i] ? "second year" : "first year"
      stats.overall[year][rg] = stats.overall[year][rg] + 1 || 1;
    }
  }
  Object.keys(stats.overall).forEach((year) => {
    let st_count = rs_capacity[year].reduce((a, b) => a + b, 0);
    regions.forEach(rg => stats.overall[year][rg] /= st_count)
    for (let i = 0; i < rs_capacity[year].length; i++) {
      res = rs_name[i]
      stats[res] = stats[res] || {}
      stats[res][year] = {}
      regions.forEach(rg => {
        stats[res][year][rg] = {
          min: Math.floor(rs_capacity[year][i] * stats.overall[year][rg]),
          max: Math.ceil(rs_capacity[year][i] * stats.overall[year][rg])
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

const prng = splitmix32(Date.now())
