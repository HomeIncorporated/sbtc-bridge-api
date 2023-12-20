import cron from 'node-cron';
import { saveAllSbtcEvents } from '../events/events_helper.js';
import { scanBridgeTransactions, scanPeginRRTransactions } from '../../lib/bitcoin/rpc_commit.js';
import { updateExchangeRates } from '../../lib/bitcoin/api_blockcypher.js';
import { checkReveal } from '../../lib/bitcoin/rpc_reveal.js';
import { SbtcWalletController } from '../stacks/StacksRPCController.js';
import { getProposalsForActiveVotingExt, getProposalsFromContractIds } from '../dao/dao_helper.js';
import { getDaoConfig } from '../../lib/config_dao.js';
import { s } from 'vitest/dist/env-afee91f0.js';
import { readAllRewardSlots } from '../dao/reward_slot_helper.js';

export const sbtcEventJob = cron.schedule('*/17 * * * *', (fireDate) => {
  console.log('Running: sbtcEventJob at: ' + fireDate);
  try {
    saveAllSbtcEvents();
  } catch (err) {
    console.log('Error running: saveAllSbtcEvents: ', err);
  }
});

export const peginRequestJob = cron.schedule('*/11 * * * *', (fireDate) => {
  console.log('Running: peginRequestJob at: ' + fireDate);
  try {
    scanBridgeTransactions();
    scanPeginRRTransactions();
  } catch (err) {
    console.log('Error running: scanBridgeTransactions: ', err);
  }
});

export const revealCheckJob = cron.schedule('*/23 * * * *', (fireDate) => {
  console.log('Running: revealCheckJob at: ' + fireDate);
  try {
    checkReveal();
  } catch (err) {
    console.log('Error running: revealCheckJob: ', err);
  }
});

export const exchangeRates = cron.schedule('*/5 * * * *', (fireDate) => {
  console.log('Running: exchangeRates at: ' + fireDate);
  try {
    updateExchangeRates();
  } catch (err) {
    console.log('Error running: exchangeRates: ', err);
  }
});

export const initUiCacheJob = cron.schedule('*/3 * * * *', (fireDate) => {
  try {
    console.log('Running: initUiCacheJob at: ' + fireDate);
    const controller = new SbtcWalletController();
    controller.initUiCache()
  } catch (err) {
    console.log('Error running: initUiCacheJob: ', err);
  }
});

export const initDaoProposalsJob = cron.schedule('*/20 * * * *', (fireDate) => {
  console.log('Running: initDaoProposalsJob at: ' + fireDate);
  try {
    getProposalsForActiveVotingExt(getDaoConfig().VITE_DOA_DEPLOYER + '.' + getDaoConfig().VITE_DOA_SNAPSHOT_VOTING_EXTENSION);
    const submissionContractId = getDaoConfig().VITE_DOA_DEPLOYER + '.' + getDaoConfig().VITE_DOA_FUNDED_SUBMISSION_EXTENSION
    getProposalsFromContractIds(submissionContractId, getDaoConfig().VITE_DOA_PROPOSALS);
  } catch (err) {
    console.log('Error running: initDaoProposalsJob: ', err);
  }
});

export const initRewardSlotsJob = cron.schedule('*/30 * * * *', (fireDate) => {
  try {
    console.log('Running: initUiCacheJob at: ' + fireDate);
    readAllRewardSlots()
  } catch (err) {
    console.log('Error running: initUiCacheJob: ', err);
  }
});

