import hre from "hardhat";4444

const { ethers, w3f } = hre;

const main = async () => {
  const spellSwapperW3f = w3f.get("spell-swapper");

  const [deployer] = await ethers.getSigners();
  const chainId = (await ethers.provider.getNetwork()).chainId;

  const automate = new AutomateSDK(chainId, deployer);

  const cid = await spellSwapperW3f.deploy();

  {
    const task = await automate.createBatchExecTask({
      name: "SpellSwapping",
      web3FunctionHash: cid,
      web3FunctionArgs: {
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
