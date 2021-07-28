import hardhat from "hardhat";

async function main() {
    console.log("deploy start")

    const DSCMateName.test = await hardhat.ethers.getContractFactory("DSCMateName.test")
    const mateName = await DSCMateName.test.deploy()
    console.log(`DSCMateName.test address: ${mateName.address}`)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
