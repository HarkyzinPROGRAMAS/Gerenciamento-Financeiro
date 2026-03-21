const $ = id => document.getElementById(id);

let financas = JSON.parse(localStorage.getItem("financas")) || {
    receitas: [],
    despesas: []
};

const soma = arr => arr.reduce((s, t) => s + t.valor, 0);

function atualizarUI() {
    const receitas = soma(financas.receitas);
    const despesas = soma(financas.despesas);
    const saldo = receitas - despesas;

    $("total-receitas").textContent = `R$ ${receitas.toFixed(2)}`;
    $("total-despesas").textContent = `R$ ${despesas.toFixed(2)}`;
    $("saldo-atual").textContent = `R$ ${saldo.toFixed(2)}`;

    return { receitas, despesas };
}

function criarGrafico(id, labels, data, cores) {
    new Chart($(id), {
        type: "doughnut",
        data: {
            labels,
            datasets: [{ data, backgroundColor: cores }]
        },
        options: {
            plugins: {
                legend: { labels: { color: "white" } }
            }
        }
    });
}

function graficoDespesas() {
    const mapa = {};

    financas.despesas.forEach(t => {
        mapa[t.categoria] = (mapa[t.categoria] || 0) + t.valor;
    });

    criarGrafico(
        "grafico-despesas",
        Object.keys(mapa),
        Object.values(mapa),
        ["#ff4d4d", "#ff944d", "#ffd11a", "#66ff66", "#66ccff", "#cc99ff"]
    );
}

function graficoComparativo() {
    const hoje = new Date();

    const meses = [];
    const receitas = [];
    const despesas = [];

    for (let i = 5; i >= 0; i--) {
        const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);

        const mes = data.toLocaleDateString("pt-BR", { month: "short" });
        meses.push(mes);

        const r = financas.receitas
            .filter(t => {
                const d = new Date(t.data);
                return d.getMonth() === data.getMonth() &&
                    d.getFullYear() === data.getFullYear();
            })
            .reduce((s, t) => s + t.valor, 0);

        const d = financas.despesas
            .filter(t => {
                const dt = new Date(t.data);
                return dt.getMonth() === data.getMonth() &&
                    dt.getFullYear() === data.getFullYear();
            })
            .reduce((s, t) => s + t.valor, 0);

        receitas.push(r);
        despesas.push(d);
    }

    new Chart($("grafico-comparativo"), {
        type: "line",
        data: {
            labels: meses,
            datasets: [
                {
                    label: "Receitas",
                    data: receitas,
                    borderColor: "#00ff88",
                    backgroundColor: "transparent",
                    tension: 0.3
                },
                {
                    label: "Despesas",
                    data: despesas,
                    borderColor: "#ff4d4d",
                    backgroundColor: "transparent",
                    tension: 0.3
                }
            ]
        },
        options: {
            plugins: {
                legend: {
                    labels: { color: "white" }
                }
            },
            scales: {
                x: {
                    ticks: { color: "white" }
                },
                y: {
                    ticks: { color: "white" }
                }
            }
        }
    });
}

function renderizarRecentes() {
    const lista = $("lista-recentes");
    lista.innerHTML = "";

    const todas = [
        ...financas.receitas.map(t => ({ ...t, tipo: "receita" })),
        ...financas.despesas.map(t => ({ ...t, tipo: "despesa" }))
    ]
        .sort((a, b) => new Date(b.criadaEm) - new Date(a.criadaEm))
        .slice(0, 5);

    todas.forEach(t => {
        const li = document.createElement("li");

        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.padding = "8px";
        li.style.borderRadius = "8px";
        li.style.backgroundColor = "rgba(255,255,255,0.1)";

        const esquerda = document.createElement("div");
        esquerda.style.display = "flex";
        esquerda.style.alignItems = "center";
        esquerda.style.gap = "8px";

        const icone = document.createElement("i");
        icone.className = t.tipo === "receita"
            ? "fi fi-rr-usd-circle"
            : "fi fi-rr-cheap-dollar";

        icone.style.color = t.tipo === "receita" ? "#00ff88" : "#ff4d4d";

        const texto = document.createElement("span");
        texto.textContent = formatarCategoria(t.categoria);

        esquerda.append(icone, texto);

        const valor = document.createElement("span");
        valor.textContent = `R$ ${t.valor.toFixed(2)}`;

        li.append(esquerda, valor);
        lista.appendChild(li);
    });
}

const formatarCategoria = cat => ({
    alimentacao: "Alimentação",
    transporte: "Transporte",
    moradia: "Moradia",
    saude: "Saúde",
    lazer: "Lazer",
    educacao: "Educação"
}[cat] || cat);

window.onload = () => {
    const resumo = atualizarUI();
    graficoDespesas();
    graficoComparativo();
};