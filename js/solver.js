var results,
    model = {
    optimize: "profit",
    opType: "max",
    variables: {
    },
    constraints: {
    },
};

results = solver.Solve(model);
console.log(results);
