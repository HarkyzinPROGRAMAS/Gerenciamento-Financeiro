const btnAdicionar = document.getElementById("btn-adicionar");
const tipoInput = document.getElementById("tipo-transacao");
const valorInput = document.getElementById("valor-transacao");
const dataInput = document.getElementById("data-transacao");
const categoriaInput = document.getElementById("categoria-transacao");

const inputCategoria = document.getElementById("transacao-catego-add");
const btnAddCategoria = document.querySelector(".transacao-add-catego button:nth-child(2)");
const btnRemoveCategoria = document.querySelector(".transacao-add-catego button:nth-child(3)");

let financas = {
    receitas: [],
    despesas: []
};

let categorias = [];

function carregarFinancas() {
    const dados = localStorage.getItem("financas");
    if (dados) {
        financas = JSON.parse(dados);
    }
}

function salvarFinancas() {
    localStorage.setItem("financas", JSON.stringify(financas));
}

function carregarCategorias() {
    const dados = localStorage.getItem("categorias");

    if (dados) {
        categorias = JSON.parse(dados);
    } else {
        categorias = [
            "alimentacao",
            "transporte",
            "moradia",
            "saude",
            "lazer",
            "educacao"
        ];
        salvarCategorias();
    }
}

function salvarCategorias() {
    localStorage.setItem("categorias", JSON.stringify(categorias));
}

function atualizarSelectCategorias() {
    categoriaInput.innerHTML = "";

    categorias.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = formatarCategoria(cat);
        categoriaInput.appendChild(option);
    });
}

function adicionarTransacao(valor, tipo, data, categoria) {
    const nova = {
        valor: Number(valor),
        data: data,
        categoria: categoria,
        criadaEm: Date.now()
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

function removerTransacao(id, tipo) {
    if (tipo === "receita") {
        financas.receitas = financas.receitas.filter(t => t.criadaEm !== id);
    } else {
        financas.despesas = financas.despesas.filter(t => t.criadaEm !== id);
    }

    salvarFinancas();
    renderizar();
}

btnAddCategoria.onclick = () => {
    const nova = inputCategoria.value.trim().toLowerCase();

    if (!nova) return;

    if (categorias.includes(nova)) {
        alert("Categoria já existe!");
        return;
    }

    categorias.push(nova);
    salvarCategorias();
    atualizarSelectCategorias();

    inputCategoria.value = "";
};

btnRemoveCategoria.onclick = () => {
    const cat = inputCategoria.value.trim().toLowerCase();

    if (!categorias.includes(cat)) {
        alert("Categoria não existe!");
        return;
    }

    categorias = categorias.filter(c => c !== cat);

    financas.receitas.forEach(t => {
        if (t.categoria === cat) t.categoria = "outros";
    });

    financas.despesas.forEach(t => {
        if (t.categoria === cat) t.categoria = "outros";
    });

    if (!categorias.includes("outros")) {
        categorias.push("outros");
    }

    salvarCategorias();
    salvarFinancas();
    atualizarSelectCategorias();
    renderizar();

    inputCategoria.value = "";
};

function editarCategoria(antiga, nova) {
    const index = categorias.indexOf(antiga);

    if (index !== -1) {
        categorias[index] = nova;

        financas.receitas.forEach(t => {
            if (t.categoria === antiga) t.categoria = nova;
        });

        financas.despesas.forEach(t => {
            if (t.categoria === antiga) t.categoria = nova;
        });

        salvarCategorias();
        salvarFinancas();
        atualizarSelectCategorias();
        renderizar();
    }
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

    return mapa[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
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

        const info = document.createElement("div");
        info.style.display = "flex";
        info.style.flexDirection = "column";
        info.style.fontSize = "0.9em";
        info.style.opacity = "0.85";

        const dataFormatada = new Date(t.data).toLocaleDateString("pt-BR");
        const categoriaFormatada = formatarCategoria(t.categoria);

        info.textContent = `${categoriaFormatada} • ${dataFormatada}`;

        esquerda.appendChild(info);

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

        btnRemover.onclick = () => removerTransacao(t.criadaEm, t.tipo);

        direita.appendChild(valor);
        direita.appendChild(btnRemover);

        linha1.appendChild(esquerda);
        linha1.appendChild(direita);

        li.appendChild(linha1);
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

window.onload = function () {
    carregarFinancas();
    carregarCategorias();
    atualizarSelectCategorias();
    renderizar();
};