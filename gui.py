import tkinter as tk
from secondi import allocate_secondi

def run_program():
    try:
        df1, str1 = allocate_secondi('Secondi allocated: ', 'capacity_male',   'secondi_choices_male')
        df2, str2 = allocate_secondi('Seconde allocated: ', 'capacity_female', 'secondi_choices_female')

        df1 = df1.merge(df2, how='outer')
        headers = df1.iloc[0]
        df1 = df1.iloc[1:]

        for col in df1:
            df1[col] = df1[col].sort_values().values
        df1.columns = headers
        df1 = df1.fillna(' ')

        df_string = df1.to_string(index=False)

        results_text.insert(tk.END, df_string)
        config_text.insert(tk.END, str1 + '\n' + str2 + '\n')
    except Exception as e:
        print("An error occurred: ", e)

root = tk.Tk()
root.title("Residence Allocation")
root.grid_columnconfigure(0, weight=1)  # Allow column to stretch to fill space
root.grid_rowconfigure(0, minsize=600)  # Allow row to stretch to fill space

results_text = tk.Text(root)
config_text = tk.Text(root)
results_text.grid(row=0, column=0, sticky=tk.NSEW)  # Allow text widget to fill space
config_text.grid(row=1, column=0, sticky=tk.NSEW)  # Allow text widget to fill space


run_program()

root.mainloop()
