import hre from "hardhat";

const { ethers, w3f } = hre;

const main = async () => {
  const magicglpW3f = w3f.get("magicglp");

  const [deployer] = await ethers.getSigners();
  const chainId = (await ethers.provider.getNetwork()).chainId;

  const automate = new AutomateSDK(chainId, deployer);

  const cid = await magicglpW3f.deploy();

  {
    const task = await automate.createBatchExecTask({
      web3FunctionHash: cid,
      web3FunctionArgs: {
        maxApyInBips: 10000,
        mintGlpSlippageInBips: 100,
        intervalInSeconds: 3600
      },
    });
  }

  {
    const task = await automate.createBatchExecTask({
      web3FunctionHash: cid,
      web3FunctionArgs: {
        maxApyInBips: 10000,
        mintGlpSlippageInBips: 100,
        intervalInSeconds: 604800
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
