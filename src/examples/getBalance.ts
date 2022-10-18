// npx ts-node ./src/examples/getBalance.ts

import { Coin, createProtobufRpcClient, QueryClient } from '@cosmjs/stargate';
import { QueryClientImpl } from 'cosmjs-types/cosmos/bank/v1beta1/query';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';

export const getBalance = async (
  denom: string,
  address: string,
  rcp: string
): Promise<Coin | undefined> => {
  try {
    const tendermint = await Tendermint34Client.connect(rcp);
    const queryClient = new QueryClient(tendermint);
    const rpcClient = createProtobufRpcClient(queryClient);
    const bankQueryService = new QueryClientImpl(rpcClient);

    const { balance } = await bankQueryService.Balance({
      address,
      denom,
    });

    return balance;
  } catch (error) {
    console.log(error);
  }
};

(async function () {
  const balance = await getBalance(
    'uatom',
    // 'cosmos1peydkky2dcj0n8mc9nl4rx0qwwmwph94mkp6we',
    'cosmos1cayfge4kmdstte5j25hmxj8rnlutgyx8sd0932',
    'https://cosmos-testnet-rpc.allthatnode.com:26657'
    // 'https://cosmos-mainnet-rpc.allthatnode.com:26657/'
  );

  console.log({ balance });
})();
