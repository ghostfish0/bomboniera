import GLPK from '../dist/index.js';

async function handleSolution(sol) {
  if (verbose) console.log("Handling solution...")
  sol = flatten(sol)
  sl_history.push(sol)
  sl_output = await mergeSols(sl_output, sol)
  writetotable()
  // document.getElementById("happiness-curr").innerHTML = +document.getElementById("happiness-curr").innerHTML + sol.result.z
  // document.getElementById("happiness-max").innerHTML = +document.getElementById("happiness-max").innerHTML + sol.result.z
}

async function solve_secondi(name, happiness, capacity, tuple, soltable) {
  if (verbose) console.log("Solving secondi..." + name)

  const glpk = await GLPK();

  let lp = {
    name: "secondi " + name,
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

  let res_cnt = capacity["second year"].length
  let variables = lp.objective.vars
  let constraints = lp.subjectTo
  // let bounds = lp.bounds
  let binaries = lp.binaries
  // let generals = lp.generals

  // creating the variables
  for (let i = ptr_begin_2nd; i < ptr_end_2nd; i++)
    if (st_is2ndYear[i])
      for (let j = 0; j < res_cnt; j++) {
        if (happiness[i][j] == 0 || !happiness[i][j]) continue;
        variables.push({ // objective function
          name: `x_${i}_${j}`,
          coef: happiness[i][j],
        })
        binaries.push(`x_${i}_${j}`)
      }

  // each student can only be assigned to one residence
  for (let i = ptr_begin_2nd; i < ptr_end_2nd; i++)
    if (st_is2ndYear[i]) {
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
        constraints[i - ptr_begin_2nd].vars.push({
          name: `x_${i}_${j}`,
          coef: 1
        })
      }
    }

  // each residence can only be have equal to its capacity
  for (let j = 0; j < res_cnt; j++) {
    constraints.push({
      name: `residence_${j}`,
      vars: [],
      bnds: {
        type: glpk.GLP_FX,
        ub: capacity["second year"][j],
        lb: capacity["second year"][j]
      }
    })
    for (let i = ptr_begin_2nd; i < ptr_end_2nd; i++)
      if (st_is2ndYear[i]) {
        constraints[constraints.length - 1].vars.push({
          name: `x_${i}_${j}`,
          coef: tuple[i],
        })
      }
  }

  // each residence can only have students of a regional group as much as calculated
  if (diversifySecondYears) {
    for (let r of regions) {
      for (let j = 0; j < res_cnt; j++) {
        let UB = regions_expected[name][rs_name[j]]["second year"][r].max + 1
        let LB = Math.min(1, regions_expected[name][rs_name[j]]["second year"][r].min - 1)
        LB = 0
        let st = {
          name: `region_${r}_res_${rs_name[j]}`,
          vars: [],
          bnds: {
            type: glpk.GLP_DB,
            ub: UB,
            lb: LB
          }
        }
        for (let i = ptr_begin_2nd; i < ptr_end_2nd; i++)
          if (st_is2ndYear[i] && st_region[i].has(r)) {
            st.vars.push({
              name: `x_${i}_${j}`,
              coef: tuple[i],
            })
          }
        console.log(st)
        // constraints.push(st)
      }
    }
  }
  const opt = {
    // msglev: verbose ? glpk.GLP_MSG_ALL : glpk.GLP_MSG_OFF
    msglev: glpk.GLP_MSG_ERR,
    // msglev: glpk.GLP_MSG_DBG,
  };

  await glpk.solve(lp, opt)
    .then(sol => (async () => { await handleSolution(sol); })())
    .catch(err => {
      console.log("SOLUTION ERROR")
      console.log(err)
    });

  // (async () => { console.log(await glpk.write(lp)) })()

}


async function solve_primi(name, capacity, st_region) {
  if (verbose) console.log("Solving primi..." + name)

  const glpk = await GLPK();

  let lp = {
    name: "primi " + name,
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

  let res_cnt = capacity["first year"].length
  let variables = lp.objective.vars
  let constraints = lp.subjectTo
  // let bounds = lp.bounds
  let binaries = lp.binaries
  // let generals = lp.generals

  // creating the variables
  for (let i = ptr_begin_1st; i < ptr_end_1st; i++)
    if (!st_is2ndYear[i])
      for (let j = 0; j < res_cnt; j++) {
        variables.push({ // objective function
          name: `x_${i}_${j}`,
          coef: 1,
        })
        binaries.push(`x_${i}_${j}`)
      }

  // each student can only be assigned to one residence
  for (let i = ptr_begin_1st; i < ptr_end_1st; i++)
    if (!st_is2ndYear[i]) {
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
        constraints[i - ptr_begin_1st].vars.push({
          name: `x_${i}_${j}`,
          coef: 1
        })
      }
    }

  // each residence can only be have equal to its capacity
  for (let j = 0; j < res_cnt; j++) {
    constraints.push({
      name: `residence_${j}`,
      vars: [],
      bnds: {
        type: glpk.GLP_FX,
        ub: capacity["first year"][j],
        lb: capacity["first year"][j]
      }
    })
    for (let i = ptr_begin_1st; i < ptr_end_1st; i++)
      if (!st_is2ndYear[i]) {
        constraints[constraints.length - 1].vars.push({
          name: `x_${i}_${j}`,
          coef: 1,
        })
      }
  }

  // each residence can only have students of a regional group as much as calculated
  if (diversifyFirstYears) {
    for (let r of regions) {
      for (let j = 0; j < res_cnt; j++) {
        let st = {
          name: `region_${r}_res_${rs_name[j]}`,
          vars: [],
          bnds: {
            type: glpk.GLP_DB,
            ub: regions_expected[name][rs_name[j]]["first year"][r].max,
            lb: regions_expected[name][rs_name[j]]["first year"][r].min,
          }
        }
        for (let i = ptr_begin_1st; i < ptr_end_1st; i++)
          if (st_is2ndYear[i] && st_region[i] == r) {
            st.vars.push({
              name: `x_${i}_${j}`,
              coef: 1,
            })
          }
        constraints.push(st)
      }
    }
  }
  const opt = {
    // msglev: verbose ? glpk.GLP_MSG_ALL : glpk.GLP_MSG_OFF
    msglev: glpk.GLP_MSG_OFF,
    // msglev: glpk.GLP_MSG_DBG,
  };


  await glpk.solve(lp, opt)
    .then(sol => (async () => { await handleSolution(sol, soltable); })())
    .catch(err => {
      console.log("SOLUTION ERROR")
      console.log(err)
    });

  (async () => { console.log(await glpk.write(lp)) })()
}

async function general_solver(name, happiness, capacity, tuple, region, soltable) {
  if (allocateSecondYears) await solve_secondi(name, happiness, capacity, tuple, soltable)
  if (allocateFirstYears) await solve_primi(name, capacity, region, soltable)
}

async function mergeSols(obj1, obj2) {
  if (verbose) console.log("Merging solutions...\n", obj1, obj2)
  for (let key in obj2) {
    if (obj1[key]) {
      obj1[key] = [...obj1[key], ...obj2[key]];
    } else {
      obj1[key] = obj2[key];
    }
  }
  obj1 = Object.keys(obj1).sort().reduce((result, key) => {
    result[key] = obj1[key].sort((a, b) => {return (st_name[a] < st_name[b] ? -1 : (st_name[a] != st_name[b]))});
    return result;
  }, {});
  if (verbose) console.log("Finished merging...\n", obj1)
  return obj1;
}

function flatten(sol) {
  const table = Object.entries(sol.result.vars)
    .filter(([_, value]) => value === 1)
    .map(([key]) => key.match(/x_(\d+)_(\d+)/)
      .slice(1).map(Number))
    .reduce((acc, [key, value]) => {
      (acc[rs_name[value]] = acc[rs_name[value]] || []).push(+key)
      return acc;
    }, {})
  return table;
}

export default general_solver;
