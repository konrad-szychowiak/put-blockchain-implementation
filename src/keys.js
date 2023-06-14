import pkg from 'elliptic';
const {ec} = pkg;

const curve = new ec('secp256k1')
export const Key = () => curve.genKeyPair();