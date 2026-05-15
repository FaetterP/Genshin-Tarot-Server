import { EEnemy } from "../../types/enums";
import { Enemy } from "./Enemy";
import { AnemoHypostasis } from "./elite/AnemoHypostasis";
import { BlazingAxeMitachurl } from "./elite/BlazingAxeMitachurl";
import { CicinCryoMage } from "./elite/CicinCryoMage";
import { CicinElectroMage } from "./elite/CicinElectroMage";
import { CryoRegisvine } from "./elite/CryoRegisvine";
import { ElectroHypostasis } from "./elite/ElectroHypostasis";
import { EyeOfStorm } from "./elite/EyeOfStorm";
import { FrostarmLawachurl } from "./elite/FrostarmLawachurl";
import { GeoHypostasis } from "./elite/GeoHypostasis";
import { PyroAgent } from "./elite/PyroAgent";
import { PyroRegisvine } from "./elite/PyroRegisvine";
import { RuinGrader } from "./elite/RuinGrader";
import { RuinGuard } from "./elite/RuinGuard";
import { RuinHunter } from "./elite/RuinHunter";
import { ShieldBearerMitachurl } from "./elite/ShieldBearerMitachurl";
import { StonehideLawachurl } from "./elite/StonehideLawachurl";
import { AnemoBoxer } from "./normal/AnemoBoxer";
import { AnemoShamachurl } from "./normal/AnemoShamachurl";
import { CryoAbyssMage } from "./normal/CryoAbyssMage";
import { CryoCicinSwarm } from "./normal/CryoCicinSwarm";
import { CryoGunner } from "./normal/CryoGunner";
import { CryoHilichurlShooter } from "./normal/CryoHilichurlShooter";
import { CryoWhopperflower } from "./normal/CryoWhopperflower";
import { DendroShamachurl } from "./normal/DendroShamachurl";
import { ElectroCicinSwarm } from "./normal/ElectroCicinSwarm";
import { ElectroHammer } from "./normal/ElectroHammer";
import { ElectroHilichurlShooter } from "./normal/ElectroHilichurlShooter";
import { GeoChanter } from "./normal/GeoChanter";
import { GeoShamachurl } from "./normal/GeoShamachurl";
import { GiantAnemoSlime } from "./normal/GiantAnemoSlime";
import { GiantCryoSlime } from "./normal/GiantCryoSlime";
import { GiantDendroSlime } from "./normal/GiantDendroSlime";
import { GiantElectroSlime } from "./normal/GiantElectroSlime";
import { GiantGeoSlime } from "./normal/GiantGeoSlime";
import { GiantHydroSlime } from "./normal/GiantHydroSlime";
import { GiantPyroSlime } from "./normal/GiantPyroSlime";
import { HilichurlBerserk } from "./normal/HilichurlBerserk";
import { HilichurlGang } from "./normal/HilichurlGang";
import { HilichurlGrenadier } from "./normal/HilichurlGrenadier";
import { HilichurlGuard } from "./normal/HilichurlGuard";
import { HydroAbyssMage } from "./normal/HydroAbyssMage";
import { HydroGunner } from "./normal/HydroGunner";
import { PyroAbyssMage } from "./normal/PyroAbyssMage";
import { PyroHilichurlShooter } from "./normal/PyroHilichurlShooter";
import { PyroSlinger } from "./normal/PyroSlinger";
import { PyroWhopperflower } from "./normal/PyroWhopperflower";
import { SmallAnemoSlime } from "./normal/SmallAnemoSlime";
import { SmallCryoSlime } from "./normal/SmallCryoSlime";
import { SmallDendroSlime } from "./normal/SmallDendroSlime";
import { SmallElectroSlime } from "./normal/SmallElectroSlime";
import { SmallGeoSlime } from "./normal/SmallGeoSlime";
import { SmallHydroSlime } from "./normal/SmallHydroSlime";
import { SmallPyroSlime } from "./normal/SmallPyroSlime";
import { TreasureHoarderGang } from "./normal/TreasureHoarderGang";
import { UnusualHilichurl } from "./normal/UnusualHilichurl";
import { VishapHatchling } from "./normal/VishapHatchling";

const ENEMY_MAP: Partial<Record<EEnemy, new () => Enemy>> = {
  [EEnemy.AnemoHypostasis]: AnemoHypostasis,
  [EEnemy.BlazingAxeMitachurl]: BlazingAxeMitachurl,
  [EEnemy.CicinCryoMage]: CicinCryoMage,
  [EEnemy.CicinElectroMage]: CicinElectroMage,
  [EEnemy.CryoRegisvine]: CryoRegisvine,
  [EEnemy.ElectroHypostasis]: ElectroHypostasis,
  [EEnemy.EyeOfStorm]: EyeOfStorm,
  [EEnemy.FrostarmLawachurl]: FrostarmLawachurl,
  [EEnemy.GeoHypostasis]: GeoHypostasis,
  [EEnemy.PyroAgent]: PyroAgent,
  [EEnemy.PyroRegisvine]: PyroRegisvine,
  [EEnemy.RuinGrader]: RuinGrader,
  [EEnemy.RuinGuard]: RuinGuard,
  [EEnemy.RuinHunter]: RuinHunter,
  [EEnemy.ShieldBearerMitachurl]: ShieldBearerMitachurl,
  [EEnemy.StonehideLawachurl]: StonehideLawachurl,
  [EEnemy.AnemoBoxer]: AnemoBoxer,
  [EEnemy.AnemoShamachurl]: AnemoShamachurl,
  [EEnemy.CryoAbyssMage]: CryoAbyssMage,
  [EEnemy.CryoCicinSwarm]: CryoCicinSwarm,
  [EEnemy.CryoGunner]: CryoGunner,
  [EEnemy.CryoHilichurlShooter]: CryoHilichurlShooter,
  [EEnemy.CryoWhopperflower]: CryoWhopperflower,
  [EEnemy.DendroShamachurl]: DendroShamachurl,
  [EEnemy.ElectroCicinSwarm]: ElectroCicinSwarm,
  [EEnemy.ElectroHammer]: ElectroHammer,
  [EEnemy.ElectroHilichurlShooter]: ElectroHilichurlShooter,
  [EEnemy.GeoChanter]: GeoChanter,
  [EEnemy.GeoShamachurl]: GeoShamachurl,
  [EEnemy.GiantAnemoSlime]: GiantAnemoSlime,
  [EEnemy.GiantCryoSlime]: GiantCryoSlime,
  [EEnemy.GiantDendroSlime]: GiantDendroSlime,
  [EEnemy.GiantElectroSlime]: GiantElectroSlime,
  [EEnemy.GiantGeoSlime]: GiantGeoSlime,
  [EEnemy.GiantHydroSlime]: GiantHydroSlime,
  [EEnemy.GiantPyroSlime]: GiantPyroSlime,
  [EEnemy.HilichurlBerserk]: HilichurlBerserk,
  [EEnemy.HilichurlGang]: HilichurlGang,
  [EEnemy.HilichurlGrenadier]: HilichurlGrenadier,
  [EEnemy.HilichurlGuard]: HilichurlGuard,
  [EEnemy.HydroAbyssMage]: HydroAbyssMage,
  [EEnemy.HydroGunner]: HydroGunner,
  [EEnemy.PyroAbyssMage]: PyroAbyssMage,
  [EEnemy.PyroHilichurlShooter]: PyroHilichurlShooter,
  [EEnemy.PyroSlinger]: PyroSlinger,
  [EEnemy.PyroWhopperflower]: PyroWhopperflower,
  [EEnemy.SmallAnemoSlime]: SmallAnemoSlime,
  [EEnemy.SmallCryoSlime]: SmallCryoSlime,
  [EEnemy.SmallDendroSlime]: SmallDendroSlime,
  [EEnemy.SmallElectroSlime]: SmallElectroSlime,
  [EEnemy.SmallGeoSlime]: SmallGeoSlime,
  [EEnemy.SmallHydroSlime]: SmallHydroSlime,
  [EEnemy.SmallPyroSlime]: SmallPyroSlime,
  [EEnemy.TreasureHoarderGang]: TreasureHoarderGang,
  [EEnemy.UnusualHilichurl]: UnusualHilichurl,
  [EEnemy.VishapHatchling]: VishapHatchling,
};

export function createEnemyFromEnum(name: EEnemy): Enemy | null {
  const Ctor = ENEMY_MAP[name];
  return Ctor ? new Ctor() : null;
}
