import { expect } from "chai";
import { ethers, network, waffle } from "hardhat";
import DogeSoundClubMateArtifact from "../artifacts/contracts/DogeSoundClubMate.sol/DogeSoundClubMate.json";
import DSCMateNameArtifact from "../artifacts/contracts/DSCMateName.sol/DSCMateName.json";
import KIP7TokenArtifact from "../artifacts/contracts/klaytn-contracts/token/KIP7/KIP7Token.sol/KIP7Token.json";
import { DogeSoundClubMate } from "../typechain/DogeSoundClubMate";
import { DSCMateName } from "../typechain/DSCMateName";
import { KIP7Token } from "../typechain/KIP7Token";
import { expandTo18Decimals } from "./shared/utils/number";

const { deployContract } = waffle;

async function mine(count = 1): Promise<void> {
    expect(count).to.be.gt(0);
    for (let i = 0; i < count; i += 1) {
        await ethers.provider.send("evm_mine", []);
    }
}

describe("DSCMateName", () => {
    let mate: DogeSoundClubMate;
    let token: KIP7Token;
    let mateName: DSCMateName;

    const provider = waffle.provider;
    const [admin, other] = provider.getWallets();

    beforeEach(async () => {
        mate = await deployContract(
            admin,
            DogeSoundClubMateArtifact,
            []
        ) as DogeSoundClubMate;
        token = await deployContract(
            admin,
            KIP7TokenArtifact,
            ["TestToken", "TEST", 18, 0]
        ) as KIP7Token;
        mateName = await deployContract(
            admin,
            DSCMateNameArtifact,
            [mate.address]
        ) as DSCMateName;
    })

    context("new DSCMateName", async () => {
        it("set name", async () => {
            await mate.mint(admin.address, 0);
            await expect(mateName.set(0, "도지사운드클럽"))
                .to.emit(mateName, "Set")
                .withArgs(0, admin.address, "도지사운드클럽")
            expect((await mateName.record(0, (await mateName.recordCount(0)).sub(1)))[1]).to.be.equal("도지사운드클럽");
        })

        it("set name twice", async () => {
            await mate.mint(admin.address, 0);
            await expect(mateName.set(0, "도지사운드클럽"))
                .to.emit(mateName, "Set")
                .withArgs(0, admin.address, "도지사운드클럽")
            expect((await mateName.record(0, (await mateName.recordCount(0)).sub(1)))[1]).to.be.equal("도지사운드클럽");
            await expect(mateName.set(0, "왈왈"))
                .to.emit(mateName, "Set")
                .withArgs(0, admin.address, "왈왈")
            expect((await mateName.record(0, (await mateName.recordCount(0)).sub(1)))[1]).to.be.equal("왈왈");
        })

        it("set name twice with token", async () => {

            await mate.mint(admin.address, 0);
            await expect(mateName.set(0, "도지사운드클럽"))
                .to.emit(mateName, "Set")
                .withArgs(0, admin.address, "도지사운드클럽")
            expect((await mateName.record(0, (await mateName.recordCount(0)).sub(1)))[1]).to.be.equal("도지사운드클럽");

            await mateName.setToken(token.address);
            await token.mint(admin.address, expandTo18Decimals(200));
            await token.approve(mateName.address, expandTo18Decimals(200));

            await expect(mateName.set(0, "왈왈"))
                .to.emit(mateName, "Set")
                .withArgs(0, admin.address, "왈왈")
            expect((await mateName.record(0, (await mateName.recordCount(0)).sub(1)))[1]).to.be.equal("왈왈");

            await expect(mateName.set(0, "깽깽"))
                .to.emit(mateName, "Set")
                .withArgs(0, admin.address, "깽깽")
            expect((await mateName.record(0, (await mateName.recordCount(0)).sub(1)))[1]).to.be.equal("깽깽");
        })
    })
})