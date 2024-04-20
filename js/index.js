import solver from './solver.js';

async function allocate() {
  await solver("male", happiness, capacity, soltable)
  await solver("female", happiness, capacity, soltable)
}

window.allocate = allocate;
