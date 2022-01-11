"use strict";

const openModal = () =>
  document.getElementById("modal").classList.add("active");

const closeModal = () => {
  clearFields();

  document.getElementById("modal").classList.remove("active");
};
//Para o crud inserimos a variável global abaixo
/*const tempClient = {
    nome: 'Michael',
    email: 'nicolas_matos@hotmail.com',
    celular: '11123459876',
    cidade: "São Paulo"

};*/

//CRUD - create read update delete

const getLocalStorage = () =>
  JSON.parse(localStorage.getItem("db_client")) ?? [];
const setLocalStorage = (dbClient) =>
  localStorage.setItem("db_client", JSON.stringify(dbClient));

//4  = CRUD - DELETE
const deleteClient = (index) => {
  const dbClient = readClient();
  dbClient.splice(index, 1);
  setLocalStorage(dbClient);
};

//3 - CRUD - UPDATE (editar)
const updateClient = (index, client) => {
  const dbClient = readClient();
  dbClient[index] = client;
  setLocalStorage(dbClient);
};

//2 - CRUD - READ
//irá ler o que é o inserimos no cliente
const readClient = () => getLocalStorage();

/*1 - CRUD - CREATE
const createClient = (client) => {
    const db_client = JSON.parse(localStorage.getItem('db_client')) ?? []
    //1.3 pega o que tem no banco de dados e transforma em json, o banco de dados no caso é o localStorage
    //1.4 armazena dentro de uma variável chamada db_client
    //1.6 ?? [] condição, se o que estamos buscando for null ou false ele retornará um array vázio
    db_client.push(client) 
    //1.5 o push está acrescentando mais um cliente para que nao seja substituido e sim acrescentado
    localStorage.setItem("db_client", JSON.stringify(db_client))
    //1.2 - envia os dados do banco de dados e transoforma em string para leitura
} */

//1- CREATE
const createClient = (client) => {
  const dbClient = getLocalStorage();
  dbClient.push(client);
  setLocalStorage(dbClient);
};

const isValidFields = () => {
  return document.getElementById("form").reportValidity();
};

//clearfields
const clearFields = () => {
  const fields = document.querySelectorAll(".modal-field");
  fields.forEach((field) => (field.value = ""));
};

//Interação com layout
const saveClient = () => {
  if (isValidFields()) {
    const client = {
      nome: document.getElementById("nome").value,
      email: document.getElementById("email").value,
      celular: document.getElementById("celular").value,
      cidade: document.getElementById("cidade").value,
    };
    const index = document.getElementById('nome').dataset.index;
        if(index == 'new'){
            createClient(client);
            updateTable();
            closeModal();

        }else {
            updateClient(index, client);
            updateTable();
            closeModal();
        }
    
  }
};

const createRow = (client, index) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${client.nome}</td>
    <td>${client.email}</td>
    <td>${client.celular}</td>
    <td>${client.cidade}</td>
    <td>
    <button type="button" class="button green" id="edit-${index}">Editar</button>
    <button type="button" class="button red" id="delete-${index}">Excluir</button>
    </td>
        
    `;

    document.querySelector('#tableClient>tbody').appendChild(newRow)
};

const clearTable = () =>{
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row  => row.parentNode.removeChild(row))
}

const updateTable = () => {
  const dbClient = readClient();
  clearTable();
  dbClient.forEach(createRow);
};


const fillFields = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) =>{
    const client = readClient()[index]
    client.index = index 
    fillFields(client)
    openModal();
}

const editDelete = (event) => {
    if (event.target.type == 'button'){
        const[action, index] = event.target.id.split('-')
        if (action == 'edit'){
            editClient(index)
        }else {
            const client = readClient()[index]
            const response = confirm (`Deseja realmente excluir o cliente ${client.nome}`)
            if (response) {
                deleteClient(index)
                updateTable()
            }
            
        }
    }
}

updateTable();

//Eventos
document.getElementById("cadastrarCliente")
    .addEventListener("click", openModal);

document.getElementById("modalClose")
    .addEventListener("click", closeModal);

document.getElementById("salvar")
    .addEventListener("click", saveClient);

document.querySelector("#tableClient>tbody")
    .addEventListener('click', editDelete)