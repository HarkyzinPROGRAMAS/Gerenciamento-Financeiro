const $ = id => document.getElementById(id);

const btnAdicionar = $("btn-adicionar"),
        tipoInput = $("tipo-transacao"),
        valorInput = $("valor-transacao"),
        dataInput = $("data-transacao"),
        categoriaInput = $("categoria-transacao"),
        inputCategoria = $("transacao-catego-add"),
        btnAddCategoria = document.querySelector(".transacao-add-catego button:nth-child(2)"),
        btnRemoveCategoria = document.querySelector(".transacao-add-catego button:nth-child(3)");

let financas = { 
    receitas: [], 
    despesas: []
},

    categorias = [];

const salvar = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const carregar = (k, def) => JSON.parse(localStorage.getItem(k)) || def;

function carregarFinancas(){ 
    financas = carregar("financas", financas); 
}

function salvarFinancas(){ 
    salvar("financas", financas); 
}

function carregarCategorias(){
    categorias = carregar("categorias", ["alimentacao","transporte","moradia","saude","lazer","educacao"]);
    salvar("categorias", categorias);
}
function salvarCategorias(){ salvar("categorias", categorias); }

function atualizarSelectCategorias(){
    categoriaInput.innerHTML = categorias.map(c => 
        `<option value="${c}">${formatarCategoria(c)}</option>`
    ).join("");
}

function adicionarTransacao(valor, tipo, data, categoria){
    const t = { valor:+valor, data:new Date(data+"T00:00:00").getTime(), categoria, criadaEm:Date.now() };
    financas[tipo === "receita" ? "receitas" : "despesas"].push(t);
    salvarFinancas();
}

const obterTodasTransacoes = () => [
    ...financas.receitas.map(t=>({...t,tipo:"receita"})),
    ...financas.despesas.map(t=>({...t,tipo:"despesa"}))
];

function removerTransacao(id,tipo){
    financas[tipo==="receita"?"receitas":"despesas"] =
        financas[tipo==="receita"?"receitas":"despesas"].filter(t=>t.criadaEm!==id);
    salvarFinancas(); renderizar();
}

btnAddCategoria.onclick = ()=>{
    const nova = inputCategoria.value.trim().toLowerCase();
    if(!nova || categorias.includes(nova)) return alert("Categoria inválida!");
    categorias.push(nova); salvarCategorias(); atualizarSelectCategorias(); inputCategoria.value="";
};

btnRemoveCategoria.onclick = ()=>{
    const cat = inputCategoria.value.trim().toLowerCase();
    if(!categorias.includes(cat)) return alert("Categoria não existe!");
    categorias = categorias.filter(c=>c!==cat);

    ["receitas","despesas"].forEach(tipo=>{
        financas[tipo].forEach(t=>{ if(t.categoria===cat) t.categoria="outros"; });
    });

    if(!categorias.includes("outros")) categorias.push("outros");
    salvarCategorias(); salvarFinancas(); atualizarSelectCategorias(); renderizar();
    inputCategoria.value="";
};

function editarCategoria(antiga,nova){
    const i = categorias.indexOf(antiga);
    if(i<0) return;
    categorias[i]=nova;
    ["receitas","despesas"].forEach(tipo=>{
        financas[tipo].forEach(t=>{ if(t.categoria===antiga) t.categoria=nova; });
    });
    salvarCategorias(); salvarFinancas(); atualizarSelectCategorias(); renderizar();
}

function formatarCategoria(cat){
    const mapa = {
        alimentacao:"Alimentação", transporte:"Transporte", moradia:"Moradia",
        saude:"Saúde", lazer:"Lazer", educacao:"Educação", outros:"Outros"
    };
    return mapa[cat] || cat[0].toUpperCase()+cat.slice(1);
}

function renderizar(){
    const lista = $("lista-transacoes");
    lista.innerHTML = "<h2>Últimas Transações</h2>";

    obterTodasTransacoes().forEach(t=>{
        const cor = t.tipo==="receita" ? "#00ff88" : "#ff4d4d";
        const icone = t.tipo==="receita" ? "fi-rr-usd-circle" : "fi-rr-cheap-dollar";

        lista.innerHTML += `
        <li style="display:flex;flex-direction:column;padding:12px;border-radius:10px;background:rgba(255,255,255,0.1);gap:6px">
            <div style="display:flex;justify-content:space-between;align-items:center;font-weight:bold">
                <div style="display:flex;align-items:center;gap:8px">
                    <i class="fi ${icone}" style="color:${cor};font-size:16px"></i>
                    <div style="font-size:.9em;opacity:.85">
                        ${formatarCategoria(t.categoria)} • ${new Date(t.data).toLocaleDateString("pt-BR")}
                    </div>
                </div>
                <div style="display:flex;align-items:center;gap:10px">
                    <span>R$ ${t.valor.toFixed(2)}</span>
                    <button onclick="removerTransacao(${t.criadaEm},'${t.tipo}')" 
                        style="background:#ff4d4d;border:none;border-radius:6px;padding:4px 8px;color:#fff;font-size:.8em;cursor:pointer">
                        Excluir
                    </button>
                </div>
            </div>
        </li>`;
    });
}

btnAdicionar.onclick = ()=>{
    const tipo = tipoInput.value,
            valor = +valorInput.value,
            data = dataInput.value,
            categoria = categoriaInput.value;

    if(!valor || !data) return;

    if(tipo==="despesa"){
        const orc = carregar("orcamentos",{}), limite = orc[categoria];
        if(limite){
            const hoje = new Date();
            const gasto = carregar("financas",{despesas:[]}).despesas
                .filter(t=>{
                    const d=new Date(t.data);
                    return t.categoria===categoria && d.getMonth()===hoje.getMonth() && d.getFullYear()===hoje.getFullYear();
                })
                .reduce((s,t)=>s+t.valor,0);

            if(gasto+valor>limite) return alert("Limite dessa categoria atingido!");
        }
    }

    adicionarTransacao(valor,tipo,data,categoria);
    renderizar();
    valorInput.value = dataInput.value = "";
};

window.onload = ()=>{
    carregarFinancas();
    carregarCategorias();
    atualizarSelectCategorias();
    renderizar();
};