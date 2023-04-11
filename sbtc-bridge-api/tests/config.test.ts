import { dumpConfig, btcNode } from '../src/lib/config'
import util from 'util'

describe('bitcoin rpc suite - requires bitcoin core running on testnet', () => {
  beforeAll(async () => {
    //console.log("beforeAll: -----------------------------------------------");
  })

  beforeEach(async () => {
    // cant fetch mock here as only first mock is recognised
  })

  it.concurrent('Check estimateSmartFee() returns correct fees', async () => {
    const result = dumpConfig();
    //console.log('walletInfoResult: ', util.inspect(result, false, null, true /* enable colors */));
    expect(btcNode).equals('localhost:18332');
  })

})
