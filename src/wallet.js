import {Key} from "./keys.js";

export class Wallet {
    constructor(name, password) {
        this.name = name;
        this.password = password;
        this.key = Key();
    }

    validateCredentials(given) {
        console.log('Given password', given)
        return this.password === given;
    }

    get public() {
        return this.key.getPublic('hex')
    }

    amountInBlockchain(blockchain) {
        return [...blockchain.toDTO().flatMap(block => block.data), ...blockchain.pendingTransactions]
            .map(transaction => {
                // console.log(this.public, transaction)

                if (transaction.receiver === this.public)
                    return transaction.amount;

                if (/*transaction.sender && */transaction.sender === this.public)
                    return -transaction.amount;

                return 0;
            })
            // .map(el => {
            //     console.log(el); return el;
            // })
            .reduce((a, b) => a + b, 0)
    }
}