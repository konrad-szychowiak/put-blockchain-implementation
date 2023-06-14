export class Transaction {

    /**
     * @type {Wallet}
     */
    sender;

    /**
     * @type {Wallet}
     */
    receiver;

    /**
     * @type {number}
     */
    amount;

    /**
     * @param fromAddress {Wallet}
     * @param toAddress {Wallet}
     * @param amount {number}
     */
    constructor(fromAddress, toAddress, amount) {
        this.sender = fromAddress?.public ?? null;
        this.receiver = toAddress.public;
        this.amount = amount;
    }

    calculateHash() {
        return
    }
}