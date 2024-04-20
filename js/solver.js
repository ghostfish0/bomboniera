import GLPK from '../dist/index.js';

async function mergeSols(obj1, obj2) {
  // console.log("Merging solutions...\n", obj1, obj2)
  for (let key in obj2) {
    if (obj1[key]) {
      obj1[key] = [...obj1[key], ...obj2[key]];
    } else {
      obj1[key] = obj2[key];
    }
  }
  // console.log("Finished merging...\n", obj1)
  return obj1;
}

async function handleSolution(name, sol, soltable) {
  // console.log("Handling solution..." + name, soltable, flatten(sol))
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

async function solve_secondi(name, happiness, capacity, soltable) {
  // console.log("Solving...")

  await importData(name)

  const glpk = await GLPK();

  console.log(name)
  let lp = {
    name: 'Assignment Problem',
    objective: {
      direction: glpk.GLP_MAX,
      name: 'obj',
      vars: [],
    },
    subjectTo: [],
    binaries: [],
  };

  let students_cnt = happiness.length
  let res_cnt = capacity.length
  let variables = lp.objective.vars
  let constraints = lp.subjectTo
  // let bounds = lp.bounds
  let binaries = lp.binaries

  // creating the variables
  for (let i = startid; i < endid; i++)
    for (let j = 0; j < res_cnt; j++) {
      if (happiness[i - startid][j] == 0) continue;
      variables.push({ // objective function
        name: `x_${i}_${j}`,
        coef: happiness[i - startid][j],
      })
      binaries.push(`${name}_${i}_${j}`)
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
        coef: 1
      })
    }
  }

  const opt = {
    msglev: glpk.GLP_MSG_OFF
    // msglev: glpk.GLP_MSG_ALL
  };

  await glpk.solve(lp, opt)
    .then(sol => (async () => { await handleSolution(name, sol, soltable, startid); })())
    .catch(err => console.log(err));

}

export default solve_secondi
