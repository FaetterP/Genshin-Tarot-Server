import { EPlayerEffect } from "../../types/enums";
import { PlayerEffect } from "./PlayerEffect";
import { BreastplateEffect } from "./BreastplateEffect";
import { DominusLapidisEffect } from "./DominusLapidisEffect";
import { ExplosivePuppetEffect } from "./ExplosivePuppetEffect";
import { GlacialIlluminationEffect } from "./GlacialIlluminationEffect";
import { GuideOfAfterlifeEffect } from "./GuideOfAfterlifeEffect";
import { GuobaFireEffect } from "./GuobaFireEffect";
import { LayeredFrostEffect } from "./LayeredFrostEffect";
import { LetTheShowBeginPlusEffect } from "./LetTheShowBeginPlusEffect";
import { MirrorReflectionsEffect } from "./MirrorReflectionsEffect";
import { NiwabiFireDanceEffect } from "./NiwabiFireDanceEffect";
import { OverheatEffect } from "./OverheatEffect";
import { PyronadoEffect } from "./PyronadoEffect";
import { RaincutterEffect } from "./RaincutterEffect";
import { SkywardSonnetEffect } from "./SkywardSonnetEffect";
import { SkywardSonnetPlusEffect } from "./SkywardSonnetPlusEffect";
import { SolarIsotomaEffect } from "./SolarIsotomaEffect";
import { StormbreakerEffect } from "./StormbreakerEffect";
import { TrailOfTheQilinEffect } from "./TrailOfTheQilinEffect";

export function createPlayerEffectFromEnum(effect: EPlayerEffect): PlayerEffect | null {
  switch (effect) {
    case EPlayerEffect.Breastplate: return new BreastplateEffect();
    case EPlayerEffect.DominusLapidis: return new DominusLapidisEffect();
    case EPlayerEffect.ExplosivePuppet: return new ExplosivePuppetEffect();
    case EPlayerEffect.GlacialIllumination: return new GlacialIlluminationEffect();
    case EPlayerEffect.GuideOfAfterlife: return new GuideOfAfterlifeEffect();
    case EPlayerEffect.GuobaFire: return new GuobaFireEffect();
    case EPlayerEffect.LayeredFrost: return new LayeredFrostEffect();
    case EPlayerEffect.LetTheShowBeginPlus: return new LetTheShowBeginPlusEffect();
    case EPlayerEffect.MirrorReflections: return new MirrorReflectionsEffect();
    case EPlayerEffect.NiwabiFireDance: return new NiwabiFireDanceEffect();
    case EPlayerEffect.Overheat: return new OverheatEffect();
    case EPlayerEffect.Pyronado: return new PyronadoEffect();
    case EPlayerEffect.Raincutter: return new RaincutterEffect();
    case EPlayerEffect.SkywardSonnet: return new SkywardSonnetEffect();
    case EPlayerEffect.SkywardSonnetPlus: return new SkywardSonnetPlusEffect();
    case EPlayerEffect.SolarIsotoma: return new SolarIsotomaEffect();
    case EPlayerEffect.Stormbreaker: return new StormbreakerEffect();
    case EPlayerEffect.TrailOfTheQilin: return new TrailOfTheQilinEffect();
    default: return null;
  }
}
