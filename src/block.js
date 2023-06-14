import {bytesToHex as toHex} from "@noble/hashes/utils";
import {sha256} from "@noble/hashes/sha256";

export class Block {

    /**
     *
     * @param previousHash {string}
     * @param data {Transaction[]}
     * @param timestamp {Date}
     */
    constructor( previousHash = '', data = [], timestamp = new Date(Date.now())) {
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.setHash();
        this.nonce = 0;
    }
    setHash() {
        this.hash = this.calculateHash();
        return this;
    }

    isHashValid() {
        return this.hash === this.calculateHash();
    }

    calculateHash() {
        return toHex(sha256(JSON.stringify({
            timestamp: this.timestamp,
            previousHash: this.previousHash,
            data: this.data,
            nonce: this.nonce,
        })))
    }

    setPreviousHash(hash) {
        this.previousHash = hash;
        return this;
    }

    /**
     *
     * @param difficulty {number}
     * @returns {Promise<Block>}
     */
    async mine(difficulty) {
        return new Promise( resolve => {
            while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
                this.nonce++;
                this.setHash()
            }
            resolve(this)
        })
    }
}