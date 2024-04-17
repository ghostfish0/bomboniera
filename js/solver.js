import GLPK from '../dist/index.js';
(async () => {

  const glpk = await GLPK();

  function flatten(sol) {
    const table = Object.entries(sol.result.vars)
      .filter(([_, value]) => value === 1)
      .map(([key]) => key.match(/x_(\d+)_(\d+)/).slice(1).map(Number))
      .reduce((acc, [first, second]) => {
        (acc[second] = acc[second] || []).push(first);
        return acc;
      }, {});
    const entries = Object.entries(table);
    const headers = entries.map(([key]) => key);
    const rows = entries[0][1].map((_, i) => entries.map(([, values]) => values[i]));
    return [headers, ...rows].map(row => row.map(item => item === undefined || item === null || item === '' ? '' : item));
  }

  function solve_allocatesecondi(capacity, happiness) {
    var lp = {
      name: 'Assignment Problem',
      objective: {
        direction: glpk.GLP_MAX,
        name: 'obj',
        vars: [],
      },
      subjectTo: [],
      binaries: [],
    };

    var students_cnt = happiness.length
    var res_cnt = happiness[0].length
    var variables = lp.objective.vars
    var constraints = lp.subjectTo
    // var bounds = lp.bounds
    var binaries = lp.binaries

    // creating the variables
    for (let i = 0; i < students_cnt; i++)
      for (let j = 0; j < res_cnt; j++) {
        variables.push({ // objective function
          name: `x_${i}_${j}`,
          coef: happiness[i][j],
        })
        binaries.push(`x_${i}_${j}`)
      }

    // each student can only be assigned to one residence
    for (let i = 0; i < students_cnt; i++) {
      constraints.push({
        name: `student ${i}`,
        vars: [],
        bnds: {
          type: glpk.GLP_FX,
          ub: 1,
          lb: 1
        }
      })
      for (let j = 0; j < res_cnt; j++) {
        constraints[i].vars.push({
          name: `x_${i}_${j}`,
          coef: 1
        })
      }
    }

    // each residence can only be assigned (at most or equal to) its capacity
    for (let j = 0; j < res_cnt; j++) {
      constraints.push({
        name: `residence ${j}`,
        vars: [],
        bnds: {
          type: glpk.GLP_FX,
          ub: capacity[j],
          lb: capacity[j]
        }
      })
      for (let i = 0; i < students_cnt; i++) {
        constraints[students_cnt + j].vars.push({
          name: `x_${i}_${j}`,
          coef: 1
        })
      }
    }

    const opt = {
      msglev: glpk.GLP_MSG_OFF
    };

    glpk.solve(lp, opt)
      .then(sol => {
        happiness_curr = sol.result.z
        document.getElementById("happiness-curr").innerHTML = sol.result.z
        document.getElementById("happiness-max").innerHTML += sol.result.z
        writetotable(main, flatten(sol))
      })
      .catch(err => console.log(err));

    // console.log(await glpk.solve(lp, glpk.GLP_MSG_DBG));
  }

  solve_allocatesecondi(capacity, happiness);
})();

