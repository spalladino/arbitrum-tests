const { readJSONSync, writeJSONSync } = require('fs-extra');

async function deploy(name, ...params) {
  const factory = await ethers.getContractFactory(name);
  const contract = await factory.deploy(...params);
  await contract.deployTransaction.wait();
  console.log(`Deployed ${name} at ${contract.address}`);
  return contract;
}

async function main() {
  const impl = await deploy('Caller');
  const proxy = await deploy('ERC1967Proxy', impl.address, '0x');
  const child = await deploy('Child');
  const chainId = await ethers.provider.getNetwork().then(n => n.chainId);
  
  const data = readJSONSync('deploy.json');
  writeJSONSync('deploy.json', { ...data, [chainId]: { 
    child: child.address,
    impl: impl.address,
    proxy: proxy.address,
  }});
}

main();