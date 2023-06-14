import {ec} from "./keys.js";
import {bytesToHex as toHex} from "@noble/hashes/utils";
import {sha256} from "@noble/hashes/sha256";

export class Transaction {

    /**
     * @type {Wallet | null}
     */
    sender;

    /** @type {Wallet} */ receiver;
    /** @type {Date} */ timestamp;
    /** @type {number} */ amount;
    /** @type {string} */ fingerprint;

    /**
     * @param fromAddress {Wallet | null}
     * @param toAddress {Wallet}
     * @param amount {number}
     */
    constructor(fromAddress, toAddress, amount) {
        this.sender = fromAddress;
        this.receiver = toAddress;
        this.amount = amount;
        this.timestamp = new Date(Date.now());
        this.sender && this.sign(this.sender.key)
    }

    /**
     * @returns {string}
     */
    calculateHash() {
        const {sender, receiver, amount, timestamp} = this;
        return toHex(sha256(`${sender.public}->${receiver.public}:${amount}:${timestamp}`))
    }

    /**
     * @param {ec.KeyPair} signingKey
     */
    sign(signingKey) {
        if (signingKey.getPublic('hex') !== this.sender.public) {
            throw new Error('You cannot sign transactions for other wallets!');
        }

        const hash = this.calculateHash();
        const sig = signingKey.sign(hash, 'base64');

        this.fingerprint = sig.toDER('hex');
    }

    /**
     * @returns {boolean}
     */
    isValid() {
        if (this.sender === null) return true;

        if (!this.signature || this.signature.length === 0) {
            throw new Error('No signature in this transaction');
        }

        const publicKey = ec.keyFromPublic(this.sender.public, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }

    toDTO() {
        const {sender, receiver, amount, timestamp, fingerprint} = this;
        return {
            sender: sender?.public ?? '<system>',
            receiver: receiver.public,
            amount,
            timestamp,
            fingerprint
        }
    }
}