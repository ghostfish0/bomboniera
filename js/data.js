let verbose = false
let shuffleImport = false

// residences info
let residences_name = []
let capacity = [[], []]
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
let regions = {}
let endid = 0;
let happiness_curr = 0;
let diversity_curr = 0;


async function importData(sheetName) {
  if (verbose) console.log("Importing data..." + sheetName)

  while (residences_name.length) residences_name.pop()
  for (let entry in residences_id) delete residences_id[entry]
  while (capacity[0].length) capacity[0].pop()
  while (capacity[1].length) capacity[1].pop()

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
        capacity[0].push(entry["first year"])
        capacity[1].push(entry["second year"])
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
      resolve()
    }

    reader.onerror = reject

    reader.readAsArrayBuffer(file);
  })
}

async function initDiversity(sheetName) {
  regions[sheetName] = {}
  stats = regions[sheetName]
  stats.overall = {}

  console.log("init diversity", st_region)

  let curr_regions = [...new Set(st_region)]

  console.log(st_region.length)
  st_region.forEach(item => {
    stats.overall[item] = stats.overall[item] + 1 || 0;
    console.log(item)
  })
  console.log(regions)
  Object.keys(stats.overall).forEach(key => stats.overall[key] = stats.overall[key] / st_region.length)

  for (let j = 0; j < capacity[0].length; j++) {
    stats[j] = {}
    curr_regions.forEach(region => stats[j][region] = (capacity[0][j] + capacity[1][j]) * stats.overall[region])
    stats[j][curr_regions[curr_regions.length - 1]] += capacity[0][j] + capacity[1][j] - Object.values(stats[j]).reduce((sum, value) => sum + value, 0)
    curr_regions.forEach(region => stats[j][region] = Math.ceil(stats[j][region]))
    // console.log(capacity[0][j] + capacity[1][j], Object.values(stats[j]).reduce((sum, value) => sum + value, 0))
  }

  // console.log("Region: ", stats)
  //
  // for (let j in soltable) {
  //   for (let i in soltable[residence]) {
  //     stats[j][st_region[i]]--;
  //   }
  // }
  //
  // console.log("Region: ", stats)
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
