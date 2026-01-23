const canvas = document.getElementById('myChart');

const labels = JSON.parse(canvas.dataset.labels);
const getup_data = JSON.parse(canvas.dataset.getup);
const feeling_data = JSON.parse(canvas.dataset.feeling);

new Chart(document.getElementById('myChart'), {
  type: 'line',
  data: {
    labels: labels,
    datasets: [
      {
        label: 'Feeling score',
        data: getup_data,
      },
      {
        label: 'Get up score',
        data: feeling_data,
      },
    ],
  },
  options: {
    scales: {
      y: {
        min: 0,
        max: 10,
        beginAtZero: true,
      },
    },
    animations: {
      y: {
        from: 0,
      },
    },
  },
});
