let close = document.getElementsByClassName("close");
for (let i = 0; i < close.length; i++) {
    close[i].onclick = function () {
        removerElemento(this);
    }
}

let list = document.querySelector('ul');
list.addEventListener('click', function (ev) {
    if (ev.target.classList.contains('texto')) {
        ev.target.parentElement.classList.toggle('checked');
        registrarAcao('toggle', ev.target.parentElement);
    }
}, false);

let historico = [];

function addElemento() {
    let li = document.createElement("li");
    let textoValue = document.getElementById("tarefa").value;
    let categoriaValue = document.getElementById("categoria").value;
    let dataValue = document.getElementById("data").value;
    let textoSpan = document.createElement("span");
    let categoriaSpan = document.createElement("span");
    let dataSpan = document.createElement("span");
    textoSpan.className = "texto";
    categoriaSpan.className = "categoria";
    dataSpan.className = "data";
    textoSpan.textContent = textoValue.toUpperCase();
    categoriaSpan.textContent = "(" + categoriaValue + ")";
    dataSpan.textContent = dataValue;
    textoSpan.onclick = function () {
        marcarFeita(textoSpan);
    };
    li.appendChild(textoSpan);
    li.appendChild(categoriaSpan);
    li.appendChild(dataSpan);
    if (textoValue === '') {
        alert("Você precisa descrever a tarefa");
    } else {
        document.getElementById("itemLista").appendChild(li);
        registrarAcao('add', li);
    }
    document.getElementById("tarefa").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("data").value = "";

    let editarSpan = document.createElement("span");
    editarSpan.textContent = "Editar";
    editarSpan.className = "editar";
    editarSpan.onclick = function () {
        editarTarefa(editarSpan);
    };
    li.appendChild(editarSpan);

    let closeSpan = document.createElement("span");
    closeSpan.textContent = "\u00D7";
    closeSpan.className = "close";
    closeSpan.onclick = function () {
        removerElemento(closeSpan);
    };
    li.appendChild(closeSpan);
}

function editarTarefa(element) {
    let listItem = element.parentElement;
    let texto = listItem.querySelector('.texto').textContent;
    let categoria = listItem.querySelector('.categoria').textContent;
    let data = listItem.querySelector('.data').textContent;

    let textoInput = prompt("Editar tarefa:", texto);
    if (textoInput !== null) {
        listItem.querySelector('.texto').textContent = textoInput.toUpperCase();
    }

    let categoriaInput = prompt("Editar categoria:", categoria.replace(/\(|\)/g, ''));
    if (categoriaInput !== null) {
        listItem.querySelector('.categoria').textContent = "(" + categoriaInput + ")";
    }

    let dataInput = prompt("Editar data:", data);
    if (dataInput !== null) {
        listItem.querySelector('.data').textContent = dataInput;
    }
}

function removerElemento(element) {
    let div = element.parentElement;
    registrarAcao('remove', div);
    div.remove();
}

function limparLista() {
    let items = document.querySelectorAll("#itemLista li");
    items.forEach(item => registrarAcao('remove', item));
    document.getElementById("itemLista").innerHTML = "";
}

function registrarAcao(acao, elemento) {
    if (acao === 'remove') {
        historico.push({ acao: acao, elemento: elemento.cloneNode(true), parent: elemento.parentNode, nextSibling: elemento.nextSibling });
    } else if (acao === 'add') {
        historico.push({ acao: acao, elemento: elemento });
    } else if (acao === 'toggle') {
        historico.push({ acao: acao, elemento: elemento });
    }
}

function desfazerAcao() {
    if (historico.length > 0) {
        let ultimaAcao = historico.pop();
        if (ultimaAcao.acao === 'remove') {
            if (ultimaAcao.nextSibling) {
                ultimaAcao.parent.insertBefore(ultimaAcao.elemento, ultimaAcao.nextSibling);
            } else {
                ultimaAcao.parent.appendChild(ultimaAcao.elemento);
            }
            reativarEventos(ultimaAcao.elemento);
        } else if (ultimaAcao.acao === 'add') {
            ultimaAcao.elemento.remove();
        } else if (ultimaAcao.acao === 'toggle') {
            ultimaAcao.elemento.classList.toggle('checked');
        }
    }
}

function reativarEventos(elemento) {
    let texto = elemento.querySelector('.texto');
    texto.onclick = function () {
        marcarFeita(texto);
    };

    let editar = elemento.querySelector('.editar');
    editar.onclick = function () {
        editarTarefa(editar);
    };

    let close = elemento.querySelector('.close');
    close.onclick = function () {
        removerElemento(close);
    };
}


