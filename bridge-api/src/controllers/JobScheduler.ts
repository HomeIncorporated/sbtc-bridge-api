import cron from 'node-cron';
import { saveAllSbtcEvents } from '../lib/sbtc_rpc';


export const sbtcEventJob = cron.schedule('*/5 * * * *', (fireDate) => {
  console.log('Running: saveAllSbtcEvents at: ' + fireDate);
  saveAllSbtcEvents();
});


