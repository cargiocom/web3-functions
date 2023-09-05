import hre from "hardhat";

const { ethers, w3f } = hre;

const main = async () => {
  const stargateW3f = w3f.get("stargate");

  const [deployer] = await ethers.getSigners();
  const chainId = (await ethers.provider.getNetwork()).chainId;

  const automate = new AutomateSDK(chainId, deployer);

  const cid = await stargateW3f.deploy();

  {
    const task = await automate.createBatchExecTask({
      name: "",
      web3FunctionHash: cid,
      web3FunctionArgs: {
        intervalInSeconds: 86400,
        swapToLpSlippageBips: 50
      },
    });
  }

  {
    const task = await automate.createBatchExecTask({
      name: "",
      web3FunctionHash: cid,
      web3FunctionArgs: {
        intervalInSeconds: 86400,
        swapToLpSlippageBips: 50
      },
    });
  }
}

main()
  .then(() => {
    process.exit();
  })
  .catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
  });
