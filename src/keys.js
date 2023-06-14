import pkg from 'elliptic';
const {ec: EC} = pkg;

export const ec = new EC('secp256k1')
/**
 * @returns {EC.KeyPair}
 * @constructor
 */
export const Key = () => ec.genKeyPair();