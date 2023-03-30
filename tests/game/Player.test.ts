import { Player } from "../../src/game/Player";
import { Aether } from "../../src/storage/characters/Aether";

describe("game/Player", () => {
  it("add character", () => {
    const player = new Player();
    player.addCharacter(new Aether());

    expect(player.Characters.length).toBe(1);
  });

  it("can't add duplicate character", () => {
    const player = new Player();
    player.addCharacter(new Aether());

    expect(() => player.addCharacter(new Aether())).toThrow(
      "duplicate character"
    );
  });

  it("remove character", () => {
    const player = new Player();
    player.addCharacter(new Aether());
    player.removeCharacter(new Aether());

    expect(player.Characters.length).toBe(0);
  });

  it("can't remove nonexistent character", () => {
    const player = new Player();

    expect(() => player.removeCharacter(new Aether())).toThrow(
      "no have character"
    );
  });
});
