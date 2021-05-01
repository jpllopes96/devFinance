//Abrir e fechar modal com o botão nova transação

const modal = {
    //Os dois métodos poderiam ser substituidas pelo .classList.toggle
    open(){
        //Abrir modal adicionando a classe active ao modal       
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active'); 
    },
    close(){
        //Fechar modal removendo a classe active do modal
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active'); 
    }
 }

 //Valores da tabela de transações
const transactions = [
    {
        description: 'Luz',
        amount: -50000,
        date: '23/01/2021',
    },
    {
        description: 'Website',
        amount: 500000,
        date: '23/01/2021',
    },
    {
        description: 'Outro',
        amount: -20000,
        date: '23/01/2021',
    },
    {
        description: 'App',
        amount: 20000,
        date: '23/01/2021',
    }
]

//transações(entradas, saidas,total), pegar todas as transações verificar se é maior que zero somar a uma variavel e retorna-la

 const Transactions = {

    all: transactions,

    add(transaction){
        Transactions.all.push(transaction) 
       App.reload();   
    },

    remove(index){
        Transactions.all.splice(index, 1);
        App.reload();
    },

    //Somar todas as entradas 
    incomes(){
        let income = 0;
        Transactions.all.forEach((transaction) =>{
            if(transaction.amount > 0){
                income += transaction.amount;
            }
        });
        return income;
    },
    //Somar as saídas
    expenses(){
        let expense = 0;
        Transactions.all.forEach((transaction) =>{
            if(transaction.amount < 0){
                expense += transaction.amount;
            }
        });
        return expense;
    },
    //Remover das entradas o valor das saídas (entradas - saidas), resultando no total
    total(){

        return Transactions.incomes() + Transactions.expenses();
        }

 }

//Substituir os dados fixo do HTML das transações pelo os dados do javascript do objeto transactions

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction);;  
        DOM.transactionsContainer.appendChild(tr);
    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense";
        const amount = Utils.formatCurrency(transaction.amount);

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
        </td>
        `;

        return html;
    },

    updateBalance(){
        document
        .getElementById('incomeDisplay')
        .innerHTML = Utils.formatCurrency(Transactions.incomes());

        document
        .getElementById('expenseDisplay')
        .innerHTML = Utils.formatCurrency(Transactions.expenses());

        document
        .getElementById('totalDisplay')
        .innerHTML = Utils.formatCurrency(Transactions.total());
    },

    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ""
    }
}

//Trata o valor adicionando o R$ e verificando o sinal de positivo ou negativo
const Utils = {
    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : "";
        value = String(value).replace(/\D/g, "");    
        value = Number(value)/100;

        value = value.toLocaleString("pt-BR",{
            style: "currency",
            currency: "BRL"
        })
       return signal + value;

    }
}
const App = {
    init(){
        Transactions.all.forEach(transaction =>{
            DOM.addTransaction(transaction)
        });
        
        DOM.updateBalance();
    },
    reload(){
        DOM.clearTransactions(),
        App.init()
    }
}

App.init();

