/**
 * sbtc - interact with Stacks Blockchain to read sbtc contract info
 */
import { CONFIG } from '$lib/config';
import { bufferCV, contractPrincipalCV, PostConditionMode, uintCV, stringAsciiCV, bufferCVFromString, someCV } from '@stacks/transactions';
import { tupleCV } from '@stacks/transactions/dist/esm/clarity/index.js';
import { principalCV } from '@stacks/transactions/dist/esm/clarity/types/principalCV.js';
import { openContractCall } from '@stacks/connect';
import { getStacksNetwork } from './stacks_connect.js'
import { hex } from '@scure/base';
import { sbtcMiniContracts } from 'sbtc-bridge-lib';

export const coordinators = [
  { stxAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', btcAddress: 'tb1q6ue638m4t5knwxl4kwhwyuffttlp0ffee3zn3e' }, // devnet + electrum bob
  { stxAddress: 'SP3N4AJFZZYC4BK99H53XP8KDGXFGQ2PRSQP2HGT6', btcAddress: 'tb1q6ue638m4t5knwxl4kwhwyuffttlp0ffee3zn3e' }, // mijoco staging + electrum bob
  { stxAddress: 'ST3N4AJFZZYC4BK99H53XP8KDGXFGQ2PRSPNET8TN', btcAddress: 'tb1q6ue638m4t5knwxl4kwhwyuffttlp0ffee3zn3e' }, // mijoco production + electrum bob
  { stxAddress: 'ST2BJA4JYFJ7SDMNFJZ9TJ3GB80P9Z80ADNF2R2AG', btcAddress: '' }, // coordinator
  { stxAddress: 'ST306HDPY54T81RZ7A9NGA2F03B8NRGW6Y59ZRZSD', btcAddress: '' }, // coordinator
  { stxAddress: 'ST3RBZ4TZ3EK22SZRKGFZYBCKD7WQ5B8FFRS57TT6', btcAddress: '' }, // coordinator
]

export function getCoordinator(address:string) {
	return coordinators.find((o) => o.stxAddress === address);
}

export function isCoordinator(address:string) {
	return coordinators.find((o) => o.stxAddress === address);
}

export async function registerToSignTest(callback:any) {
  //data {addr: principal, key: (buff 33)}
  await openContractCall({
    network: getStacksNetwork(),
    postConditions: [],
    postConditionMode: PostConditionMode.Deny,
    contractAddress: CONFIG.VITE_SBTC_MINI_DEPLOYER,
    contractName: sbtcMiniContracts.pool,
    functionName: 'signer-pre-register-test',
    functionArgs: [],
    onFinish: (data: any) => {
      console.log('TX Data: ', data);
      callback(data);
    },
    onCancel: () => {
      console.log('popup closed!');
    }
  });
}

export async function registerToSign(btcPubKey:string, amount:number, callback:any) {
  //data {addr: principal, key: (buff 33)}
  const xyWebWalletPubKey = hex.decode(btcPubKey);
  const xOnlyPubKey = xyWebWalletPubKey.subarray(1);
	const versionY = new Uint8Array(1);
  const datum = tupleCV({
    version: bufferCV(versionY.fill(5)),
    hashbytes: bufferCV(xOnlyPubKey)
  });

  const functionArgs = [uintCV(amount), datum]
  await openContractCall({
    network: getStacksNetwork(),
    postConditions: [],
    postConditionMode: PostConditionMode.Deny,
    contractAddress: CONFIG.VITE_SBTC_MINI_DEPLOYER,
    contractName: sbtcMiniContracts.pool,
    functionName: 'signer-pre-register',
    functionArgs: functionArgs,
    onFinish: (data: any) => {
      console.log('TX Data: ', data);
      callback(data);
    },
    onCancel: () => {
      console.log('popup closed!');
    }
  });
}

export async function revokeDelegate(callback:any) {
  //data {addr: principal, key: (buff 33)}
  const delegateTo = contractPrincipalCV(CONFIG.VITE_SBTC_MINI_DEPLOYER, sbtcMiniContracts.pool);
  const functionArgs = [delegateTo]
  await openContractCall({
    network: getStacksNetwork(),
    postConditions: [],
    postConditionMode: PostConditionMode.Deny,
    contractAddress: CONFIG.VITE_POX_MINI_CONTRACT.split('.')[0],
    contractName: CONFIG.VITE_POX_MINI_CONTRACT.split('.')[1],
    functionName: 'disallow-contract-caller',
    functionArgs: functionArgs,
    onFinish: (data: any) => {
      console.log('TX Data: ', data);
      callback(data);
    },
    onCancel: () => {
      console.log('popup closed!');
    }
  });
}

export async function allowDelegate(callback:any, burnHeight:number) {
  //data {addr: principal, key: (buff 33)}
  const delegateTo = contractPrincipalCV(CONFIG.VITE_SBTC_MINI_DEPLOYER, sbtcMiniContracts.pool);
  const until = someCV(uintCV(burnHeight * 2));
  const functionArgs = [delegateTo, until]
  await openContractCall({
    network: getStacksNetwork(),
    postConditions: [],
    postConditionMode: PostConditionMode.Deny,
    contractAddress: CONFIG.VITE_POX_MINI_CONTRACT.split('.')[0],
    contractName: CONFIG.VITE_POX_MINI_CONTRACT.split('.')[1],
    functionName: 'allow-contract-caller',
    functionArgs: functionArgs,
    onFinish: (data: any) => {
      console.log('TX Data: ', data);
      callback(data);
    },
    onCancel: () => {
      console.log('popup closed!');
    }
  });
}

export async function mintTo(amount:number, stxAddress: string, btcTxid: string) {
  //data {addr: principal, key: (buff 33)}
  const btcAddressCV = stringAsciiCV(btcTxid);
  const stxAddressCV = principalCV(stxAddress);
  const functionArgs = [uintCV(amount), stxAddressCV, btcAddressCV]
  await openContractCall({
    network: getStacksNetwork(),
    postConditions: [],
    postConditionMode: PostConditionMode.Deny,
    contractAddress: CONFIG.VITE_SBTC_CONTRACT_ID.split('.')[0],
    contractName: CONFIG.VITE_SBTC_CONTRACT_ID.split('.')[1],
    functionName: 'mint!',
    functionArgs: functionArgs,
    onFinish: (data: any) => {
      console.log('TX Data: ', data);
      return data;
    },
    onCancel: () => {
      console.log('popup closed!');
    }
  });
}

export async function burnFrom(amount:number, stxAddress: string, btcTxid: string) {
  //data {addr: principal, key: (buff 33)}
  const btcAddressCV = stringAsciiCV(btcTxid);
  const stxAddressCV = principalCV(stxAddress);
  const functionArgs = [uintCV(amount), stxAddressCV, btcAddressCV]
  await openContractCall({
    network: getStacksNetwork(),
    postConditions: [],
    postConditionMode: PostConditionMode.Allow,
    contractAddress: CONFIG.VITE_SBTC_CONTRACT_ID.split('.')[0],
    contractName: CONFIG.VITE_SBTC_CONTRACT_ID.split('.')[1],
    functionName: 'burn!',
    functionArgs: functionArgs,
    onFinish: (data: any) => {
      console.log('TX Data: ', data);
      return data;
    },
    onCancel: () => {
      console.log('popup closed!');
    }
  });
}

export async function setCoordinator(address:string) {
  //data {addr: principal, key: (buff 33)}
  const datum = tupleCV({
    addr: principalCV(address),
    key: bufferCVFromString('33 max byte buffer')
  });

  const functionArgs = [datum]
  await openContractCall({
    network: getStacksNetwork(),
    postConditions: [],
    postConditionMode: PostConditionMode.Deny,
    contractAddress: CONFIG.VITE_SBTC_CONTRACT_ID.split('.')[0],
    contractName: CONFIG.VITE_SBTC_CONTRACT_ID.split('.')[1],
    functionName: 'set-coordinator-data',
    functionArgs: functionArgs,
    onFinish: (data: any) => {
      console.log('TX Data: ', data);
      return data;
    },
    onCancel: () => {
      console.log('popup closed!');
    }
  });
}

export async function setBtcWallet(address:string) {
  const datum = stringAsciiCV(address)
  const functionArgs = [datum]
  await openContractCall({
    network: getStacksNetwork(),
    postConditions: [],
    postConditionMode: PostConditionMode.Deny,
    contractAddress: CONFIG.VITE_SBTC_CONTRACT_ID.split('.')[0],
    contractName: CONFIG.VITE_SBTC_CONTRACT_ID.split('.')[1],
    functionName: 'set-bitcoin-wallet-address',
    functionArgs: functionArgs,
    onFinish: (data: any) => {
      console.log('TX Data: ', data);
      return data;
    },
    onCancel: () => {
      console.log('popup closed!');
    }
  });
}

