import { env } from "process";

const PORT = parseInt(env.PORT || '3010');

const SIMNNET_CONFIG = {
  environment: 'simnet',
  mongoDbUrl: '',
  mongoDbName: '',
  mongoUser: '',
  mongoPwd: '',
  btcNode: 'http://localhost:18443',
  btcRpcUser: 'devnet',
  btcRpcPwd: 'devnet',
  host: 'http://localhost', 
  port: PORT,
  network: 'simnet',
  walletPath: '/wallet/SBTC-0001',
  sbtcContractId: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.asset',
  stacksApi: 'http://localhost:3999',
  stacksExplorerUrl: 'http://localhost:3000',
  bitcoinExplorerUrl: 'http://localhost:3002',
  mempoolUrl: 'http://localhost:18443',
  blockCypherUrl: 'http://localhost:18443',
  publicAppName: 'sBTC Bridge Simnet API',
  publicAppVersion: '1.0.0',
}

const DEVNET_CONFIG = {
  environment: 'devnet',
  mongoDbUrl: '',
  mongoDbName: '',
  mongoUser: '',
  mongoPwd: '',
  btcNode: 'bitcoind.testnet.stacks.co',
  btcRpcUser: 'blockstack',
  btcRpcPwd: 'blockstacksystem', 
  host: 'http://localhost',
  port: 3010,
  walletPath: '/wallet/descwallet',
  network: 'testnet',
  sbtcContractId: 'ST1R1061ZT6KPJXQ7PAXPFB6ZAZ6ZWW28G8HXK9G5.asset',
  stacksApi: 'https://api.testnet.hiro.so',
  stacksExplorerUrl: 'https://explorer.hiro.co',
  bitcoinExplorerUrl: 'https://mempool.space/testnet/api',
  mempoolUrl: 'https://mempool.space/testnet/api',
  blockCypherUrl: 'https://api.blockcypher.com/v1/btc/test3',
  publicAppName: 'sBTC Bridge Local Staging API',
  publicAppVersion: '1.0.0',
}

const LINODE_TESTNET_CONFIG = {
  environment: 'staging',
  mongoDbUrl: '',
  mongoDbName: '',
  mongoUser: '',
  mongoPwd: '',
  btcNode: 'bitcoind.testnet.stacks.co',
  btcRpcUser: 'blockstack',
  btcRpcPwd: 'blockstacksystem',
  host: 'http://localhost',
  port: 3010,
  walletPath: '/wallet/SBTC-0003',
  network: 'testnet',
  sbtcContractId: 'ST1R1061ZT6KPJXQ7PAXPFB6ZAZ6ZWW28G8HXK9G5.asset',
  stacksApi: 'https://api.testnet.hiro.so',
  stacksExplorerUrl: 'https://explorer.hiro.co',
  bitcoinExplorerUrl: 'https://mempool.space/testnet/api',
  mempoolUrl: 'https://mempool.space/testnet/api',
  blockCypherUrl: 'https://api.blockcypher.com/v1/btc/test3',
  publicAppName: 'sBTC Bridge Staging API',
  publicAppVersion: '1.0.0',
}

const LINODE_MAINNET_CONFIG = {
  environment: 'production',
  mongoDbUrl: '',
  mongoDbName: '',
  mongoUser: '',
  mongoPwd: '',
  btcNode: '',
  btcRpcUser: '',
  btcRpcPwd: '',
  host: 'http://localhost',
  port: 3020,
  network: 'mainnet',
  walletPath: '/wallet/SBTC-0003',
  sbtcContractId: 'ST1R1061ZT6KPJXQ7PAXPFB6ZAZ6ZWW28G8HXK9G5.asset',
  stacksApi: 'https://api.hiro.so',
  stacksExplorerUrl: 'https://explorer.hiro.co',
  bitcoinExplorerUrl: 'https://mempool.space/api',
  mempoolUrl: 'https://mempool.space/api',
  blockCypherUrl: 'https://api.blockcypher.com/v1/btc/main',
  publicAppName: 'sBTC Bridge Mainnet API',
  publicAppVersion: '1.0.0',
}

let CONFIG: {
  mongoDbUrl: string; 
  mongoUser: string; 
  mongoPwd: string; 
  mongoDbName: string; 
  btcNode: string; 
  btcRpcUser: string; 
  btcRpcPwd: string; 
  host: string; 
  port: number; 
  walletPath: string; 
  network: string; 
  sbtcContractId: string; 
  stacksApi: string; 
  stacksExplorerUrl: string; 
  bitcoinExplorerUrl: string; 
  mempoolUrl: string; 
  blockCypherUrl: string;
  publicAppName: string;
  publicAppVersion: string; 
};

export function setConfigOnStart() {
	if (isDev()) CONFIG = LINODE_TESTNET_CONFIG; //DEVNET_CONFIG;
  else if (isLocalTestnet()) CONFIG = DEVNET_CONFIG;
	else if (isLocalRegtest()) CONFIG = SIMNNET_CONFIG;
	else if (isLinodeTestnet()) CONFIG = LINODE_TESTNET_CONFIG;
	else if (isLinodeMainnet()) CONFIG = LINODE_MAINNET_CONFIG;
	else CONFIG = LINODE_TESTNET_CONFIG;
  setOverrides();
}

function setOverrides() {
  console.log('================================================ >> ' + process.env.NODE_ENV)
  if (isLocalRegtest() || isLocalTestnet()) {
    // localhost params not provided by docker environment
    CONFIG.mongoDbUrl = 'cluster0.kepjbx0.mongodb.net'
    CONFIG.mongoDbName = 'sbtc-bridge-simnet-db'
    CONFIG.mongoUser = 'dockerdev1'
    CONFIG.mongoPwd = 'FbKWBThNLIjqExG1'
    CONFIG.btcNode = 'http://localhost:18443' // ie not via docker network
    CONFIG.btcRpcUser = 'devnet'
    CONFIG.btcRpcPwd = 'devnet'
    // private keys for testing ability to sign PSBTs..
  } else if (isDev() || isLinodeTestnet() || isLinodeMainnet()) {
    // localhost params provided by docker environment
    CONFIG.mongoDbUrl = process.env.mongoDbUrl || '';
    CONFIG.mongoDbName = process.env.mongoDbName || '';
    CONFIG.mongoUser = process.env.mongoUser || ''
    CONFIG.mongoPwd = process.env.mongoPwd || '';
    CONFIG.btcNode = process.env.btcNode || '';
    CONFIG.btcRpcUser = process.env.btcRpcUser || '';
    CONFIG.btcRpcPwd = process.env.btcRpcPwd || '';
    CONFIG.sbtcContractId = process.env.sbtcContractId || '';
    CONFIG.network = process.env.network || '';
    CONFIG.stacksApi = process.env.stacksApi || '';
    CONFIG.stacksExplorerUrl =  process.env.stacksExplorerUrl || '';
    CONFIG.bitcoinExplorerUrl = process.env.bitcoinExplorerUrl|| '';
  }
  if (isLocalTestnet()) {
    CONFIG.btcNode = 'localhost:18332' // ie not via docker network
  }
}

export function isLocalRegtest() {
  const environ = process.env.NODE_ENV;
  return (environ && environ === 'local-regtest')
}

export function isLocalTestnet() {
  const environ = process.env.NODE_ENV;
  return (environ && environ === 'local-testnet')
}

export function isDev() {
  const environ = process.env.NODE_ENV;
  return (!environ || environ === 'test' || environ === 'development' || environ === 'dev')
}

function isLinodeTestnet() {
  const environ = process.env.NODE_ENV;
  return (environ && environ.indexOf('linode-staging') > -1)
}

function isLinodeMainnet() {
  const environ = process.env.NODE_ENV;
  return (environ && environ.indexOf('linode-production') > -1)
}

export function getConfig() {
  if (!CONFIG) setConfigOnStart();
	return CONFIG;
}
