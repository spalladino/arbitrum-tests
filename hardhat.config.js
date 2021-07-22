require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

const KEY = process.env.PRIVATE_KEY;
const INFURA = process.env.INFURA_TOKEN;

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();
  for (const account of accounts) {
    const address = await account.getAddress();
    const balance = await ethers.provider.getBalance(address);
    console.log(`${address} (${balance.toString()})`);
  }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.6",
  networks: {
    local: {
      url: 'http://localhost:8545',
      accounts: ['0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'],
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA}`,
      accounts: [KEY]
    },
    'arbitrum-rinkeby': {
      url: 'https://rinkeby.arbitrum.io/rpc',
      accounts: [KEY],
    },
  }
};
