let container = document.querySelector("#container");
let addButton = document.querySelector("#addButton");
let overlay = document.querySelector("#overlay");
let closeBtn = document.querySelector(".close-button");
let formTitle = document.querySelector(".form-title");
let formName = document.querySelector("#form-name");
let formInterest = document.querySelector("#form-interest");
let formDownPay = document.querySelector("#form-DownPay");
let formMaxLoan = document.querySelector("#form-maxLoan");
let formLoanTerm = document.querySelector("#form-loanTerm");
const addBank = document.querySelector('.addBank');
const editBank = document.querySelector('.editBank');

//manipulating the data from API
fetchBanks()
    .then(banks => {
        createBanksTable(banks);
    })
    .catch(error => {
        console.log("error in banks.js: " + error);
        console.error(error);
    })

//async function to fetch banks data from API
async function fetchBanks() {
    let response = await fetch('/api');
    return await response.json();
}

//creating HTML elements
let createBanksTable = (banks) => {
    for (let i = 0; i < banks.length; i++) {
        // creating the table for banks choice
        // banks
        bankDiv = document.createElement('div');
        bankDiv.className = 'banks';
        bankDiv.textContent = banks[i].name;
        //edit btn
        btnEdit = document.createElement('button');
        btnEdit.id = banks[i]._id;
        btnEdit.className = "add-btn";
        btnEdit.classList.add('green-button');
        btnEdit.addEventListener('click', () => { //eventlistener to edit bank
            openEditBtn(banks[i]);
        });
        btnEdit.textContent = "EDIT";
        //delete btn
        btnDelete = document.createElement('button');
        btnDelete.id = banks[i]._id;
        btnDelete.className = "delete-btn";
        btnDelete.classList.add('green-button')
        btnDelete.addEventListener('click', () => { //eventlistener to delete bank
            deleteBank(banks[i]);
        });
        btnDelete.textContent = "DELETE";
        //interest
        interestDiv = document.createElement('div');
        interestDiv.className = 'interest';
        interestDiv.textContent = banks[i].interest;
        //minimum down payment
        minDownPayTag = document.createElement('div');
        minDownPayTag.className = 'min-down-pay';
        minDownPayTag.textContent = banks[i].minDownPayment;
        //maximum loan
        maxLoanTag = document.createElement('div');
        maxLoanTag.className = 'max-loan';
        maxLoanTag.textContent = banks[i].maxLoan;
        //maximum loan
        termTag = document.createElement('div');
        termTag.className = 'term';
        termTag.textContent = banks[i].term;
        //append elements
        container.append(bankDiv);
        bankDiv.append(btnEdit)
        bankDiv.append(btnDelete);
        container.append(interestDiv);
        container.append(minDownPayTag);
        container.append(maxLoanTag);
        container.append(termTag);
    }
}

async function deleteBank (bank) {
    let bankID = bank._id
    const data = { bankID };
    // console.log(data);
    const options = {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const response = await fetch('/api', options);
    const jsonResponse = await response.json();
    console.log(jsonResponse);
    location.href = location.href;
}

async function editBankInDB (bank, event) {
    if(
        formName.value.length == 0 ||
        formInterest.value.length == 0 ||
        formDownPay.value.length == 0 ||
        formMaxLoan.value.length == 0 ||
        formLoanTerm.value.length == 0
    ) {
        event.preventDefault();
        alert ('please fill in all the fields');
    } else {
        let bankID = editBank.id;
        let name = formName.value;
        let interest = formInterest.value;
        let minDownPayment = formDownPay.value;
        let maxLoan = formMaxLoan.value;
        let term = formLoanTerm.value;

        const data = {name, interest, maxLoan, minDownPayment, term, bankID};

        const options = {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        const response = await fetch('/api', options);
        const jsonResponse = await response.json();
    }
}

addBank.addEventListener('click', async (event) => {
    if(
        formName.value.length == 0 ||
        formInterest.value.length == 0 ||
        formDownPay.value.length == 0 ||
        formMaxLoan.value.length == 0 ||
        formLoanTerm.value.length == 0
    ) {
        alert ('You did not fill in all the fields');
        event.preventDefault();
    } else {
        let name = formName.value;
        let interest = formInterest.value;
        let minDownPayment = formDownPay.value;
        let maxLoan = formMaxLoan.value;
        let term = formLoanTerm.value;

        const data = {name, interest, maxLoan, minDownPayment, term};
        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        const response = await fetch('/api', options)
        const jsonResponse = await response.json();
    }
})

editBank.addEventListener('click', (event) => {
    let name = formName.value;
    let interest = formInterest.value;
    let minDownPayment = formDownPay.value;
    let maxLoan = formMaxLoan.value;
    let term = formLoanTerm.value;
    let id = editBank.id;
    const data = {name, interest, maxLoan, minDownPayment, term, id};
    editBankInDB(data, event);
})

// event onclick of add button - appearing overlay with the form
addButton.addEventListener('click', () => {
    overlay.classList.add("appear");
    overlay.classList.remove("disappear");
    editBank.style.display = 'none';
    addBank.style.display = 'block';
})

closeBtn.addEventListener('click', () => {
    overlay.classList.remove("appear");
    overlay.classList.add("disappear");
})

async function openEditBtn (bank) {
    overlay.classList.add("appear");
    overlay.classList.remove("disappear");
    editBank.style.display = 'block';
    editBank.id = bank._id;
    addBank.style.display = 'none';

    formTitle.textContent = 'You are editing ' + bank.name + ':';

    formName.value = bank.name;
    formInterest.value = bank.interest;
    formDownPay.value = bank.minDownPayment;
    formMaxLoan.value = bank.maxLoan;
    formLoanTerm.value = bank.term;
}