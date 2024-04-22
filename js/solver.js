import GLPK from '../dist/index.js';

async function mergeSols(obj1, obj2) {
  if (verbose) console.log("Merging solutions...\n", obj1, obj2)
  for (let key in obj2) {
    if (obj1[key]) {
      obj1[key] = [...obj1[key], ...obj2[key]];
    } else {
      obj1[key] = obj2[key];
    }
  }
  if (verbose) console.log("Finished merging...\n", obj1)
  return obj1;
}

async function handleSolution(name, sol, soltable) {
  if (verbose) console.log("Handling solution..." + name, soltable, flatten(sol))
  soltable = await mergeSols(soltable, flatten(sol))
  document.getElementById("happiness-curr").innerHTML = +document.getElementById("happiness-curr").innerHTML + sol.result.z
  document.getElementById("happiness-max").innerHTML = +document.getElementById("happiness-max").innerHTML + sol.result.z
  writetotable()
}

function flatten(sol) {
  const table = Object.entries(sol.result.vars)
    .filter(([_, value]) => value === 1)
    .map(([key]) => key.match(/x_(\d+)_(\d+)/)
      .slice(1).map(Number))
    .reduce((acc, [key, value]) => {
      (acc[value] = acc[value] || []).push(+key)
      return acc;
    }, {})
  return table;
}

async function solve_secondi(name, happiness, capacity, tuple, soltable) {
  if (verbose) console.log("Solving..." + name)

  await importData(name)

  const glpk = await GLPK();

  let lp = {
    name: name,
    objective: {
      direction: glpk.GLP_MAX,
      name: 'obj',
      vars: [],
    },
    subjectTo: [],
    bounds: [],
    binaries: [],
    generals: [],
  };

  let res_cnt = capacity.length
  let variables = lp.objective.vars
  let constraints = lp.subjectTo
  let bounds = lp.bounds
  let binaries = lp.binaries
  let generals = lp.generals

  // creating the variables
  for (let i = startid; i < endid; i++)
    for (let j = 0; j < res_cnt; j++) {
      if (happiness[i][j] == 0) continue;
      variables.push({ // objective function
        name: `x_${i}_${j}`,
        coef: happiness[i][j],
      })
      binaries.push(`x_${i}_${j}`)
    }

  // each student can only be assigned to one residence
  for (let i = startid; i < endid; i++) {
    constraints.push({
      name: `x_${i}`,
      vars: [],
      bnds: {
        type: glpk.GLP_FX,
        ub: 1,
        lb: 1
      }
    })
    for (let j = 0; j < res_cnt; j++) {
      constraints[i - startid].vars.push({
        name: `x_${i}_${j}`,
        coef: 1
      })
    }
  }

  // each residence can only be assigned (at most or equal to) its capacity
  for (let j = 0; j < res_cnt; j++) {
    constraints.push({
      name: `residence_${j}`,
      vars: [],
      bnds: {
        type: glpk.GLP_FX,
        ub: capacity[j],
        lb: capacity[j]
      }
    })
    for (let i = startid; i < endid; i++) {
      constraints[constraints.length - 1].vars.push({
        name: `x_${i}_${j}`,
        coef: tuple[i],
      })
    }
  }

  const opt = {
    // msglev: verbose ? glpk.GLP_MSG_ALL : glpk.GLP_MSG_OFF
    msglev: glpk.GLP_MSG_OFF,
  };


  await glpk.solve(lp, opt)
    .then(sol => (async () => { await handleSolution(name, sol, soltable, startid); })())
    .catch(err => console.log(err));

  // (async () => {console.log(await glpk.write(lp))})()

  // document.getElementById("solution").innerHTML = await glpk.write(lp)
}

async function solve_primi(name, capacity, soltable) {

}

export default solve_secondi
