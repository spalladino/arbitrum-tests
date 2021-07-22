const { readJSONSync } = require('fs-extra');

async function get(name, address) {
  return ethers.getContractFactory(name).then(f => f.attach(address));
}

async function testFunction(child, caller, fun) {
  try {
    const tx = await caller[fun](child.address, { gasLimit: 100e6 }).then(tx => tx.wait());
    console.log(`${fun}:`, tx.transactionHash, tx.events.map(e => `${e.event} ${e.args[0]}`).join(', '));
  } catch (err) {
    console.log(`${fun} FAILED: ${err.message}`);
  }
}

async function test(child, caller) {
  const viewRes = await caller.testView(child.address).then(x => x.toString());
  console.log('testView:', viewRes);

  await testFunction(child, caller, 'testNoCall');
  await testFunction(child, caller, 'testCall');
  await testFunction(child, caller, 'testWorkBeforeCall');
  await testFunction(child, caller, 'testWorkAfterCall');

  const revertTx = await caller.estimateGas.testRevert(child.address)
    .catch(err => err.error 
      ? err.error.data.replace('0x08c379a000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000020', '')
      : Buffer.from(err.message.match(/reverted with reason string '([^']+)'/)[1]).toString('hex')
    );
  console.log(`testRevert:`, revertTx);
}

async function main() {
  const data = readJSONSync('deploy.json');
  const chainId = await ethers.provider.getNetwork().then(n => n.chainId);
  const child = await get('Child', data[chainId].child);
  const impl = await get('Caller', data[chainId].impl);
  const proxy = await get('Caller', data[chainId].proxy);
  
  console.log(`Testing impl contract directly`);
  await test(child, impl);

  console.log(`\nTesting via proxy:`);
  await test(child, proxy);
}

main();