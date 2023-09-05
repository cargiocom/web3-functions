import hre from "hardhat";

const { ethers, w3f } = hre;

const main = async () => {
  const spellNegativeInterests = w3f.get("negative-interests");

  const [deployer] = await ethers.getSigners();
  const chainId = (await ethers.provider.getNetwork()).chainId;

  const automate = new AutomateSDK(chainId, deployer);

  const cid = await spellNegativeInterests.deploy();

  const configs = [
    {
      web3FunctionArgs: {
        intervalInSeconds: 86400,
        rewardSwappingSlippageInBips: 200,
        maxBentoBoxAmountIncreaseInBips: 1,
        maxBentoBoxChangeAmountInBips: 1000,
        interestAdjusterType: "NONE",
        interestAdjusterParameters: ""
      }
    },
    {
      name: "NegativeInterests: WETH",
      web3FunctionArgs: {
        intervalInSeconds: 86400,
        rewardSwappingSlippageInBips: 200,
        maxBentoBoxAmountIncreaseInBips: 1,
        maxBentoBoxChangeAmountInBips: 1000,
        interestAdjusterType: "NONE",
        interestAdjusterParameters: ""
      }
    },
    {
      name: "NegativeInterests: CRV",
      web3FunctionArgs: {
        zeroExApiBaseUrl: "",
        swapToAddress: "",
        intervalInSeconds: 43400,
        rewardSwappingSlippageInBips: 0,
        maxBentoBoxAmountIncreaseInBips: 1,
        maxBentoBoxChangeAmountInBips: 1000,
        interestAdjusterType: "CRV_AIP_13_6",
      }
    },
  ];

  for (const config of configs) {
    const task = await automate.createBatchExecTask({
      name: config.name,
      web3FunctionHash: cid,
      web3FunctionArgs: config.web3FunctionArgs,
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
