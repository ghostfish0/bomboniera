# RES-ALLOCATION 

A small Python script that optimally allocate students to residences according to their prefences. UWC Adriatic 22-24' :) 

## Overview

There were once dark days in which the fate of students lied in the hands of the unkind gods of human error or a random number generator. Once and for all, we shall be blessed with the might of the algorithm.

## Pre-requisites

- Python 3.6 or later
-   `pandas`
-   `openpyxl`
-   `Google OR-Tools`

Install the required Python packages with `pip install pandas openpyxl ortools`

## Usage

1. Clone the repo
2. Input the capacity of each residence and students' preference ranked lists into the Excel file. 
3. Run the program with the Excel file as input: `python main.py --input yourfile.xlsx`
4. The program will output the allocation to a CSV file.

## License

[MIT](https://choosealicense.com/licenses/mit/)