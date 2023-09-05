import hre from "hardhat";
import { AutomateSDK } from "automate-sdk";

const { ethers, w3f } = hre;

const main = async () => {
  const magicapeW3f = w3f.get("magicape");

  const [deployer] = await ethers.getSigners();
  const chainId = (await ethers.provider.getNetwork()).chainId;

  const automate = new AutomateSDK(chainId, deployer);

  const cid = await magicapeW3f.deploy();

  {
    const task = await automate.createBatchExecTask({
      web3FunctionHash: cid,
      web3FunctionArgs: {
        intervalInSeconds: 604800
      },
    });
    let data = task.tx.data.replace("9a688cc56f5f4fc75eaf8fdf18f43260ae43647c", "4D0c7842cD6a04f8EDB39883Db7817160DA159C3");
  }
};

main()
  .then(() => {
    process.exit();
  })
  .catch((err) => {
    process.exit(1);
  });
