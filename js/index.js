import solver from './solver.js';

async function allocate() {
  importData("male")
  await solver(happiness, capacity, soltable)
  importData("female")
  await solver(happiness, capacity, soltable)
}

window.allocate = allocate;
allocate();
