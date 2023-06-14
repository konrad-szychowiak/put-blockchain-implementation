import {Wallet} from "./wallet.js";

export class Users {
    static users = [
        new Wallet('miner', 'creeper'),
        new Wallet('client', 'critical'),
        new Wallet('producer', 'powerful')
    ]
    static getAll() {
        return this.users
    }

    /**
     *c
     * @param name
     * @returns {Wallet | undefined}
     */
    static getOneByName(name) {
        return this.users.find(user => user.name === name)
    }
}
