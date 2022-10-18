// npx ts-node ./src/examples/sendTransaction.ts

import { DirectSecp256k1HdWallet, OfflineSigner } from '@cosmjs/proto-signing';
import {
  assertIsDeliverTxSuccess,
  SigningStargateClient,
  StdFee,
  calculateFee,
  GasPrice,
  coins,
} from '@cosmjs/stargate';

async function createAddress(): Promise<OfflineSigner> {
  const mnemonic =
    'sheriff ability city subject glue wheat remind decline syrup method toddler delay';
  // cosmos1cayfge4kmdstte5j25hmxj8rnlutgyx8sd0932
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);

  return wallet;
}

async function sendTransaction(wallet: OfflineSigner) {
  const rpcEndpoint = 'https://cosmos-testnet-rpc.allthatnode.com:26657';
  const client = await SigningStargateClient.connectWithSigner(
    rpcEndpoint,
    wallet
  );

  const recipient = 'cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5';
  const amount = coins(1, 'uatom');

  const accounts = await wallet.getAccounts();
  const [firstAccount] = accounts;
  console.log({ firstAccount, accounts });
  const defaultGasPrice = GasPrice.fromString('0.025uatom');
  const defaultSendFee: StdFee = calculateFee(80_000, defaultGasPrice);

  console.log('sender', firstAccount.address);
  console.log('transactionFee', defaultSendFee);
  console.log('amount', amount);

  const transaction = await client.sendTokens(
    firstAccount.address,
    recipient,
    amount,
    defaultSendFee,
    'Transaction'
  );
  assertIsDeliverTxSuccess(transaction);
  console.log('Successfully broadcasted:', transaction);
}

(async () => {
  const wallet = await createAddress();
  sendTransaction(wallet);
})();
