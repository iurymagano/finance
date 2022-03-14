const Modal = {
    open(){
        const modalOn = document.querySelector('.modal-overlay')
        modalOn.classList.add('active');
    },
    close(){
      const modalOff = document.querySelector('.modal-overlay');
      modalOff.classList.remove('active')
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    set(transactions) {
        localStorage.setItem("dev.finance:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
    },
    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },
    incomes() {
        let income = 0;
        // PEGAR TODAS AS TRANSAÇÕES
        Transaction.all.forEach( transaction =>{
            //para cada transação, se ela for maior que zero somar
            if( transaction.amount > 0 ) {
                // SOMAR A UMA VARIAVEL E RETORNAR A VARIAVEL
                income += transaction.amount
            } 
        })
        return income
    },

    expenses() {
        let expense = 0;
        // PEGAR TODAS AS TRANSAÇÕES
        Transaction.all.forEach( transaction =>{
            //para cada transação, se ela for maior que zero somar
            if( transaction.amount < 0 ) {
                // SOMAR A UMA VARIAVEL E RETORNAR A VARIAVEL
                expense += transaction.amount
            } 
        })
        return expense
    },

    total() {
        return Transaction.incomes() + Transaction.expenses()
    }
}

const DOM = {

    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense";
        const amount = Utils.formatCurrency(transaction.amount)
        const html = `
        <td class="discription">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td><a href="#" onclick="Transaction.remove(${index})">Remover</a></td>
        

        `
        return html
    },

    updateBanlance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())



    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }

}

const Utils = {
    formatAmount(value) {
        value = Number(value) * 100

        return value
    },

    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`

    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
        
        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100
        value = value.toLocaleString("pt-BR",{
            style: "currency",
            currency: "BRL"
        })
        return signal + value


    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValue() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateField() {
        const { description, amount, date } = Form.getValue()

        if( description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === "") {
                throw new Error("Por favor, preencha todos os campos");
            }
    },

    formatValues() {
        let { description, amount, date } = Form.getValue();

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

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
            // verificar se todas as informações foram preenchidas
            Form.validateField()
            // formatar os dados para salvar
            const transaction = Form.formatValues()
            // salvar 
            Transaction.add(transaction)
            // apagar os dados do formulario
            Form.clearFields()
            // modal feche
            Modal.close()

        } catch (error) {

            alert(error.message)

        }


    }
}




const  App = {
    init() {

        Transaction.all.forEach(DOM.addTransaction)

        DOM.updateBanlance()
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    },
}

App.init()

