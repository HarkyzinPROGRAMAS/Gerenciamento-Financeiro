let financas = {
    receitas: [], 
    despesas: [] 
};

const carregar = k => JSON.parse(localStorage.getItem(k)) || {};
const carregarFinancas = () => financas = carregar("financas") || financas;

const filtrarMesAtual = () => {
    const h = new Date();
    return financas.despesas.filter(t=>{
        const d = new Date(t.data);
        return d.getMonth()===h.getMonth() && d.getFullYear()===h.getFullYear();
    });
};

const calcularTotalGasto = t => t.reduce((s,x)=>s+x.valor,0);
const maiorDespesa = t => t.length ? t.reduce((m,a)=>a.valor>m.valor?a:m) : null;

function maiorCategoria(t){
    const orc = carregar("orcamentos"), gastos = {};
    t.forEach(x=>gastos[x.categoria]=(gastos[x.categoria]||0)+x.valor);

    let cat=null, perc=0, val=0;
    for(let c in orc){
        const p = orc[c] ? (gastos[c]||0)/orc[c]*100 : 0;
        if(p>perc){ perc=p; cat=c; val=gastos[c]||0; }
    }
    return { categoria:cat, valor:val, porcentagem:Math.floor(Math.min(perc,100)*10)/10 };
}

const formatarCategoria = c => ({
    alimentacao:"Alimentação", transporte:"Transporte", moradia:"Moradia",
    saude:"Saúde", lazer:"Lazer", educacao:"Educação", outros:"Outros"
}[c] || c[0].toUpperCase()+c.slice(1));

function renderizar(){
    const transacoes = filtrarMesAtual();
    const total = calcularTotalGasto(transacoes);
    const maior = maiorDespesa(transacoes);
    const cat = maiorCategoria(transacoes);

    document.getElementById("total-gasto").textContent = `R$ ${total.toFixed(2)}`;

    const lista1 = document.getElementById("maior-despesa");
    lista1.innerHTML = "<h2>Maior Despesa</h2>";

    if (maior) {
        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.flexDirection = "column";
        li.style.padding = "12px";
        li.style.borderRadius = "10px";
        li.style.backgroundColor = "rgba(255,255,255,0.1)";
        li.style.gap = "6px";

        const linha = document.createElement("div");
        linha.style.display = "flex";
        linha.style.justifyContent = "space-between";
        linha.style.alignItems = "center";
        linha.style.fontWeight = "bold";

        linha.innerHTML = `
            <div style="display:flex;align-items:center;gap:8px">
                <i class="fi fi-rr-cheap-dollar" style="color:#ff4d4d;font-size:16px"></i>
                <div style="font-size:.9em;opacity:.85">
                    ${formatarCategoria(maior.categoria)} • ${new Date(maior.data).toLocaleDateString("pt-BR")}
                </div>
            </div>
            <span>R$ ${maior.valor.toFixed(2)}</span>
        `;

        li.appendChild(linha);
        lista1.appendChild(li);
    } else {
        lista1.innerHTML += "<li>Nenhuma despesa</li>";
    }

    const lista2 = document.getElementById("maior-categoria");
    lista2.innerHTML = "<h2>Categoria que Mais Consumiu Orçamento</h2>";

    if (cat.categoria) {
        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.flexDirection = "column";
        li.style.padding = "12px";
        li.style.borderRadius = "10px";
        li.style.backgroundColor = "rgba(255,255,255,0.1)";
        li.style.gap = "6px";

        const linha = document.createElement("div");
        linha.style.display = "flex";
        linha.style.justifyContent = "space-between";
        linha.style.alignItems = "center";
        linha.style.fontWeight = "bold";

        linha.innerHTML = `
            <div style="display:flex;align-items:center;gap:8px">
                <i class="fi fi-rr-cheap-dollar" style="color:#ff4d4d;font-size:16px"></i>
                <div style="font-size:.9em;opacity:.85">
                    ${formatarCategoria(cat.categoria)}
                </div>
            </div>
            <span>R$ ${cat.valor.toFixed(2)} (${cat.porcentagem}%)</span>
        `;

        li.appendChild(linha);
        lista2.appendChild(li);
    } else {
        lista2.innerHTML += "<li>Sem dados</li>";
    }
}

const compararAno = () => {
    const h=new Date(), m=h.getMonth(), mapa={};
    financas.despesas.forEach(t=>{
        const d=new Date(t.data);
        if(d.getMonth()===m) mapa[d.getFullYear()] = (mapa[d.getFullYear()]||0)+t.valor;
    });
    console.log("Comparativo anual:", mapa);
    return mapa;
};

window.onload = ()=>{
    carregarFinancas(); 
    renderizar(); 
    compararAno();
};