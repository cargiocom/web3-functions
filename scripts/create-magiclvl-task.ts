import hre from "hardhat";

const { ethers, w3f } = hre;

const main = async () => {
  const magiclvl = w3f.get("magiclvl");

  const [deployer] = await ethers.getSigners();
  const chainId = (await ethers.provider.getNetwork()).chainId;

  const automate = new AutomateSDK(chainId, deployer);

  const cid = await magiclvl.deploy();

  for (const config of configs) {
    const task = await automate.createBatchExecTask({
      name: config.name,
      web3FunctionHash: cid,
      web3FunctionArgs: {
        vaultCargio: config.vaultCargio,
        maxApyInBips: 5000,
        intervalInSeconds: 86400
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
