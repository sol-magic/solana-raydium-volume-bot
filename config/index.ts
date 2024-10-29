import { Connection } from "@solana/web3.js";
import { logger, retrieveEnvVariable } from "../utils/utils";


// Utility function for converting to number with fallback
const toNumber = (value: string | null, fallback: number): number => {
  const num = Number(value);
  return isNaN(num) ? fallback : num;
};

// Retrieve all environment variables once
const ENV = {
  RPC_ENDPOINT: retrieveEnvVariable("RPC_ENDPOINT", logger),
  RPC_WEBSOCKET_ENDPOINT: retrieveEnvVariable("RPC_WEBSOCKET_ENDPOINT", logger),
  IS_RANDOM: retrieveEnvVariable("IS_RANDOM", logger),
  SWAP_ROUTING: retrieveEnvVariable("SWAP_ROUTING", logger),
  DISTRIBUTION_AMOUNT: retrieveEnvVariable("DISTRIBUTION_AMOUNT", logger),
  BUY_AMOUNT: retrieveEnvVariable("BUY_AMOUNT", logger),
  BUY_UPPER_AMOUNT: retrieveEnvVariable("BUY_UPPER_AMOUNT", logger),
  BUY_LOWER_AMOUNT: retrieveEnvVariable("BUY_LOWER_AMOUNT", logger),
  BUY_MORE_WHEN: retrieveEnvVariable("BUY_MORE_WHEN", logger),
  SELL_MORE_WHEN: retrieveEnvVariable("SELL_MORE_WHEN", logger),
  BUY_INTERVAL_MIN: retrieveEnvVariable("BUY_INTERVAL_MIN", logger),
  BUY_INTERVAL_MAX: retrieveEnvVariable("BUY_INTERVAL_MAX", logger),
  SELL_ALL_BY_TIMES: retrieveEnvVariable("SELL_ALL_BY_TIMES", logger),
  SELL_PERCENT: retrieveEnvVariable("SELL_PERCENT", logger),
  WALLET_NUM: retrieveEnvVariable("WALLET_NUM", logger),
  TX_FEE: retrieveEnvVariable("TX_FEE", logger),
  POOL_ID: retrieveEnvVariable("POOL_ID", logger),
  TOKEN_MINT: retrieveEnvVariable("TOKEN_MINT", logger),
  LOG_LEVEL: retrieveEnvVariable("LOG_LEVEL", logger),
  ADDITIONAL_FEE: retrieveEnvVariable("ADDITIONAL_FEE", logger),
  JITO_KEY: retrieveEnvVariable("JITO_KEY", logger),
  BLOCKENGINE_URL: retrieveEnvVariable("BLOCKENGINE_URL", logger),
  JITO_FEE: retrieveEnvVariable("JITO_FEE", logger),
  // MONGO_URL: retrieveEnvVariable("MONGO_URL", logger),
};

// Convert and process environment variables with type safety and fallback defaults
export const RPC_ENDPOINT = ENV.RPC_ENDPOINT || "";
export const RPC_WEBSOCKET_ENDPOINT = ENV.RPC_WEBSOCKET_ENDPOINT || "";

export const IS_RANDOM = ENV.IS_RANDOM === "true";
export const SWAP_ROUTING = ENV.SWAP_ROUTING === "true";

export const DISTRIBUTION_AMOUNT = toNumber(ENV.DISTRIBUTION_AMOUNT, 0.01);
export const BUY_AMOUNT = toNumber(ENV.BUY_AMOUNT, 0.01);
export const BUY_UPPER_AMOUNT = toNumber(ENV.BUY_UPPER_AMOUNT, 0.002);
export const BUY_LOWER_AMOUNT = toNumber(ENV.BUY_LOWER_AMOUNT, 0.001);

export const BUY_MORE_WHEN = toNumber(ENV.BUY_MORE_WHEN, 30);
export const SELL_MORE_WHEN = toNumber(ENV.SELL_MORE_WHEN, 30);

export const BUY_INTERVAL_MIN = toNumber(ENV.BUY_INTERVAL_MIN, 4000);
export const BUY_INTERVAL_MAX = toNumber(ENV.BUY_INTERVAL_MAX, 2000);

export const SELL_ALL_BY_TIMES = toNumber(ENV.SELL_ALL_BY_TIMES, 20);
export const SELL_PERCENT = toNumber(ENV.SELL_PERCENT, 100);

export const WALLET_NUM = toNumber(ENV.WALLET_NUM, 8);

export const TX_FEE = toNumber(ENV.TX_FEE, 10);

export const POOL_ID = ENV.POOL_ID; // Pool ID could be null or a string
export const TOKEN_MINT = ENV.TOKEN_MINT; 


export const LOG_LEVEL = ENV.LOG_LEVEL || "info"; // Set default log level

export const ADDITIONAL_FEE = toNumber(ENV.ADDITIONAL_FEE, 0.002);
export const JITO_KEY = ENV.JITO_KEY || "";
export const BLOCKENGINE_URL = ENV.BLOCKENGINE_URL || "";
export const JITO_FEE = toNumber(ENV.JITO_FEE, 120000); // Default fee in lamports

// export const MONGO_URL = ENV.MONGO_URL || "";



// Initialize Solana Connection
export const SOLANA_CONNECTION = new Connection(RPC_ENDPOINT, {
  wsEndpoint: RPC_WEBSOCKET_ENDPOINT,
});