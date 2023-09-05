import hre from "hardhat";
import { AutomateSDK } from "automate-sdk";

const { ethers, w3f } = hre;

const main = async () => {
  const stargateW3f = w3f.get("magiccurvelp");

  const [deployer] = await ethers.getSigners();
  const chainId = (await ethers.provider.getNetwork()).chainId;

  const automate = new AutomateSDK(chainId, deployer);

  const cid = await stargateW3f.deploy();

  {
    const task = await automate.createBatchExecTask({
      name: "",
      web3FunctionHash: cid,
      web3FunctionArgs: {
        execAddress: "",
        vaultAddress: "",
        minRequiredLpAmount: "100000000000000000000", 
        intervalInSeconds: 86400,
        swapRewardsSlippageBips: 100, 
      },
    });
  }
}

main()
  .then(() => {
    process.exit();
  })
  .catch((err) => {
    process.exit(1);
  });
