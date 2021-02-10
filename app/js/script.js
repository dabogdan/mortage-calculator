let loanInput = document.querySelector('#loanInput');
let downPaymentInput = document.querySelector('#downPaymentInput');
let bankDataList = document.querySelector('#banks');
let percentDownPay = document.querySelector("#percents");
let monthlyPay = document.querySelector("#monthlyPay");
let totalPay = document.querySelector("#totalPay");
let numberOfYears = document.querySelector('#numberOfYears');
let interestValue = document.querySelector('#interest');
let choiceOfBanks = document.querySelector("#banks-choice");
let months = document.querySelector("#months");
let equityTag = document.querySelector("#equity");
let ctx = document.getElementById('myChart').getContext('2d');
let totalPrice = document.querySelector("#total-price");
let maximumLoan = document.querySelector("#maximum-loan");
let mininumDownPay = document.querySelector("#minimum-downPay");


choiceOfBanks.addEventListener('click', () => {
    choiceOfBanks.value = '';
})

BanksFromDB()
    .then(banks => {
        bankDropDown(banks);
        // eventListener to on change of bank choice
        choiceOfBanks.addEventListener('change', () => {
            for (let i = 0; i < banks.length; i++) {
                if (choiceOfBanks.value === banks[i].name) {
                    loanInput.value = banks[i].maxLoan;
                    downPaymentInput.value = banks[i].minDownPayment;
                    interestValue.textContent = banks[i].interest;
                    numberOfYears.textContent = banks[i].term;
                    maximumLoan.textContent = banks[i].maxLoan;
                    mininumDownPay.textContent = banks[i].minDownPayment;
                    countAll(loanInput.value, downPaymentInput.value, interestValue.textContent, numberOfYears.textContent);
                }
            }
        })
    })
    .catch(error => {
        console.log('error')
        console.error(error);
    });

//asynchronous function to return the banks data from the db
async function BanksFromDB() {
    const response = await fetch('/api');
    return await response.json();
}

// count percentage of the downpayment
let countPercentDownPay = (number, getPercentFrom) => {
    let percent = number * 100 / getPercentFrom;
    return Math.round((percent + Number.EPSILON) * 100) / 100;
}

let bankDropDown = (banks) => {
    // creating html for banks selection
    for (let i = 0; i < banks.length; i++) {
        let bankList = document.createElement('option');
        bankList.textContent = banks[i].name;
        bankDataList.append(bankList);
    }
}

//formula to calculate the mortgage M = p * (r / 12) * Math.pow((1 + r / 12), n) / Math.pow((1 + r / 12), n) - 1
// parameter p is a loan amount
// r is an interest, in %. It is filled in by user in years, but we have to convert them in month, in the formula above r is equal to r/12
// n = n number of years of the loan

//1) since we decided that r = r/12 to figure out the MONTHLY percentage, we can create a function once to count that, and simplify the formula taking out the division by 12.
// In addition, as we noted above, percentage can be expressed in decimal, meaning we divide by 100 making (e.g., 7% = 0.07). We do it because the user will enter percentage, not their decimal expression.
// We name this function percentToDecimal

// Now our formula will look like this:
//M = (p * r * Math.pow((1 + r), n)) / (Math.pow((1 + r), n) - 1)

//2) However, since the user enters the years, not months, the function will receive n in years. But we count a monthly percentage, so the years parameter should also be multiplied by 12.
//To take care of that, we create the function yearsToMonths

//3) We should also reduce the loan by the down payment

// function returning all calculations
let calculate = (p, r, n) => {
    let monthlyPayments = null;
    let wholePay = null;
    let equity = null;
    let interest = 0;
    r = percentToDecimal(r);
    n = yearsToMonths(n);
    monthlyPayments = p * (r * Math.pow((1 + r), n)) / (Math.pow((1 + r), n) - 1);
    monthlyPayments = parseFloat(monthlyPayments.toFixed(2));
    wholePay = monthlyPayments * n;
    wholePay = parseFloat(wholePay.toFixed(2));
    equity = wholePay + parseFloat(downPaymentInput.value);
    interest = wholePay - p;
    //counting decreasing percents for the table
    countForTable(wholePay, n, r, monthlyPayments);

    return {
        monthly: monthlyPayments,
        total: wholePay,
        numOfMonth: n,
        equity: equity,
        interestRepayment: interest,
    }
}

let countForTable = (wholePay, n, r, monthlyPayments) => {
    // recreate the table each time user changes entries
    let tableTag = document.querySelector("#table");
    tableTag.remove();
    let table = document.createElement('div');
    table.id = 'table';
    table.className = 'table';
    table.classList.add('grid');
    document.body.append(table);
    //calculations for the table
    let remainder = wholePay;
    let decreasingPercent = 0;
    let creditBody = wholePay / n;
    let increasingEquity = 0;
    for (let i = 1; i < n + 1; i++) {
        decreasingPercent = remainder * r;
        decreasingPercent = parseFloat(decreasingPercent.toFixed(2));
        remainder -= parseFloat(creditBody.toFixed(2));
        remainder = parseFloat(remainder.toFixed(2));

        if (i < n) {
            increasingEquity = monthlyPayments * i;
        }
        if( i === n) {//adding downpayment to the loan and the interest to make it equal to the whole equity
            increasingEquity = monthlyPayments * i + parseFloat(downPaymentInput.value);
        }
        increasingEquity = parseFloat(increasingEquity.toFixed(2));

        //HTML for the table
        let monthTag = document.createElement('p');
        monthTag.textContent = i;
        table.append(monthTag);

        let monthlyPayTag = document.createElement('p');
        monthlyPayTag.textContent = monthlyPayments;
        table.append(monthlyPayTag);

        let percentTag = document.createElement('p');
        percentTag.textContent = decreasingPercent;
        table.append(percentTag);

        let loanBalance = document.createElement('p');
        loanBalance.textContent = remainder;
        table.append(loanBalance);

        let equityTag = document.createElement('p');
        equityTag.textContent = increasingEquity;
        table.append(equityTag);
    }
}
//function to make percentage to decimal r = r / 12
let percentToDecimal = (percent) => {
    return (percent / 100) / 12;
}

//function to make n = n * 12
let yearsToMonths = (years) => {
    return years * 12;
}

//eventListeners to trigger the functions for calculations
//when user enters downpayment amount

downPaymentInput.addEventListener('keyup', () => {
    //callback to show downpayment percentage
    if (downPaymentInput.value.length !== 0 && loanInput.value.length !== 0) {
        countAll(loanInput.value, downPaymentInput.value, interestValue.textContent, numberOfYears.textContent);

    } else {
        percentDownPay.textContent = "";
        equityTag.textContent = '';
    }
})
// all calculations when user enters the loan data
loanInput.addEventListener('keyup', () => {
    if (downPaymentInput.value.length !== 0 && loanInput.value.length !== 0) {
        countAll(loanInput.value, downPaymentInput.value, interestValue.textContent, numberOfYears.textContent);
    }
})


// printing results into the page function
const countAll = (loan, downPay, interest, term) => {
    let paymentObject = calculate(loan, interest, term);
    if (downPay.length !== 0 && loan.length !== 0) {
        if (parseFloat(loan) > parseFloat(maximumLoan.textContent)) {
            loanInput.value = maximumLoan.textContent;
            alert('You exceeded maximum loan of your Bank!');
        }
        if (parseFloat(downPay) < parseFloat(mininumDownPay.textContent)) {
            downPaymentInput.value = mininumDownPay.textContent;
            alert('You fell below the minimum Down Pay of your Bank');
        }
        //calculations
        percentDownPay.textContent = countPercentDownPay(downPay, loan);
        monthlyPay.textContent = paymentObject.monthly;
        totalPay.textContent = paymentObject.total;
        months.textContent = paymentObject.numOfMonth;
        equityTag.textContent = paymentObject.equity;
        let interestRepayment = paymentObject.interestRepayment;
        totalPrice.textContent = parseFloat(loan) + parseFloat(downPay);
        //update the chart data array
        chart.data.datasets[0].data = [loan, interestRepayment, downPay];
        chart.update();
    }
}

//create doughnut chart
let chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'doughnut',

    // The data for our dataset
    data: {
        labels: ['Loan', 'Interest', 'Down Payment'],
        datasets: [{
            label: 'The equity',
            backgroundColor: ['rgb(255, 99, 132)', 'rgb(26, 99, 100)', 'rgb(100, 55, 140)'],
            borderColor: ['rgb(255, 99, 132)', 'rgb(26, 99, 100)', 'rgb(100, 55, 140)'],
            data: []
        }]
    },
    // Configuration options go here
    options: {}
});
chart.canvas.parentNode.style.height = '200px';
chart.canvas.parentNode.style.width = '200px';
