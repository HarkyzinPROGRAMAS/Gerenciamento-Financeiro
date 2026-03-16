const transacoes = [
    {
        tipo: "despesa",
        descricao: "Feira",
        valor: 1200,
        data: "2026-01-10"
    },
    {
        tipo: "despesa",
        descricao: "Material Escolar",
        valor: 450,
        data: "2026-01-15"
    },
    {
        tipo: "despesa",
        descricao: "Luz",
        valor: 300,
        data: "2026-02-10"
    },
    {
        tipo: "despesa",
        descricao: "Lazer",
        valor: 2400,
        data: "2026-02-15"
    },
    {
        tipo: "despesa",
        descricao: "Alimenta\xe7\xe3o",
        valor: 860,
        data: "2026-03-01"
    },
    {
        tipo: "despesa",
        descricao: "Aluguel",
        valor: 1700,
        data: "2026-03-05"
    },
    {
        tipo: "despesa",
        descricao: "Internet",
        valor: 150,
        data: "2026-04-08"
    },
    {
        tipo: "despesa",
        descricao: "Academia",
        valor: 120,
        data: "2026-04-20"
    },
    {
        tipo: "despesa",
        descricao: "Presente",
        valor: 300,
        data: "2026-05-09"
    },
    {
        tipo: "despesa",
        descricao: "Mercado",
        valor: 950,
        data: "2026-05-18"
    },
    {
        tipo: "despesa",
        descricao: "Viagem",
        valor: 2800,
        data: "2026-06-12"
    },
    {
        tipo: "despesa",
        descricao: "Farm\xe1cia",
        valor: 220,
        data: "2026-06-22"
    },
    {
        tipo: "despesa",
        descricao: "Curso Online",
        valor: 500,
        data: "2026-07-07"
    },
    {
        tipo: "despesa",
        descricao: "Restaurante",
        valor: 340,
        data: "2026-07-21"
    },
    {
        tipo: "despesa",
        descricao: "Manuten\xe7\xe3o Carro",
        valor: 900,
        data: "2026-08-11"
    },
    {
        tipo: "despesa",
        descricao: "Crunchyroll",
        valor: 20,
        data: "2026-08-25"
    },
    {
        tipo: "despesa",
        descricao: "Roupas",
        valor: 780,
        data: "2026-09-14"
    },
    {
        tipo: "despesa",
        descricao: "Conta de \xc1gua",
        valor: 180,
        data: "2026-09-27"
    },
    {
        tipo: "despesa",
        descricao: "Seguro",
        valor: 600,
        data: "2026-10-03"
    },
    {
        tipo: "despesa",
        descricao: "Supermercado",
        valor: 1100,
        data: "2026-10-19"
    },
    {
        tipo: "despesa",
        descricao: "Placa de V\xeddeo",
        valor: 1500,
        data: "2026-11-26"
    },
    {
        tipo: "despesa",
        descricao: "Cinema",
        valor: 90,
        data: "2026-11-08"
    },
    {
        tipo: "despesa",
        descricao: "Natal",
        valor: 2000,
        data: "2026-12-24"
    },
    {
        tipo: "despesa",
        descricao: "Manuten\xe7\xe3o do Celular",
        valor: 750,
        data: "2026-12-31"
    }
];
const meses = [
    "Janeiro",
    "Fevereiro",
    "Mar\xe7o",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
];
const gastosPorMes = new Array(12).fill(0);
transacoes.forEach((t)=>{
    if (t.tipo === "despesa") {
        const mes = new Date(t.data).getMonth();
        gastosPorMes[mes] += t.valor;
    }
});
new Chart(document.getElementById("graficoMes"), {
    type: "bar",
    data: {
        labels: meses,
        datasets: [
            {
                label: "Gastos",
                data: gastosPorMes,
                backgroundColor: "#4cafef"
            }
        ]
    },
    options: {
        plugins: {
            legend: {
                labels: {
                    color: "white"
                }
            },
            title: {
                display: true,
                text: "Gastos por M\xeas",
                color: "white"
            },
            tooltip: {
                titleColor: "white",
                bodyColor: "white"
            }
        },
        scales: {
            x: {
                ticks: {
                    color: "white"
                }
            },
            y: {
                ticks: {
                    color: "white"
                }
            }
        }
    }
});
transacoes.filter((t)=>t.tipo === "despesa").sort((a, b)=>b.valor - a.valor).forEach((t)=>{
    const li = document.createElement("li");
    li.textContent = t.descricao + " - R$ " + t.valor.toFixed(2);
    document.getElementById("lista").appendChild(li);
});
let fevereiroTotal = 0;
let marcoTotal = 0;
transacoes.forEach((t)=>{
    if (t.tipo === "despesa") {
        const mes = new Date(t.data).getMonth();
        if (mes === 1) fevereiroTotal += t.valor;
        if (mes === 2) marcoTotal += t.valor;
    }
});
new Chart(document.getElementById("graficoComparativo"), {
    type: "bar",
    data: {
        labels: [
            "Fevereiro",
            "Mar\xe7o"
        ],
        datasets: [
            {
                label: "Gastos",
                data: [
                    fevereiroTotal,
                    marcoTotal
                ],
                backgroundColor: [
                    "#ff6384",
                    "#36a2eb"
                ]
            }
        ]
    },
    options: {
        plugins: {
            legend: {
                labels: {
                    color: "white"
                }
            },
            title: {
                display: true,
                text: "Compara\xe7\xe3o de Gastos",
                color: "white"
            }
        },
        scales: {
            x: {
                ticks: {
                    color: "white"
                }
            },
            y: {
                ticks: {
                    color: "white"
                }
            }
        }
    }
});
const diferenca = marcoTotal - fevereiroTotal;
const resultado = document.getElementById("resultadoComparacao");
if (diferenca > 0) {
    resultado.innerHTML = `Mar\xe7o teve aumento de R$ ${diferenca.toFixed(2)} em rela\xe7\xe3o a Fevereiro.`;
    resultado.style.color = "#ff6b6b";
} else if (diferenca < 0) {
    resultado.innerHTML = `Mar\xe7o teve redu\xe7\xe3o de R$ ${Math.abs(diferenca).toFixed(2)} em rela\xe7\xe3o a Fevereiro.`;
    resultado.style.color = "#36a2eb";
} else {
    resultado.innerHTML = `Os gastos foram iguais nos dois meses.`;
    resultado.style.color = "white";
}

//# sourceMappingURL=relatorio.6922e434.js.map
