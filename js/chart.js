const context = document.getElementById('diversity-chart').getContext('2d');
let datasets = {}
let chart

function calculateChart() {
  datasets = {}

  let rss_ids = []
  Object.keys(sl_output).forEach((k, i) => {rss_ids[i] = k})

  for (let r of regions) {
    datasets[r] = {
      label: r,
      data: [],
    }
  }
  for (let j = 0; j < rss_ids.length; j++) {
    for (let i of sl_output[rss_ids[j]]) {
      for (let r of st_region[i]) {
        datasets[r].data[j] = datasets[r].data[j] + 1 || 1
      }
    }
  }
  for (let j = 0; j < rss_ids.length; j++) {
    let s = 0
    for (let r of regions) {
      if (!datasets[r].data[j]) continue
      s += datasets[r].data[j]
    }
    console.log(s)
    for (let r of regions) {
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
      labels: Object.keys(sl_output),
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
