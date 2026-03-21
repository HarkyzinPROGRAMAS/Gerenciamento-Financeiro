let financas = {
    receitas: []
}

function carregarFinancas() {
    const transacoes = localStorage.getItem("transacao");

    if (transacoes) {
        financa = JSON.parse(transacoes);
    }
}

function adicionarTransacao(valor, tipo) {
    financas.receitas.push({
        valor,
        tipo,
        transacoes: new Date()
    })

    salvarFinancas();
}

function salvarFinancas() {
    localStorage.setItem("financas", JSON.stringify(financas));
}

window.onload = function () {
    carregarFinancas();
}