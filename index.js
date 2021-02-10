// const path = require('path');
const express = require('express');
const Datastore = require('nedb')
const app = express();
const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
    console.log(`Listening at ${PORT}`);
});
app.use(express.static('app'));

app.use(express.json({limit: '1mb'}));
const database = new Datastore('database.db');

database.loadDatabase();

app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    });
});

app.post('/api', (request, response) => {
    const data = request.body;
    database.insert(data);
    response.json(data);
});

app.delete('/api', (request, response) => {
    let data = request.body.bankID;
    database.findOne({_id: `${data}`}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
        database.remove(data);
    });
});

app.put('/api', (request, response) => {
    let bankID = request.body.bankID;
    let bankName = request.body.name.toString();
    let bankInterest = request.body.interest;
    let bankMaxLoan = request.body.maxLoan;
    let bankMinDownPayment = request.body.minDownPayment;
    let bankTerm = request.body.term;
    database.findOne({_id: `${bankID}`}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        database.update(
            {
                _id: bankID
            },
            {$set: {name: bankName,
                    interest: bankInterest,
                    maxLoan: bankMaxLoan,
                    minDownPayment: bankMinDownPayment,
                    term: bankTerm}},
            {},
            (err, numReplaced) => {
                console.log("replaced---->" + numReplaced);
            }
        );
        response.json(data);
    });
});