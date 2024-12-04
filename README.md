# Solana Raydium Volume Bot

## Contact Info

Telegram: @web3wiza
Discord: web3_wiza

You can always feel free to find me here for my help on other projects.

## Key Features

### Version 1
- 1. Automatic SOL Distribution
Automatically distribute SOL tokens across multiple wallets to streamline asset management and optimize transaction execution.

- 2. Multiple Wallet Support
Seamlessly manage and execute trades across several wallets to diversify strategy and reduce exposure.

- 3. Token Swapping
Utilize the Raydium SDK or Jupiter API for efficient token swaps, enabling quick and cost-effective trading strategies.

- 4. Dynamic Trading Intervals
Buy and sell tokens in random amounts at varying time intervals across multiple wallets, adding an element of unpredictability to trading behavior.

- 5. Transactions via Jito Mode
Conduct transactions using Jito mode to enhance efficiency and speed in order execution.

- 6. Solana Volume Wallet Gathering
Collect SOL from designated volume wallets to facilitate trading and ensure liquidity.

### Version 2: Enhanced Buyer Strategy
- **Adjust Buying vs. Selling Ratios**: Increase the frequency of purchases to sales, adopting strategies such as 2 purchases for every 1 sale or engaging in 3 purchases at a time, while limiting selling actions to enhance market presence.
- **SOL Collection Post-Transaction**: Gather SOL once remaining tokens in the wallets are sold to optimize asset rotation.

### Version 3: MEV Protection
- **Bundled Transactions**: Safeguard against potential MEV attacks by bundling buy and sell transactions into a single operation, minimizing the risk of front-running.

### Version 4: Strategic Volume Wallet Creation
- **Timed Wallet Deployment**: Create volume wallets at staggered intervals to avoid detection patterns commonly associated with automated, non-human behavior.
- **Targeted Trading Windows**: Conduct buying and selling activities within specific timeframes to further obscure transactional activity from scrutiny.

## Usage
1. Clone the repository
```
git clone https://github.com/sol-magic/solana-raydium-volume-bot
cd solana-raydium-volume-bot
```
2. Install dependencies
```
npm install
```
3. Configure the environment variables

<!-- Rename the .env.example file to .env and set RPC and WSS, main wallet's secret key, and jito auth keypair. -->

4. Run the bot

```
npm run start
