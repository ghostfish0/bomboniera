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

## FAQs

**Q: How does it work?**
We prioritize anyone with special needs who have gone and talked to Aparna, and Giorgia/Eva. Once their requests are taken care of, the algorithm receives the other secondi's ranked list of the residences in order of their preference. The basic idea is using happiness points. Say my ranked list is: PURN, LUCC, PALA, OO, FORE. If I get into PURN, I have 5 points! If I get into FORE, I have only 1 point. Likewise, LUCC, PALA and OO in order give me 4, 3 and 2 points. The algorithm says: Let's take the total sum of happiness points from everyone and try to find the allocation that maximizes this sum! Once the secondi are fully allocated, the algorithm uses the upcoming primi to balance out the diversity in each residence.
It is also OK if you don't understand the math, this is a "trust me bro" thing and I hope you have trust that the algorithm works as it is intended.

Well, what if I want to understand the math? If you're reading the source, you're at the right place :)

**Q: You said everyone has a right to have a preference, why am I still in one of my lesser favorite residences? Everyone has a right to have a preference but the spaces in each residence is limited.**
The algorithm tries to maximize the overall happiness of everyone but someone has to be the unluckier one. It is sad to say, but the outcome decided by the algorithm is mathematically optimal (see below): it literally can't get any better than that. Unless you have a medical/mental/physical/... based reason to be in Purnama or Fore, you can't really want it and need it more than the other students... But if you do have such a reason, please discuss with Aparna. 


**Q: What about roommates?**
Due to technical constraints, for now the algorithm only allows you to choose 1 residence mate, and this means you two are coupled together. Essentially, you two are treated as one singular entry in the program, that takes up twice the space while everything else is the same. This means you are guaranteed to be in the same residence wit that person. Disclaimer: Applying single doesn't mean you will be in a single room, it means you don't really care who your roommate is. Applying coupled also doesn't mean you will be only with your partner, it means you two might/might not have 1 or 2 other roomates with you.


**Q: Not roomate, but residence mate?**
The algorithm doesn't put you into rooms, it put you into residences. The residence tutors then take the output and divide you into rooms. By default, if you are coupled with someone it is implied that you want to be roomate with them. But if you want to be only residence mate, put a little note in the form. 


**Q: I can trick the algorithm! I will put Purnama not as my 1st choice so it is less competitive for me**
This is simply NOT true. The algorithm tries to make you happy, if you put Purnama lower down the rank, it will think you are happier not being in Purnama! Just be real and choose what you really want to be in.

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
