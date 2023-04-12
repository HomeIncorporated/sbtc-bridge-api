import { mempoolUrl } from '../config.js';
import fetch from 'node-fetch';

/**
export async function fetchUtxoSet(address:string) {
  const url = mempoolUrl + '/address/' + address;
  const response = await fetch(url);
  if (response.status !== 200) throw new Error('Address not found - is the network correct?');
  const result = await response.json();
  const utxos = await fetchUTXOs(address);
  for (let utxo of utxos) {
    const tx = await fetchTransaction(utxo.txid);
    const hex = await fetchTransactionHex(utxo.txid);
    tx.hex = hex;
    utxo.tx = tx;
  }
  return { addressDetails: result, utxos };
}
 */

export async function fetchTransactionHex(txid:string) {
  //https://api.blockcypher.com/v1/btc/test3/txs/<txID here>?includeHex=true
  //https://mempool.space/api/tx/15e10745f15593a899cef391191bdd3d7c12412cc4696b7bcb669d0feadc8521/hex
  const url = mempoolUrl + '/tx/' + txid + '/hex';
  const response = await fetch(url);
  const hex = await response.text();
  return hex;
}

export async function fetchTransaction(txid:string) {
  const url = mempoolUrl + '/tx/' + txid;
  const response = await fetch(url);
  if (response.status !== 200) throw new Error('Unable to fetch transaction for: ' + txid);
  const tx = await response.json();
  return tx;
}

export async function fetchAddressTransactions(address:string) {
  const url = mempoolUrl + '/address/' + address + '/txs';
  const response = await fetch(url);
  if (response.status !== 200) throw new Error('Unable to retrieve utxo set from mempool?');
  const result = await response.json();
  return result;
}

export async function fetchUTXOs(address:string) {
  const url = mempoolUrl + '/address/' + address + '/utxo';
  const response = await fetch(url);
  if (response.status !== 200) throw new Error('Unable to retrieve utxo set from mempool?');
  const result = await response.json();
  return result;
}

export async function readTx(txid:string) {
  const url = mempoolUrl + '/tx/' + txid;
  const response = await fetch(url);
  const result = await response.json();
  let error = '';
  try {
    return (result.vout);
  } catch (err:any) {
    error = err.message;
  }
  throw new Error(error);
}

export async function sendRawTx(hex:string) {
  const url = mempoolUrl + '/tx';
  console.log('sendRawTx:mempoolUrl: ', url)
  const response = await fetch(url, {
    method: 'POST',
    //headers: { 'Content-Type': 'application/json' },
    body: hex
  });
  let result:any;
  if (response.status !== 200) throw new Error('Mempool error: ' + response.status + ' : ' + response.statusText);
  try {
    result = await response.json();
  } catch (err) {
    result = await response.text();
  }
  return result;
}
