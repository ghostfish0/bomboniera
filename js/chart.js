var context = document.getElementById('diversity-chart').getContext('2d');
var chart = new Chart(context, {
  type: 'bar',
  data: {
    labels: ['OO', 'FORE', 'PALA', 'PLES', 'SHOL', 'PURN', 'LUCC'],
    datasets: [
      {
        label: 'worst',
        data: [17, 16, 4, 1],
      },
      {
        label: 'Okay',
        data: [4, 2, 10, 6],
      },
      {
        label: 'bad',
        data: [2, 21, 3, 24],
      }
    ],
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
        }
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
