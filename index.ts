import { NATIVE_MINT, getAssociatedTokenAddress } from '@solana/spl-token';
import {
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';

import BN from 'bn.js';
import {
  BUY_AMOUNT,
  SWAP_ROUTING,
  BUY_INTERVAL_MAX,
  BUY_INTERVAL_MIN,
  BUY_LOWER_AMOUNT,
  BUY_UPPER_AMOUNT,
  IS_RANDOM,
  SOLANA_CONNECTION,
  ADDITIONAL_FEE
} from './config';
import { execute } from './utils/executor/legacy';
import { getBuyTx, getBuyTxWithJupiter, getSellTx, getSellTxWithJupiter } from './utils/swap';
import {  readJson, sleep } from './utils/utils';

import base58 from 'bs58'
import { VersionedTransaction } from '@solana/web3.js';

const RETRY_DELAY_MS = 2000;
const MAX_RETRY = 10;

const main = () => {
  const wallets: any[] = readJson("./wallets.json")
  let temp_wallets: { kp: Keypair }[] = []

  for (let i = 0; i < wallets.length; i++) {
    temp_wallets.push({
      kp: Keypair.fromSecretKey(base58.decode(wallets[i].privateKey)),
    })
  }

  processWallets(
    temp_wallets,
    temp_wallets.length,
    new PublicKey("21AErpiB8uSb94oQKRcwuHqyHF93njAxBSbdUrpupump"),
    new PublicKey("32vFAmd12dTHMwo9g5QuCE9sgvdv72yUfK9PMP2dtBj7")
  )
}

const processWallets = async (
  wallets: { kp: Keypair }[],
  numUsedWallets: number,
  baseMint: PublicKey,
  poolId: PublicKey,
) => {
  await Promise.all(
    wallets.slice(0, numUsedWallets).map(async ({ kp }, i) => {
      await sleep(((BUY_INTERVAL_MAX + BUY_INTERVAL_MIN) * i) / 2); // Optional delay

      let active = true;
      while (active) {

        await performBuyAndSell(kp, baseMint, poolId, i);
        await sleep(
          5000 +
          numUsedWallets * (Math.random() * (BUY_INTERVAL_MAX - BUY_INTERVAL_MIN) + BUY_INTERVAL_MIN),
        );
      }
    }),
  );
};

const performBuyAndSell = async (
  kp: Keypair,
  baseMint: PublicKey,
  poolId: PublicKey,
  index: number
) => {
  const solBalance = (await SOLANA_CONNECTION.getBalance(kp.publicKey)) / LAMPORTS_PER_SOL;
  if (solBalance < ADDITIONAL_FEE) {
    console.log(`Wallet ${kp.publicKey.toBase58()} has insufficient balance (${solBalance} SOL).`);
    return;
  }

  const buyAmount = IS_RANDOM
    ? Number((Math.random() * (BUY_UPPER_AMOUNT - BUY_LOWER_AMOUNT) + BUY_LOWER_AMOUNT).toFixed(6))
    : BUY_AMOUNT;


  // console.log(`Wallet ${index}: Attempting to buy...`);
  // console.log("buyAmount", buyAmount)
  // await retryTransaction(() => buy(kp, baseMint, poolId, buyAmount), MAX_RETRY);

  await sleep(5000);

  console.log(`Wallet ${index}: Attempting to sell...`);
  await retryTransaction(() => sell(kp, baseMint, poolId), MAX_RETRY);
};

const retryTransaction = async (fn: () => Promise<boolean>, maxRetry: number) => {
  let attempt = 0;
  while (attempt < maxRetry) {
    const result = await fn();
    if (result) {
      // transaction successful
      return;
    }
    attempt++;
    console.error(`Transaction failed (Attempt ${attempt}/${maxRetry}), retrying...`);
    await sleep(RETRY_DELAY_MS);
  }
  console.error('Max retry attempts reached, aborting transaction.');
};

const buy = async (newWallet: Keypair, baseMint: PublicKey, poolId: PublicKey, buyAmount: number): Promise<boolean> => {
  console.log("baseMint", baseMint)
  console.log("poolId", poolId)
  let solBalance: number = 0;
  try {
    solBalance = await SOLANA_CONNECTION.getBalance(newWallet.publicKey);
  } catch (error) {
    console.log('Error getting balance of wallet');
    return false;
  }
  if (solBalance == 0) {
    return false;
  }
  try {
    let tx: VersionedTransaction | null;
    if (SWAP_ROUTING) tx = await getBuyTxWithJupiter(newWallet, baseMint, buyAmount);
    else tx = await getBuyTx(SOLANA_CONNECTION, newWallet, baseMint, NATIVE_MINT, buyAmount, poolId.toBase58());
    if (tx == null) {
      console.log(`Error getting buy transaction`);
      return false;
    }
    const latestBlockHash = await SOLANA_CONNECTION.getLatestBlockhash();
    const txSig = await execute(tx, latestBlockHash);
    if(txSig === "") {
      return false;
    }else{
      return true;
    }
  } catch (error) {
    return false;
  }
};

const sell = async (
  wallet: Keypair,
  baseMint: PublicKey,
  poolId: PublicKey,
  isHalfSell: boolean = false,
): Promise<boolean> => {

  try {
    const tokenAta = await getAssociatedTokenAddress(baseMint, wallet.publicKey);
    const tokenBalInfo = await SOLANA_CONNECTION.getTokenAccountBalance(tokenAta);
    console.log("tokenBalInfo", tokenBalInfo)
    if (!tokenBalInfo) {
      console.log('Balance incorrect');
      return false;
    }
    let tokenBalance = tokenBalInfo.value.amount;
    console.log(tokenBalance);
    if (isHalfSell) tokenBalance = new BN(tokenBalInfo.value.amount).div(new BN(2)).toString();

    let sellTx: VersionedTransaction | null;
    if (SWAP_ROUTING) sellTx = await getSellTxWithJupiter(wallet, baseMint, tokenBalance);
    else sellTx = await getSellTx(SOLANA_CONNECTION, wallet, baseMint, NATIVE_MINT, tokenBalance, poolId.toBase58());

    if (sellTx == null) {
      console.log(`Error getting sell transaction`);
      return false;
    }

    const latestBlockHashForSell = await SOLANA_CONNECTION.getLatestBlockhash();
    const txSig = await execute(sellTx, latestBlockHashForSell, false);
    if(txSig === "") {
      return false;
    }else{
      return true;
    }

  } catch (error) {
    console.log("Error sell=>", error)
    return false;
  }
};

main()