let financas = {
    receitas: [],
    despesas: []
};

function carregarFinancas() {
    const dados = localStorage.getItem("financas");

    if (dados) {
        financas = JSON.parse(dados);
    }
}

function filtrarMesAtual() {
    const hoje = new Date();

    return financas.despesas.filter(t => {
        const data = new Date(t.data);
        return data.getMonth() === hoje.getMonth() &&
            data.getFullYear() === hoje.getFullYear();
    });
}

function calcularTotalGasto(transacoes) {
    return transacoes.reduce((total, t) => total + t.valor, 0);
}

function maiorDespesa(transacoes) {
    if (transacoes.length === 0) return null;

    return transacoes.reduce((maior, atual) => {
        return atual.valor > maior.valor ? atual : maior;
    });
}

function maiorCategoria(transacoes) {
    const mapa = {};

    transacoes.forEach(t => {
        if (!mapa[t.categoria]) mapa[t.categoria] = 0;
        mapa[t.categoria] += t.valor;
    });

    let maior = null;
    let valor = 0;

    for (let cat in mapa) {
        if (mapa[cat] > valor) {
            valor = mapa[cat];
            maior = cat;
        }
    }

    return { categoria: maior, valor };
}

function formatarCategoria(cat) {
    const mapa = {
        alimentacao: "Alimentação",
        transporte: "Transporte",
        moradia: "Moradia",
        saude: "Saúde",
        lazer: "Lazer",
        educacao: "Educação",
        outros: "Outros"
    };

    return mapa[cat] || cat;
}

function renderizar() {
    const transacoes = filtrarMesAtual();

    const total = calcularTotalGasto(transacoes);
    document.getElementById("total-gasto").textContent =
        `R$ ${total.toFixed(2)}`;

    const maior = maiorDespesa(transacoes);
    const listaDespesa = document.getElementById("maior-despesa");

    listaDespesa.innerHTML = "<h2>Maior Despesa</h2>";

    if (maior) {
        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.flexDirection = "column";
        li.style.padding = "12px";
        li.style.borderRadius = "10px";
        li.style.backgroundColor = "rgba(255,255,255,0.1)";
        li.style.gap = "6px";

        const linha1 = document.createElement("div");
        linha1.style.display = "flex";
        linha1.style.justifyContent = "space-between";
        linha1.style.alignItems = "center";
        linha1.style.fontWeight = "bold";

        const esquerda = document.createElement("div");
        esquerda.style.display = "flex";
        esquerda.style.alignItems = "center";
        esquerda.style.gap = "8px";

        const tipoIcone = document.createElement("i");
        tipoIcone.className = "fi fi-rr-cheap-dollar";
        tipoIcone.style.color = "#ff4d4d";
        tipoIcone.style.fontSize = "16px";

        esquerda.appendChild(tipoIcone);

        const info = document.createElement("div");
        info.style.display = "flex";
        info.style.flexDirection = "column";
        info.style.fontSize = "0.9em";
        info.style.opacity = "0.85";

        const data = new Date(maior.data).toLocaleDateString("pt-BR");
        const categoria = formatarCategoria(maior.categoria);

        info.textContent = `${categoria} • ${data}`;

        esquerda.appendChild(info);

        const direita = document.createElement("div");
        direita.style.display = "flex";
        direita.style.alignItems = "center";
        direita.style.gap = "10px";

        const valor = document.createElement("span");
        valor.textContent = `R$ ${maior.valor.toFixed(2)}`;

        direita.appendChild(valor);

        linha1.appendChild(esquerda);
        linha1.appendChild(direita);

        li.appendChild(linha1);
        listaDespesa.appendChild(li);

    } else {
        listaDespesa.innerHTML += "<li>Nenhuma despesa</li>";
    }

    const cat = maiorCategoria(transacoes);
    const listaCategoria = document.getElementById("maior-categoria");

    listaCategoria.innerHTML = "<h2>Categoria que Mais Consumiu Orçamento</h2>";

    if (cat.categoria) {
        const li = document.createElement("li");

        li.style.display = "flex";
        li.style.flexDirection = "column";
        li.style.padding = "12px";
        li.style.borderRadius = "10px";
        li.style.backgroundColor = "rgba(255,255,255,0.1)";
        li.style.gap = "6px";

        const linha1 = document.createElement("div");
        linha1.style.display = "flex";
        linha1.style.justifyContent = "space-between";
        linha1.style.alignItems = "center";
        linha1.style.fontWeight = "bold";

        const esquerda = document.createElement("div");
        esquerda.style.display = "flex";
        esquerda.style.alignItems = "center";
        esquerda.style.gap = "8px";

        const tipoIcone = document.createElement("i");
        tipoIcone.className = "fi fi-rr-cheap-dollar";
        tipoIcone.style.color = "#ff4d4d";
        tipoIcone.style.fontSize = "16px";

        esquerda.appendChild(tipoIcone);

        const info = document.createElement("div");
        info.style.display = "flex";
        info.style.flexDirection = "column";
        info.style.fontSize = "0.9em";
        info.style.opacity = "0.85";

        info.textContent = formatarCategoria(cat.categoria);

        esquerda.appendChild(info);

        const direita = document.createElement("div");
        direita.style.display = "flex";
        direita.style.alignItems = "center";

        const valor = document.createElement("span");
        valor.textContent = `R$ ${cat.valor.toFixed(2)}`;

        direita.appendChild(valor);

        linha1.appendChild(esquerda);
        linha1.appendChild(direita);

        li.appendChild(linha1);
        listaCategoria.appendChild(li);

    } else {
        listaCategoria.innerHTML += "<li>Sem dados</li>";
    }
}

function compararAno() {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();

    const mapa = {};

    financas.despesas.forEach(t => {
        const data = new Date(t.data);

        if (data.getMonth() === mesAtual) {
            const ano = data.getFullYear();

            if (!mapa[ano]) mapa[ano] = 0;
            mapa[ano] += t.valor;
        }
    });

    console.log("Comparativo anual:", mapa);
    return mapa;
}

window.onload = function () {
    carregarFinancas();
    renderizar();
    compararAno();
};