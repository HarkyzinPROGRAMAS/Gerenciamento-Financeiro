let financas = { 
    receitas: [], 
    despesas: [] 
},

    orcamentos = {},
    categorias = [];

const $ = id => document.getElementById(id);
const carregar = k => JSON.parse(localStorage.getItem(k)) || {};
const salvar = (k,v) => localStorage.setItem(k, JSON.stringify(v));

function carregarDados(){
    financas = carregar("financas");
    orcamentos = carregar("orcamentos");
    categorias = carregar("categorias");
}

function atualizarSelectCategorias(){
    $("categoria-orcamento").innerHTML = categorias.map(c=>
        `<option value="${c}">${formatarCategoria(c)}</option>`
    ).join("");
}

$("btn-salvar-orcamento").onclick = ()=>{
    const cat = $("categoria-orcamento").value,
            val = +$("valor-orcamento").value;
    if(!val) return;
    orcamentos[cat]=val; salvar("orcamentos",orcamentos); renderizar();
    $("valor-orcamento").value="";
};

const despesasDoMes = ()=>{
    const h=new Date();
    return financas.despesas.filter(t=>{
        const d=new Date(t.data);
        return d.getMonth()===h.getMonth() && d.getFullYear()===h.getFullYear();
    });
};

const totalPorCategoria = ()=>{
    const m={};
    despesasDoMes().forEach(t=>m[t.categoria]=(m[t.categoria]||0)+t.valor);
    return m;
};

function renderizar(){
    const lista = $("lista-orcamento"), gastos = totalPorCategoria();
    lista.innerHTML = "";

    Object.keys(orcamentos).forEach(c=>{
        const lim = orcamentos[c], g = gastos[c]||0;
        const p = Math.floor(Math.min(lim?g/lim*100:0,100)*10)/10;

        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        li.style.padding = "10px";
        li.style.borderRadius = "8px";
        li.style.backgroundColor = "rgba(255,255,255,0.1)";

        const esquerda = document.createElement("span");
        esquerda.innerHTML = `<strong>${formatarCategoria(c)}</strong>`;

        const direita = document.createElement("div");
        direita.style.display = "flex";
        direita.style.alignItems = "center";
        direita.style.gap = "10px";

        const texto = document.createElement("span");
        texto.textContent = `R$ ${g.toFixed(2)} / R$ ${lim.toFixed(2)} (${p}%)`;

        const btn = document.createElement("button");
        btn.textContent = "Remover";
        btn.style.backgroundColor = "#ff4d4d";
        btn.style.border = "none";
        btn.style.borderRadius = "6px";
        btn.style.padding = "4px 8px";
        btn.style.cursor = "pointer";
        btn.style.color = "white";
        btn.style.fontSize = "0.8em";

        btn.onclick = ()=>removerOrcamento(c);

        direita.appendChild(texto);
        direita.appendChild(btn);

        li.appendChild(esquerda);
        li.appendChild(direita);
        lista.appendChild(li);
    });
}

function removerOrcamento(c){
    delete orcamentos[c];
    salvar("orcamentos",orcamentos);
    renderizar();
}

const formatarCategoria = c => ({
    alimentacao:"Alimentação", transporte:"Transporte", moradia:"Moradia",
    saude:"Saúde", lazer:"Lazer", educacao:"Educação", outros:"Outros"
}[c] || c[0].toUpperCase()+c.slice(1));

window.onload = ()=>{
    carregarDados(); 
    atualizarSelectCategorias(); 
    renderizar(); 
};