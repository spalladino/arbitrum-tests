# Arbitrum tests

Test proxies and gasleft behaviour in Arbitrum. The contract `Parent` has `test*` functions that execute some gas-intensive work and call another contract (in different order) and track gas usage via `gasleft`, which is exposed via events.

These functions are called directly on the contract and via a proxy. When called via the proxy, if there's call to a third contract, the `gasleft` returned after the call is **greater** than the one returned before.

```
$ yarn hardhat run scripts/test.js --network arbitrum-rinkeby

Testing impl contract directly
testView: 0
testNoCall: 0x89c6163ade8591c5f6677a7b99dfbf18efee8f6e448d024e89ed1e2b6a73b3f6 Gas 7948113, Gas 7921569
testCall: 0x011dc3e6505aa3045ad82a12440d8950aecd522c8fafcfe9eebe370a116962cb Gas 7946826, Gas 7921390
testWorkBeforeCall: 0xcbedd85c95280bc0de0d1107661be6011984ce0cae13755b73aef87079136ca8 Gas 7947592, Gas 7895948
testWorkAfterCall: 0x0d750d26b64a13d75da6f286bc7d80c384928fd87829a9ace67061c56f8fb6c2 Gas 7947334, Gas 7895431
testRevert: 00000000000000000000000000000000000000000000000000000000000063b7

Testing via proxy:
testView: 3
testNoCall: 0x8ec97858c61a2e7ae2ef07945a8c135a79d6740c027c3b7fb7116622b369f20f Gas 7790944, Gas 7748469
testCall: 0x0ad4f70897eb4147c20edfd634e9c144e506be2b5aad4f3479d09639f55be298 Gas 7789676, Gas 7888922
testWorkBeforeCall: 0x3bb9d911090e71d8ccd4afc51ef4d5c186289c639bb1a0a0832f0008747fbfc8 Gas 7790430, Gas 7847701
testWorkAfterCall: 0x3fbc7c41171204c1d70ce61a68058ef739d3b5d968de04b61f77b6a34284aa76 Gas 7790171, Gas 7847184
testRevert: fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe7c51
Done in 85.14s.
```

To run locally:
- Clone and `yarn` to setup
- Create an `.env` file with a `PRIVATE_KEY=` env var
- Create a `deploy.json` file with `{}` as contents (sorry)
- Run `yarn hardhat run scripts/deploy.js --network arbitrum-rinkeby` to deploy the contracts
- Run `yarn hardhat run scripts/test.js --network arbitrum-rinkeby` to run the tests and get the output from above