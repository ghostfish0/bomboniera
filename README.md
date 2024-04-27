# BOMBONIERA

Bomboniera (meaning candybox in Italian) is a small utility to put students into their dorms :) 

## Usage
You can either use the [hosted version](http://ghostfish0.github.io/bomboniera) of the app or clone the repo and host it with a local server. 

## Motives
Bomboniera allocates students to dorms with three philophies in mind: 
1. Everyone has a right to have a preference 
2. The allocation is deliberately diverse 
3. The allocation is fair 

## How it works
This is an implementation of the Assignment Problem, powered by (GLPK)[https://www.gnu.org/software/glpk/]
See also (glpk.js)[https://www.npmjs.com/package/glpk.js]

## Todo 

- implement solve primi feature: 
    - **done** order should be secondi - primi - seconde - prime 
    - object: cultural group
        - male
            - overall - both secondi and primi: calculate a function 
            - loop: each residence - current
            - loop: calculate: each residence - the amount to be added 
- add graph 

Collegio del Mondo Unito dell'Adriatico - 2024

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
