import { expect } from "chai";
import { ethers, network, waffle } from "hardhat";
import DogeSoundClubMateArtifact from "../artifacts/contracts/DogeSoundClubMate.sol/DogeSoundClubMate.json";
import DSCMateNameArtifact from "../artifacts/contracts/DSCMateName.sol/DSCMateName.json";
import { DogeSoundClubMate } from "../typechain/DogeSoundClubMate";
import { DSCMateName } from "../typechain/DSCMateName";

const { deployContract } = waffle;

async function mine(count = 1): Promise<void> {
    expect(count).to.be.gt(0);
    for (let i = 0; i < count; i += 1) {
        await ethers.provider.send("evm_mine", []);
    }
}

describe("DSCMateName", () => {
    let mate: DogeSoundClubMate;
    let mateName: DSCMateName;

    const provider = waffle.provider;
    const [admin, other] = provider.getWallets();

    beforeEach(async () => {
        mate = await deployContract(
            admin,
            DogeSoundClubMateArtifact,
            []
        ) as DogeSoundClubMate;
        mateName = await deployContract(
            admin,
            DSCMateNameArtifact,
            [mate.address]
        ) as DSCMateName;
    })

    context("new DSCMateName", async () => {
        it("set name", async () => {
            await mate.mint(admin.address, 0);
            await mateName.set(0, "도지사운드클럽");
            expect(await mateName.names(0)).to.be.equal("도지사운드클럽");
        })
    })
})