const formulario = document.getElementById("formularioDespesas");
const lista = document.getElementById("listaDespesas");
formulario.addEventListener("submit", function(event) {
    event.preventDefault();
    const inputs = formulario.querySelectorAll("input");
    const descricao = inputs[0].value;
    const valor = parseFloat(inputs[1].value).toFixed(2);
    const data = inputs[2].value;
    const li = document.createElement("li");
    li.innerHTML = `
    <strong>${descricao}</strong> - 
    R$ ${valor} - 
    ${data}
    <button class="btnExcluir">X</button>
  `;
    li.querySelector(".btnExcluir").addEventListener("click", function() {
        li.remove();
    });
    lista.appendChild(li);
    formulario.reset();
});

//# sourceMappingURL=despesas.f793adb3.js.map
