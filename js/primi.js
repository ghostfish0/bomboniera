function distributeElements(elements, k) {
  // Calculate the total count and the count for each group
  let totalCount = elements.length;
  let groupCounts = {};
  for (let element of elements) {
    if (!groupCounts[element.group]) {
      groupCounts[element.group] = 0;
    }
    groupCounts[element.group]++;
  }

  // Calculate the ratio for each group
  let groupRatios = {};
  for (let group in groupCounts) {
    groupRatios[group] = groupCounts[group] / totalCount;
  }

  // Initialize the smaller arrays and their group counts
  let smallerArrays = new Array(k).fill(null).map(() => []);
  let smallerArrayGroupCounts = new Array(k).fill(null).map(() => ({}));

  // Distribute the elements
  for (let element of elements) {
    // Find the smaller array that currently has the fewest elements from this group
    let smallestArrayIndex = 0;
    let smallestArrayCount = Infinity;
    for (let i = 0; i < k; i++) {
      let count = smallerArrayGroupCounts[i][element.group] || 0;
      if (count < smallestArrayCount) {
        smallestArrayIndex = i;
        smallestArrayCount = count;
      }
    }

    // Add the element to the smallest array and update the count
    smallerArrays[smallestArrayIndex].push(element);
    if (!smallerArrayGroupCounts[smallestArrayIndex][element.group]) {
      smallerArrayGroupCounts[smallestArrayIndex][element.group] = 0;
    }
    smallerArrayGroupCounts[smallestArrayIndex][element.group]++;
  }

  return smallerArrays;
}

let elements = [
  { group: 'A' },
  { group: 'A' },
  { group: 'B' },
  { group: 'B' },
  { group: 'B' },
  { group: 'C' },
  // ...
];

let smallerArrays = distributeElements(elements, 3);
