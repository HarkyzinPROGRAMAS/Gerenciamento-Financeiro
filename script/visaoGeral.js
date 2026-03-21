const $ = id => document.getElementById(id);

let financas = {
    receitas: [],
    despesas: []
};

const carregar = (k, def) => JSON.parse(localStorage.getItem(k)) || def;

function carregarFinancas() {
    financas = carregar("financas", financas);
}

function calcularResumo() {
    const totalReceitas = financas.receitas
        .reduce((soma, t) => soma + t.valor, 0);

    const totalDespesas = financas.despesas
        .reduce((soma, t) => soma + t.valor, 0);

    const saldo = totalReceitas - totalDespesas;

    return { totalReceitas, totalDespesas, saldo };
}

function atualizarUI() {
    const { totalReceitas, totalDespesas, saldo } = calcularResumo();

    $("total-receitas").textContent = `R$ ${totalReceitas.toFixed(2)}`;
    $("total-despesas").textContent = `R$ ${totalDespesas.toFixed(2)}`;
    $("saldo-atual").textContent = `R$ ${saldo.toFixed(2)}`;
}

window.onload = () => {
    carregarFinancas();
    atualizarUI();
};