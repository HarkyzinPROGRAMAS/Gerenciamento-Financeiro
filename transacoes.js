const btnAdicionar = document.getElementById("btn-adicionar");
const tipoInput = document.getElementById("tipo-transacao");
const valorInput = document.getElementById("valor-transacao");
const dataInput = document.getElementById("data-transacao");
const categoriaInput = document.getElementById("categoria-transacao");

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

function salvarFinancas() {
    localStorage.setItem("financas", JSON.stringify(financas));
}

function adicionarTransacao(valor, tipo, data, categoria) {
    const nova = {
        valor: Number(valor),
        data: data,
        categoria: categoria,
        criadaEm: new Date()
    };

    if (tipo === "receita") {
        financas.receitas.push(nova);
    } else {
        financas.despesas.push(nova);
    }

    salvarFinancas();
}

function obterTodasTransacoes() {
    return [
        ...financas.receitas.map(t => ({ ...t, tipo: "receita" })),
        ...financas.despesas.map(t => ({ ...t, tipo: "despesa" }))
    ];
}

function renderizar() {
    const lista = document.getElementById("lista-transacoes");
    lista.innerHTML = "<h2>Últimas Transações</h2>";

    const transacoes = obterTodasTransacoes();

    transacoes.forEach(t => {
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

        if (t.tipo === "receita") {
            tipoIcone.className = "fi fi-rr-usd-circle";
            tipoIcone.style.color = "#00ff88";
        } else {
            tipoIcone.className = "fi fi-rr-cheap-dollar";
            tipoIcone.style.color = "#ff4d4d";
        }

        tipoIcone.style.fontSize = "16px";

        esquerda.appendChild(tipoIcone);

        const direita = document.createElement("div");
        direita.style.display = "flex";
        direita.style.alignItems = "center";
        direita.style.gap = "10px";

        const valor = document.createElement("span");
        valor.textContent = `R$ ${Number(t.valor).toFixed(2)}`;

        const btnRemover = document.createElement("button");
        btnRemover.textContent = "Excluir";
        btnRemover.style.backgroundColor = "#ff4d4d";
        btnRemover.style.border = "none";
        btnRemover.style.borderRadius = "6px";
        btnRemover.style.padding = "4px 8px";
        btnRemover.style.cursor = "pointer";
        btnRemover.style.color = "white";
        btnRemover.style.fontSize = "0.8em";
        btnRemover.style.transition = "0.2s";

        btnRemover.onmouseover = () => btnRemover.style.backgroundColor = "#cc0000";
        btnRemover.onmouseout = () => btnRemover.style.backgroundColor = "#ff4d4d";

        btnRemover.onclick = () => removerTransacao(t.criadaEm, t.tipo);

        direita.appendChild(valor);
        direita.appendChild(btnRemover);

        linha1.appendChild(esquerda);
        linha1.appendChild(direita);

        const linha2 = document.createElement("div");
        linha2.style.fontSize = "0.9em";
        linha2.style.opacity = "0.85";

        const dataFormatada = new Date(t.data).toLocaleDateString("pt-BR");
        const categoriaFormatada = formatarCategoria(t.categoria);

        linha2.textContent = `${categoriaFormatada} • ${dataFormatada}`;

        li.appendChild(linha1);
        li.appendChild(linha2);

        lista.appendChild(li);
    });
}

btnAdicionar.addEventListener("click", () => {
    const tipo = tipoInput.value;
    const valor = valorInput.value;
    const data = dataInput.value;
    const categoria = categoriaInput.value;

    if (!valor || !data) {
        alert("Preencha todos os campos!");
        return;
    }

    adicionarTransacao(valor, tipo, data, categoria);
    renderizar();

    valorInput.value = "";
    dataInput.value = "";
});

function removerTransacao(id, tipo) {
    if (tipo === "receita") {
        financas.receitas = financas.receitas.filter(t => t.criadaEm !== id);
    } else {
        financas.despesas = financas.despesas.filter(t => t.criadaEm !== id);
    }

    salvarFinancas();
    renderizar();
}

function formatarCategoria(cat) {
    const mapa = {
        alimentacao: "Alimentação",
        transporte: "Transporte",
        moradia: "Moradia",
        saude: "Saúde",
        lazer: "Lazer",
        educacao: "Educação"
    };

    return mapa[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
}

window.onload = function () {
    carregarFinancas();
    renderizar();
};