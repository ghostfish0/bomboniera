import solver from './solver.js';

async function allocate() {
  await solver("male", happiness, capacity, tuple, region, soltable)
  await solver("female", happiness, capacity, tuple, region, soltable)
  initDragnDrop()
}

window.allocate = allocate;
