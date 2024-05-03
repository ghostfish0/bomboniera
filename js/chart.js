const context = document.getElementById('diversity-chart').getContext('2d');
let datasets = {}
let chart

function calculateChart() {
  datasets = {}

  for (let r of curr_regions) {
    datasets[r] = {
      label: r,
      data: [],
    }
  }
  for (let j = 0; j < residences_name.length; j++) {
    if (!soltable[j]) continue
    for (let i of soltable[j]) {
      datasets[st_region[i]].data[j] = datasets[st_region[i]].data[j] + 1 || 1
    }
  }
  for (let j = 0; j < residences_name.length; j++) {
    let s = 0
    for (let r of curr_regions) {
      if (!datasets[r].data[j]) continue
      s += datasets[r].data[j]
    }
    for (let r of curr_regions) {
      datasets[r].data[j] /= s
    }
  }
}
function updateChart() {
  console.log("update chart")
  calculateChart()
  chart.data.datasets = Object.values(datasets)
  chart.update('none')
}
function initChart() {
  if (verbose) console.log("Init Chart")
  calculateChart()
  chart = new Chart(context, {
    type: 'bar',
    data: {
      labels: residences_name,
      datasets: Object.values(datasets),
    },
    options: {
      indexAxis: 'y',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              size: 9,
            }
          }
        },
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            font: {
              size: 9,
            }
          },
          max: 1,
        },
        y: {
          stacked: true,
          position: 'right',
          ticks: {
            font: {
              size: 9,
            }
          }

        }
      },
      responsive: true,
      maintainAspectRatio: false,
    }
  });

  chart.canvas.parentNode.style.height = '20rem';
}
