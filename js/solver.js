import GLPK from '../dist/index.js';
(async () => {

  const glpk = await GLPK();

  function print(sol) {
    const el = window.document.getElementById('results');
    // let pairs = selected_values.map(varName => {
    // const selected_values = Object.entries(sol.result.vars).filter(([_, value]) => value === 1).map(([key, _]) => key);
    //   let match = varName.match(/x_(\d+)_(\d+)/);
    //   return match ? [parseInt(match[1]), parseInt(match[2])] : null;
    // });
    let table = Object.entries(sol.result.vars)
      .filter(([_, value]) => value === 1)
      .map(([key]) => key.match(/x_(\d+)_(\d+)/).slice(1).map(Number))
      .reduce((acc, [first, second]) => {
        (acc[second] = acc[second] || []).push(first);
        return acc;
      }, {});

    // Assuming `el` is the element where you want to display the table
    el.innerHTML = `<table>${Object.entries(table).map(([key, values]) =>
      `<tr><th>${key}</th>${values.map(value => `<td>${value}</td>`).join('')}</tr>`
    ).join('')}</table>`;

  };

  const capacity = [3, 3, 1, 2, 1]
  // fore pala  oo purn lucc
  const happiness = [
    [0, 1, 2, 3, 4],
    [1, 0, 4, 2, 3],
    [3, 4, 0, 1, 2],
    [4, 0, 3, 2, 1],
    [2, 0, 1, 3, 4],
    [0, 1, 2, 3, 4],
    [1, 0, 4, 2, 3],
    [3, 4, 0, 1, 2],
    [4, 0, 3, 2, 1],
    [2, 0, 1, 3, 4],
  ]
  var lp = {
    name: 'Assignment Problem',
    objective: {
      direction: glpk.GLP_MAX,
      name: 'obj',
      vars: [],
    },
    subjectTo: [],
    // bounds: [],
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
      // bounds.push({ // bounds
      //   name: `x_${i}_${j}`,
      //   type: glpk.GLP_DB,
      //   ub: 1,
      //   lb: 0
      // })
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

  console.log(lp);

  glpk.solve(lp, opt)
    .then(sol => print(sol))
    .catch(err => console.log(err));

  console.log(await glpk.solve(lp, glpk.GLP_MSG_DBG));

  // window.document.getElementById('cplex').innerHTML = await glpk.write(lp);

})();

