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

//Salvar no localstorage do navegador
 const Storage = {  
    get(){
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [];
    },

    set(transactions){
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}    
 //Valores da tabela de transações

//transações(entradas, saidas,total), pegar todas as transações verificar se é maior que zero somar a uma variavel e retorna-la

 const Transactions = {

    all: Storage.get(),

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
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index;
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
            <img onclick="Transactions.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
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

    },
    formatAmount(value){
        //value = Number(value.replace(/\,?\.?/g, ""))*100;
        value= Number(value)*100;
        return Math.round(value);
    },
    formatDate(date){
        const splittedDate= date.split("-");
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    }
}
//verificar se todas informações foram preenchidas, formatar os dados e apagar os dados do formulario e fechar o modal
//atualizar a aplicação  
const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields() {
        const { description, amount, date } = Form.getValues()
        
        if( description.trim() === "" || 
            amount.trim() === "" || 
            date.trim() === "" ) {
                throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues() {
        let { description, amount, date} = Form.getValues() 
        amount = Utils.formatAmount(amount);
        date = Utils.formatDate(date);
        return {
            description,
            amount,
            date
        }
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {
            document
            .querySelector('.alert-form')
            .classList
            .remove('active'); 
            Form.validateFields()
            const transaction = Form.formatValues()
            Transactions.add(transaction)
            Form.clearFields()
            modal.close()
        } catch (error) {
            document
            .querySelector('.alert-form')
            .classList
            .add('active'); 
        }
    }
}

const App = {
    init(){
        Transactions.all.forEach(DOM.addTransaction)
       /* Transactions.all.forEach(transaction, index =>{
            DOM.addTransaction(transaction, index)
        });*/
        
        DOM.updateBalance();
        Storage.set(Transactions.all);
    },
    reload(){
        DOM.clearTransactions(),
        App.init()
    }
}

App.init();

