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
        return blockchain.chain
            .flatMap(block => block.data)
            .map(transaction => {
                if (transaction.receiver === this.public)
                    return transaction.amount;
                if (/*transaction.sender && */transaction.sender === this.public)
                    return -transaction.amount;
                return 0;
            })
            .reduce((a, b) => a + b, 0)
    }
}