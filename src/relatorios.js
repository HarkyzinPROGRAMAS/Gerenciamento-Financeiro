import Chart from 'chart.js/auto'

(async function() {
  const data = [
    { categoria: "Alimentação", count: 860 },
    { categoria: "Aluguel", count: 1700 },
    { categoria: "Transportes", count: 265 },
    { categoria: "Lazer", count: 2400 },
    { categoria: "Conta de Água", count: 150 },
    { categoria: "Conta de Luz", count: 300 },
  ];

  new Chart(
    document.getElementById('relatorios'),
    {
      type: "doughnut",
      data: {
        labels: data.map(row => row.categoria),
        datasets: [
          {
            label: 'Valor',
            data: data.map(row => row.count)
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            labels: {
              color: 'white',
              font: {
                size: 14
              }
            }
          }
        }
      }
    }
  );
})();