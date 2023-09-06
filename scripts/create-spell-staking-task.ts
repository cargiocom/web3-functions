import hre from "hardhat";

const { ethers, w3f } = hre;

const main = async () => {
  const spellFarmingW3f = w3f.get("spell-farming");

  const [deployer] = await ethers.getSigners();
  const chainId = (await ethers.provider.getNetwork()).chainId;

  const automate = new AutomateSDK(chainId, deployer);

  const cid = await spellFarmingW3f.deploy();

  {
    const task = await automate.createBatchExecTask({
      name: "Farming: Withdraw & Distribute",
      web3FunctionHash: cid,
      web3FunctionArgs: {
        bridgingMinMIMAmount: "0",

        treasuryPercentage: 50,
        intervalInSeconds: 201600, 
        distributionMinMIMAmount: "100000000000000000000",
      },
    });
  }

  const ALTCHAIN_IDS = [250, 43114, 42161];

  for (const chainId of ALTCHAIN_IDS) {
    const { taskId, tx } = await automate.createBatchExecTask({
      name: "SpellFarming: Withdraw & Bridge",
      web3FunctionHash: cid,
      web3FunctionArgs: {
        treasuryPercentage: 0,
        distributionMinMIMAmount: "0",

        bridgingMinMIMAmount: "50000000000000000000", 
        intervalInSeconds: 201600 
      },
    });
  }
};

main()
  .then(() => {
    process.exit();
  })
  .catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
  });
