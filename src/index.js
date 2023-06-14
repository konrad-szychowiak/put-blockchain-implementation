import yargs from "yargs/yargs";
import {hideBin} from "yargs/helpers";
import {Blockchain} from "./blockchain.js";
import express from "express";
import {Wallet} from "./wallet.js";
import {Transaction} from "./transaction.js";
import {Users} from "./db.js";
import cors from 'cors';

// const miner = users.miner;
// const consumer = users.consumer;
// const producer = users.producer;
//
const bc = new Blockchain();
// bc.addTransaction(new Transaction(miner, producer, 50))
// bc.minePendingTransactions(miner)
//
// console.log(miner.amountInBlockchain(bc))
// console.log(consumer.amountInBlockchain(bc))
// console.log(producer.amountInBlockchain(bc))
//
// bc.addTransaction(new Transaction(miner, consumer, 50))
// bc.addTransaction(new Transaction(consumer, producer, 30))
// bc.addTransaction(new Transaction(producer, consumer, 70))
//
// bc.minePendingTransactions(miner)
// console.log(miner.amountInBlockchain(bc))
// console.log(consumer.amountInBlockchain(bc))
// console.log(producer.amountInBlockchain(bc))
// console.log(bc.isChainValid())

const app = express()

app.use(express.json())
app.use(cors())

app.get('/blockchain', (req, res) => {
    console.log('Getting blockchain...')
    res.send(bc.chain)
})

app.get('/blockchain/pending', (req, res) => {
    console.log('Getting pending transactions...')
    res.send(bc.pendingTransactions)
})

app.post('/blockchain/mine', (req, res) => {
    console.log('Mining block with pending transactions...')
    const {awardee, password} = req.body;
    const rewardWallet = Users.getOneByName(awardee);
    if (!rewardWallet || !rewardWallet.validateCredentials(password)) return res.status(404).send('Not found')

    const before = performance.now();
    bc.minePendingTransactions(rewardWallet);
    const after = performance.now();

    res.send(bc.pendingTransactions)
})

app.get('/user', (req, res) => {
    console.log('Getting all users...')
    res.send(Users.getAll().map(user => user.name))
})

app.get('/user/:name/wallet', (req, res) => {
    console.log('Getting all users...')
    const wallet = Users.getOneByName(req.params.name)
    res.send(wallet.amountInBlockchain(bc))
})

app.post('/transaction', (req, res) => {
    const {sender, receiver, amount, password} = req.body;

    const sendWallet = Users.getOneByName(sender)
    if (!sendWallet) return res.status(404).send('No sender')

    if (!sendWallet.validateCredentials(password)) return res.status(401).send('Unauthorised')

    const receiveWallet = Users.getOneByName(receiver)
    if (!receiveWallet) return res.status(404).send('No receiver')

    const funds = sendWallet.amountInBlockchain(bc)
    if (amount > funds) return res.status(400).send(`Bad request. Transaction failed due to unsufficient funds in wallet: ${funds} out of ${amount}`)

    const transaction = new Transaction(sendWallet, receiveWallet, amount)
    bc.addTransaction(transaction)

    return res.send(bc.pendingTransactions)
})

app.listen(8080, () => {
    console.log(`listening on http://localhost:8080/`)
})