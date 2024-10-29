import { VersionedTransaction } from "@solana/web3.js";
import { SOLANA_CONNECTION } from "../../config";


interface Blockhash {
  blockhash: string;
  lastValidBlockHeight: number;
}

export const execute = async (transaction: VersionedTransaction, latestBlockhash: Blockhash, isBuy: boolean = true) => {
  console.log("Executing Tx...")
  const connection = SOLANA_CONNECTION
  // console.log(await connection.simulateTransaction(transaction));
  const signature = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: true })
  // console.log("signature", signature)
  const confirmation = await connection.confirmTransaction(
    {
      signature,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      blockhash: latestBlockhash.blockhash,
    }
  );

  if (confirmation.value.err) {
    console.log("Confirmation error")
    return ""
  } else {
    if (isBuy)
      console.log(`Success in buy transaction: https://solscan.io/tx/${signature}`)
    else
      console.log(`Success in Sell transaction: https://solscan.io/tx/${signature}`)
  }
  return signature
}