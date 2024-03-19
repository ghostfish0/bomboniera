from __future__ import print_function
from ortools.sat.python import cp_model
import time
import pandas as pd
import numpy as np

def allocate_secondi(name, capacitystr, choicesstr, sheetstr): 
    capacity=pd.read_excel('residence_allocation_data.xlsx', index_col=0, sheet_name=capacitystr)
    capacity=capacity.reset_index()
    choices=pd.read_excel('residence_allocation_data.xlsx', index_col=0, sheet_name=choicesstr)
    choices = choices.sample(frac=1).reset_index(drop=True)
    choices=choices.reset_index()

    array=np.empty((len(choices), len(capacity)))
    array.fill(100)
    cost = pd.DataFrame(data=array)
    cost.index=choices['student']
    cost.columns=capacity['residence']

    choices=choices.set_index(['student'])
    for i in choices.index:
        for j in choices.columns:
            if j == 'index':
                continue 
            s=choices.loc[i, j]
            cost.loc[i,s]=j
    choices=choices.reset_index()

    cost=cost.to_numpy()
    cost=cost.astype(int)

    sizes = capacity['secondi']
    sizes=sizes.to_numpy()
    sizes=sizes.astype(int)

    model = cp_model.CpModel()
    start = time.time()

    num_workers = len(cost)
    num_tasks = len(cost[1])

    # Variables
    x = []
    for i in range(num_workers):
        t = []
        for j in range(num_tasks):
            t.append(model.NewIntVar(0, 1, "x[%i,%i]" % (i, j)))
        x.append(t)
    x_array = [x[i][j] for i in range(num_workers) for j in 
    range(num_tasks)]

    # Constraints
    # Each residence can be allocated no more students than its capacity.
    [model.Add(sum(x[i][j] for i in range(num_workers)) <= sizes[j])
    for j in range(num_tasks)]

    # Each student can only be allocated to 1 residence.
    [model.Add(sum(x[i][j] for j in range(num_tasks)) == 1)
    for i in range(num_workers)]

    model.Minimize(sum([np.dot(x_row, cost_row) for (x_row, cost_row) in 
    zip(x, cost)]))
    solver = cp_model.CpSolver()
    solver.parameters.num_search_workers = 8
    status = solver.Solve(model)

    output_data = []

    for j in range(num_tasks):
        task_output = []
        task_output.append(capacity.loc[j,'residence'])
        for i in range(num_workers):
            if solver.Value(x[i][j]) >= 1:
                task_output.append((choices.loc[i,'student'] + ' ' + str(num_tasks - cost[i][j])))
        output_data.append(task_output)

    end = time.time()

    if status == cp_model.OPTIMAL:
        print(name, 'Total satisfaction = ', num_tasks * num_workers - int(solver.ObjectiveValue()), ', Theoretical satisfaction = ', num_tasks * num_workers)

    # Convert the output data to a DataFrame and write it to an Excel file
    df = pd.DataFrame(output_data)
    df = df.T
    df.to_csv("secondi.csv", mode='a', header=False, index=False, sep='\t', encoding='utf-8')

if __name__ == '__main__':
    allocate_secondi('Secondi allocated: ', 'capacity_male',   'secondi_choices_male', 'secondi')
    allocate_secondi('Seconde allocated: ', 'capacity_female', 'secondi_choices_female', 'seconde')