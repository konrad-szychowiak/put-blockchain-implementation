import {Block} from "./block.js";
import {Transaction} from "./transaction.js";
import {Users} from "./users.js";

export class Blockchain {

    difficulty = 3
    /**
     * @type {Block[]}
     */
    chain = []

    /** @type {Transaction[]} */ pendingTransactions = [];

    constructor() {
        this.miningReward = 100;
    }

    toDTO() {
        return this.chain.map(block => ({
            ...block, data: block.data.map(tr => tr.toDTO())
        }))
    }

    async createGenesisBlock() {
        const initialReward = new Transaction(null, Users.getOneByName('miner'), this.miningReward)
        const genesis = await new Block(null, [initialReward], new Date("2.2.2022"))
            .mine(this.difficulty)
        this.chain = [genesis]
        console.log(`Blockchain set up with genesis block #${this.getLatestBlock().hash}`)
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    async minePendingTransactions(rewardAddress) {
        const block = new Block(this.getLatestBlock().hash, this.pendingTransactions)
        await block.mine(this.difficulty)
        console.log(`Mined block #${block.hash}`)
        this.chain.push(block);

        this.pendingTransactions = [new Transaction(null, rewardAddress, this.miningReward)];

        console.log(`Validating new state of the blockchain...`)
        console.log(`Validated:`, this.isChainValid())

        return this;
    }

    addTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    isChainValid() {
        console.log(this.chain.slice(1))
        return this.chain.length === 0 || this.chain
            .slice(1)
            .map((block, id) => {
                return block.isHashValid() && block.previousHash === this.chain[id].hash
            })
            .reduce((foo, bar) => foo && bar, true)
    }
}