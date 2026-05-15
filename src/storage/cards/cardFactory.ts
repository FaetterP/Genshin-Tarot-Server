import { ECard } from "../../types/enums";
import { Card } from "./Card";
import { ForeignRockblade } from "./Aether/ForeignRockblade";
import { ForeignRockbladePlus } from "./Aether/ForeignRockbladePlus";
import { StarfellSword } from "./Aether/StarfellSword";
import { StarfellSwordPlus } from "./Aether/StarfellSwordPlus";
import { SolarIsotoma } from "./Albedo/SolarIsotoma";
import { SolarIsotomaPlus } from "./Albedo/SolarIsotomaPlus";
import { WeissBladework } from "./Albedo/WeissBladework";
import { WeissBladeworkPlus } from "./Albedo/WeissBladeworkPlus";
import { ExplosivePuppet } from "./Amber/ExplosivePuppet";
import { ExplosivePuppetPlus } from "./Amber/ExplosivePuppetPlus";
import { Sharpshooter } from "./Amber/Sharpshooter";
import { SharpshooterPlus } from "./Amber/SharpshooterPlus";
import { LetTheShowBegin } from "./Barbara/LetTheShowBegin";
import { LetTheShowBeginPlus } from "./Barbara/LetTheShowBeginPlus";
import { WhisperOfWater } from "./Barbara/WhisperOfWater";
import { WhisperOfWaterPlus } from "./Barbara/WhisperOfWaterPlus";
import { Oceanborn } from "./Beidou/Oceanborn";
import { OceanbornPlus } from "./Beidou/OceanbornPlus";
import { Tidecaller } from "./Beidou/Tidecaller";
import { TidecallerPlus } from "./Beidou/TidecallerPlus";
import { PassionOverload } from "./Bennett/PassionOverload";
import { PassionOverloadPlus } from "./Bennett/PassionOverloadPlus";
import { StrikeOfFortune } from "./Bennett/StrikeOfFortune";
import { StrikeOfFortunePlus } from "./Bennett/StrikeOfFortunePlus";
import { Demonbane } from "./ChongYun/Demonbane";
import { DemonbanePlus } from "./ChongYun/DemonbanePlus";
import { LayeredFrost } from "./ChongYun/LayeredFrost";
import { LayeredFrostPlus } from "./ChongYun/LayeredFrostPlus";
import { SearingOnslaught } from "./Diluc/SearingOnslaught";
import { SearingOnslaughtPlus } from "./Diluc/SearingOnslaughtPlus";
import { TemperedSword } from "./Diluc/TemperedSword";
import { TemperedSwordPlus } from "./Diluc/TemperedSwordPlus";
import { IcyPaws } from "./Diona/IcyPaws";
import { IcyPawsPlus } from "./Diona/IcyPawsPlus";
import { KatzleinStyle } from "./Diona/KatzleinStyle";
import { KatzleinStylePlus } from "./Diona/KatzleinStylePlus";
import { EdelBladework } from "./Eula/EdelBladework";
import { EdelBladeworkPlus } from "./Eula/EdelBladeworkPlus";
import { IcetideVortex } from "./Eula/IcetideVortex";
import { IcetideVortexPlus } from "./Eula/IcetideVortexPlus";
import { BoltsOfDownfall } from "./Fischl/BoltsOfDownfall";
import { BoltsOfDownfallPlus } from "./Fischl/BoltsOfDownfallPlus";
import { Nightrider } from "./Fischl/Nightrider";
import { NightriderPlus } from "./Fischl/NightriderPlus";
import { LiutianArchery } from "./Ganyu/LiutianArchery";
import { LiutianArcheryPlus } from "./Ganyu/LiutianArcheryPlus";
import { TrailOfTheQilin } from "./Ganyu/TrailOfTheQilin";
import { TrailOfTheQilinPlus } from "./Ganyu/TrailOfTheQilinPlus";
import { GuideOfAfterlife } from "./HuTao/GuideOfAfterlife";
import { GuideOfAfterlifePlus } from "./HuTao/GuideOfAfterlifePlus";
import { SpearOfWangsheng } from "./HuTao/SpearOfWangsheng";
import { SpearOfWangsheng as SpearOfWangshengPlus } from "./HuTao/SpearOfWangshengPlus";
import { FavoniusBladework } from "./Jean/FavoniusBladework";
import { FavoniusBladeworkPlus } from "./Jean/FavoniusBladeworkPlus";
import { GaleBlade } from "./Jean/GaleBlade";
import { GaleBladePlus } from "./Jean/GaleBladePlus";
import { CeremonialBladework } from "./Kaeya/CeremonialBladework";
import { CeremonialBladeworkPlus } from "./Kaeya/CeremonialBladeworkPlus";
import { Frostgnaw } from "./Kaeya/Frostgnaw";
import { FrostgnawPlus } from "./Kaeya/FrostgnawPlus";
import { Chihayaburu } from "./Kazuha/Chihayaburu";
import { ChihayaburuPlus } from "./Kazuha/ChihayaburuPlus";
import { GaryuuBladework } from "./Kazuha/GaryuuBladework";
import { GaryuuBladeworkPlus } from "./Kazuha/GaryuuBladeworkPlus";
import { StellarRestoration } from "./KeQuing/StellarRestoration";
import { StellarRestorationPlus } from "./KeQuing/StellarRestorationPlus";
import { YunlaiSwordsmanship } from "./KeQuing/YunlaiSwordsmanship";
import { YunlaiSwordsmanshipPlus } from "./KeQuing/YunlaiSwordsmanshipPlus";
import { JumpyDumpty } from "./Klee/JumpyDumpty";
import { JumpyDumptyPlus } from "./Klee/JumpyDumptyPlus";
import { Kaboom } from "./Klee/Kaboom";
import { KaboomPlus } from "./Klee/KaboomPlus";
import { LightningTouch } from "./Lisa/LightningTouch";
import { LightningTouchPlus } from "./Lisa/LightningTouchPlus";
import { VioletArc } from "./Lisa/VioletArc";
import { VioletArc as VioletArcPlus } from "./Lisa/VioletArcPlus";
import { ForeignIronwind } from "./Lumine/ForeignIronwind";
import { ForeignIronwindPlus } from "./Lumine/ForeignIronwindPlus";
import { PalmVortex } from "./Lumine/PalmVortex";
import { PalmVortexPlus } from "./Lumine/PalmVortexPlus";
import { Burn } from "./misc/Burn";
import { Dash } from "./misc/Dash";
import { Freeze } from "./misc/Freeze";
import { Overheat } from "./misc/Overheat";
import { MirrorReflections } from "./Mona/MirrorReflections";
import { MirrorReflectionsPlus } from "./Mona/MirrorReflectionsPlus";
import { RippleOfFate } from "./Mona/RippleOfFate";
import { RippleOfFatePlus } from "./Mona/RippleOfFatePlus";
import { JadeScreen } from "./NingGuang/JadeScreen";
import { JadeScreenPlus } from "./NingGuang/JadeScreenPlus";
import { SparklingScatter } from "./NingGuang/SparklingScatter";
import { SparklingScatterPlus } from "./NingGuang/SparklingScatterPlus";
import { Breastplate } from "./Noelle/Breastplate";
import { BreastplatePlus } from "./Noelle/BreastplatePlus";
import { MaidsBladework } from "./Noelle/MaidsBladework";
import { MaidsBladeworkPlus } from "./Noelle/MaidsBladeworkPlus";
import { AncientSwordArt } from "./QiQi/AncientSwordArt";
import { AncientSwordArtPlus } from "./QiQi/AncientSwordArtPlus";
import { HeraldOfFrost } from "./QiQi/HeraldOfFrost";
import { HeraldOfFrostPlus } from "./QiQi/HeraldOfFrostPlus";
import { BalefulOmen } from "./Raiden/BalefulOmen";
import { BalefulOmenPlus } from "./Raiden/BalefulOmenPlus";
import { Origin } from "./Raiden/Origin";
import { OriginPlus } from "./Raiden/OriginPlus";
import { ClawAndThunder } from "./Razor/ClawAndThunder";
import { ClawAndThunderPlus } from "./Razor/ClawAndThunderPlus";
import { SteelFang } from "./Razor/SteelFang";
import { SteelFangPlus } from "./Razor/SteelFangPlus";
import { RavagingConfession } from "./Rosaria/RavagingConfession";
import { RavagingConfessionPlus } from "./Rosaria/RavagingConfessionPlus";
import { SpearOfTheChurch } from "./Rosaria/SpearOfTheChurch";
import { SpearOfTheChurchPlus } from "./Rosaria/SpearOfTheChurchPlus";
import { AnemoHypostatis } from "./Sucrose/AnemoHypostatis";
import { AnemoHypostatisPlus } from "./Sucrose/AnemoHypostatisPlus";
import { WindSpiritCreation } from "./Sucrose/WindSpiritCreation";
import { WindSpiritCreationPlus } from "./Sucrose/WindSpiritCreationPlus";
import { CuttingTorrent } from "./Tartaglia/CuttingTorrent";
import { CuttingTorrentPlus } from "./Tartaglia/CuttingTorrentPlus";
import { RagingTide } from "./Tartaglia/RagingTide";
import { RagingTidePlus } from "./Tartaglia/RagingTidePlus";
import { DivineArchery } from "./Venti/DivineArchery";
import { DivineArcheryPlus } from "./Venti/DivineArcheryPlus";
import { SkywardSonnet } from "./Venti/SkywardSonnet";
import { SkywardSonnetPlus } from "./Venti/SkywardSonnetPlus";
import { DoughFu } from "./XiangLing/DoughFu";
import { DoughFuPlus } from "./XiangLing/DoughFuPlus";
import { GuobaFire } from "./XiangLing/GuobaFire";
import { GuobaFirePlus } from "./XiangLing/GuobaFirePlus";
import { LemniscaticWind } from "./Xiao/LemniscaticWind";
import { LemniscaticWindPlus } from "./Xiao/LemniscaticWindPlus";
import { WhirlwindThrust } from "./Xiao/WhirlwindThrust";
import { WhirlwindThrustPlus } from "./Xiao/WhirlwindThrustPlus";
import { FatalRainscreen } from "./XingQiu/FatalRainscreen";
import { FatalRainscreenPlus } from "./XingQiu/FatalRainscreenPlus";
import { GuhuaStyle } from "./XingQiu/GuhuaStyle";
import { GuhuaStylePlus } from "./XingQiu/GuhuaStylePlus";
import { DanceOfFire } from "./Xinyan/DanceOfFire";
import { DanceOfFirePlus } from "./Xinyan/DanceOfFirePlus";
import { SweepingFervor } from "./Xinyan/SweepingFervor";
import { SweepingFervorPlus } from "./Xinyan/SweepingFervorPlus";
import { SealOfApproval } from "./Yanfei/SealOfApproval";
import { SealOfApprovalPlus } from "./Yanfei/SealOfApprovalPlus";
import { SignedEdict } from "./Yanfei/SignedEdict";
import { SignedEdictPlus } from "./Yanfei/SignedEdictPlus";
import { FireworkFlareUp } from "./Yoimiya/FireworkFlareUp";
import { FireworkFlareUpPlus } from "./Yoimiya/FireworkFlareUpPlus";
import { NiwabiFireDance } from "./Yoimiya/NiwabiFireDance";
import { NiwabiFireDancePlus } from "./Yoimiya/NiwabiFireDancePlus";
import { DominusLapidis } from "./ZhongLi/DominusLapidis";
import { DominusLapidis as DominusLapidisPlus } from "./ZhongLi/DominusLapidisPlus";
import { RainOfStone } from "./ZhongLi/RainOfStone";
import { RainOfStone as RainOfStonePlus } from "./ZhongLi/RainOfStonePlus";

const CARD_MAP: Partial<Record<ECard, new () => Card>> = {
  [ECard.ForeignRockblade]: ForeignRockblade,
  [ECard.ForeignRockbladePlus]: ForeignRockbladePlus,
  [ECard.StarfellSword]: StarfellSword,
  [ECard.StarfellSwordPlus]: StarfellSwordPlus,
  [ECard.SolarIsotoma]: SolarIsotoma,
  [ECard.SolarIsotomaPlus]: SolarIsotomaPlus,
  [ECard.WeissBladework]: WeissBladework,
  [ECard.WeissBladeworkPlus]: WeissBladeworkPlus,
  [ECard.ExplosivePuppet]: ExplosivePuppet,
  [ECard.ExplosivePuppetPlus]: ExplosivePuppetPlus,
  [ECard.Sharpshooter]: Sharpshooter,
  [ECard.SharpshooterPlus]: SharpshooterPlus,
  [ECard.LetTheShowBegin]: LetTheShowBegin,
  [ECard.LetTheShowBeginPlus]: LetTheShowBeginPlus,
  [ECard.WhisperOfWater]: WhisperOfWater,
  [ECard.WhisperOfWaterPlus]: WhisperOfWaterPlus,
  [ECard.Oceanborn]: Oceanborn,
  [ECard.OceanbornPlus]: OceanbornPlus,
  [ECard.Tidecaller]: Tidecaller,
  [ECard.TidecallerPlus]: TidecallerPlus,
  [ECard.PassionOverload]: PassionOverload,
  [ECard.PassionOverloadPlus]: PassionOverloadPlus,
  [ECard.StrikeOfFortune]: StrikeOfFortune,
  [ECard.StrikeOfFortunePlus]: StrikeOfFortunePlus,
  [ECard.Demonbane]: Demonbane,
  [ECard.DemonbanePlus]: DemonbanePlus,
  [ECard.LayeredFrost]: LayeredFrost,
  [ECard.LayeredFrostPlus]: LayeredFrostPlus,
  [ECard.SearingOnslaught]: SearingOnslaught,
  [ECard.SearingOnslaughtPlus]: SearingOnslaughtPlus,
  [ECard.TemperedSword]: TemperedSword,
  [ECard.TemperedSwordPlus]: TemperedSwordPlus,
  [ECard.IcyPaws]: IcyPaws,
  [ECard.IcyPawsPlus]: IcyPawsPlus,
  [ECard.KatzleinStyle]: KatzleinStyle,
  [ECard.KatzleinStylePlus]: KatzleinStylePlus,
  [ECard.EdelBladework]: EdelBladework,
  [ECard.EdelBladeworkPlus]: EdelBladeworkPlus,
  [ECard.IcetideVortex]: IcetideVortex,
  [ECard.IcetideVortexPlus]: IcetideVortexPlus,
  [ECard.BoltsOfDownfall]: BoltsOfDownfall,
  [ECard.BoltsOfDownfallPlus]: BoltsOfDownfallPlus,
  [ECard.Nightrider]: Nightrider,
  [ECard.NightriderPlus]: NightriderPlus,
  [ECard.LiutianArchery]: LiutianArchery,
  [ECard.LiutianArcheryPlus]: LiutianArcheryPlus,
  [ECard.TrailOfTheQilin]: TrailOfTheQilin,
  [ECard.TrailOfTheQilinPlus]: TrailOfTheQilinPlus,
  [ECard.GuideOfAfterlife]: GuideOfAfterlife,
  [ECard.GuideOfAfterlifePlus]: GuideOfAfterlifePlus,
  [ECard.SpearOfWangsheng]: SpearOfWangsheng,
  [ECard.SpearOfWangshengPlus]: SpearOfWangshengPlus,
  [ECard.FavoniusBladework]: FavoniusBladework,
  [ECard.FavoniusBladeworkPlus]: FavoniusBladeworkPlus,
  [ECard.GaleBlade]: GaleBlade,
  [ECard.GaleBladePlus]: GaleBladePlus,
  [ECard.CeremonialBladework]: CeremonialBladework,
  [ECard.CeremonialBladeworkPlus]: CeremonialBladeworkPlus,
  [ECard.Frostgnaw]: Frostgnaw,
  [ECard.FrostgnawPlus]: FrostgnawPlus,
  [ECard.Chihayaburu]: Chihayaburu,
  [ECard.ChihayaburuPlus]: ChihayaburuPlus,
  [ECard.GaryuuBladework]: GaryuuBladework,
  [ECard.GaryuuBladeworkPlus]: GaryuuBladeworkPlus,
  [ECard.StellarRestoration]: StellarRestoration,
  [ECard.StellarRestorationPlus]: StellarRestorationPlus,
  [ECard.YunlaiSwordsmanship]: YunlaiSwordsmanship,
  [ECard.YunlaiSwordsmanshipPlus]: YunlaiSwordsmanshipPlus,
  [ECard.JumpyDumpty]: JumpyDumpty,
  [ECard.JumpyDumptyPlus]: JumpyDumptyPlus,
  [ECard.Kaboom]: Kaboom,
  [ECard.KaboomPlus]: KaboomPlus,
  [ECard.LightningTouch]: LightningTouch,
  [ECard.LightningTouchPlus]: LightningTouchPlus,
  [ECard.VioletArc]: VioletArc,
  [ECard.VioletArcPlus]: VioletArcPlus,
  [ECard.ForeignIronwind]: ForeignIronwind,
  [ECard.ForeignIronwindPlus]: ForeignIronwindPlus,
  [ECard.PalmVortex]: PalmVortex,
  [ECard.PalmVortexPlus]: PalmVortexPlus,
  [ECard.Burn]: Burn,
  [ECard.Dash]: Dash,
  [ECard.Freeze]: Freeze,
  [ECard.Overheat]: Overheat,
  [ECard.MirrorReflections]: MirrorReflections,
  [ECard.MirrorReflectionsPlus]: MirrorReflectionsPlus,
  [ECard.RippleOfFate]: RippleOfFate,
  [ECard.RippleOfFatePlus]: RippleOfFatePlus,
  [ECard.JadeScreen]: JadeScreen,
  [ECard.JadeScreenPlus]: JadeScreenPlus,
  [ECard.SparklingScatter]: SparklingScatter,
  [ECard.SparklingScatterPlus]: SparklingScatterPlus,
  [ECard.Breastplate]: Breastplate,
  [ECard.BreastplatePlus]: BreastplatePlus,
  [ECard.MaidsBladework]: MaidsBladework,
  [ECard.MaidsBladeworkPlus]: MaidsBladeworkPlus,
  [ECard.AncientSwordArt]: AncientSwordArt,
  [ECard.AncientSwordArtPlus]: AncientSwordArtPlus,
  [ECard.HeraldOfFrost]: HeraldOfFrost,
  [ECard.HeraldOfFrostPlus]: HeraldOfFrostPlus,
  [ECard.BalefulOmen]: BalefulOmen,
  [ECard.BalefulOmenPlus]: BalefulOmenPlus,
  [ECard.Origin]: Origin,
  [ECard.OriginPlus]: OriginPlus,
  [ECard.ClawAndThunder]: ClawAndThunder,
  [ECard.ClawAndThunderPlus]: ClawAndThunderPlus,
  [ECard.SteelFang]: SteelFang,
  [ECard.SteelFangPlus]: SteelFangPlus,
  [ECard.RavagingConfession]: RavagingConfession,
  [ECard.RavagingConfessionPlus]: RavagingConfessionPlus,
  [ECard.SpearOfTheChurch]: SpearOfTheChurch,
  [ECard.SpearOfTheChurchPlus]: SpearOfTheChurchPlus,
  [ECard.AnemoHypostatis]: AnemoHypostatis,
  [ECard.AnemoHypostatisPlus]: AnemoHypostatisPlus,
  [ECard.WindSpiritCreation]: WindSpiritCreation,
  [ECard.WindSpiritCreationPlus]: WindSpiritCreationPlus,
  [ECard.CuttingTorrent]: CuttingTorrent,
  [ECard.CuttingTorrentPlus]: CuttingTorrentPlus,
  [ECard.RagingTide]: RagingTide,
  [ECard.RagingTidePlus]: RagingTidePlus,
  [ECard.DivineArchery]: DivineArchery,
  [ECard.DivineArcheryPlus]: DivineArcheryPlus,
  [ECard.SkywardSonnet]: SkywardSonnet,
  [ECard.SkywardSonnetPlus]: SkywardSonnetPlus,
  [ECard.DoughFu]: DoughFu,
  [ECard.DoughFuPlus]: DoughFuPlus,
  [ECard.GuobaFire]: GuobaFire,
  [ECard.GuobaFirePlus]: GuobaFirePlus,
  [ECard.LemniscaticWind]: LemniscaticWind,
  [ECard.LemniscaticWindPlus]: LemniscaticWindPlus,
  [ECard.WhirlwindThrust]: WhirlwindThrust,
  [ECard.WhirlwindThrustPlus]: WhirlwindThrustPlus,
  [ECard.FatalRainscreen]: FatalRainscreen,
  [ECard.FatalRainscreenPlus]: FatalRainscreenPlus,
  [ECard.GuhuaStyle]: GuhuaStyle,
  [ECard.GuhuaStylePlus]: GuhuaStylePlus,
  [ECard.DanceOfFire]: DanceOfFire,
  [ECard.DanceOfFirePlus]: DanceOfFirePlus,
  [ECard.SweepingFervor]: SweepingFervor,
  [ECard.SweepingFervorPlus]: SweepingFervorPlus,
  [ECard.SealOfApproval]: SealOfApproval,
  [ECard.SealOfApprovalPlus]: SealOfApprovalPlus,
  [ECard.SignedEdict]: SignedEdict,
  [ECard.SignedEdictPlus]: SignedEdictPlus,
  [ECard.FireworkFlareUp]: FireworkFlareUp,
  [ECard.FireworkFlareUpPlus]: FireworkFlareUpPlus,
  [ECard.NiwabiFireDance]: NiwabiFireDance,
  [ECard.NiwabiFireDancePlus]: NiwabiFireDancePlus,
  [ECard.DominusLapidis]: DominusLapidis,
  [ECard.DominusLapidisPlus]: DominusLapidisPlus,
  [ECard.RainOfStone]: RainOfStone,
  [ECard.RainOfStonePlus]: RainOfStonePlus,
};

export function createCardFromEnum(name: ECard): Card | null {
  const Ctor = CARD_MAP[name];
  return Ctor ? new Ctor() : null;
}
