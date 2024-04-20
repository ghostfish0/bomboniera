import solver from './solver.js';

async function allocate() {
  await solver("male", happiness, capacity, tuple, soltable)
  // await solver("female", happiness, capacity, tuple, soltable)
}

window.allocate = allocate;
