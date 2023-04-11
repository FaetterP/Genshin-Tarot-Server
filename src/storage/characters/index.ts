import { Aether } from "./Aether";
import { Albedo } from "./Albedo";
import { Amber } from "./Amber";
import { Barbara } from "./Barbara";
import { Beidou } from "./Beidou";
import { Bennett } from "./Bennett";
import { ChongYun } from "./ChongYun";
import { Diluc } from "./Diluc";
import { Diona } from "./Diona";
import { Eula } from "./Eula";
import { Fischl } from "./Fischl";
import { Ganyu } from "./Ganyu";
import { HuTao } from "./HuTao";
import { Jean } from "./Jean";
import { Kaeya } from "./Kaeya";
import { Kazuha } from "./Kazuha";
import { KeQing } from "./KeQing";
import { Klee } from "./Klee";
import { Lisa } from "./Lisa";
import { Lumine } from "./Lumine";
import { Mona } from "./Mona";
import { NingGuang } from "./NingGuang";
import { Noelle } from "./Noelle";
import { QiQi } from "./QiQi";
import { Raiden } from "./Raiden";
import { Razor } from "./Razor";
import { Rosaria } from "./Rosaria";
import { Sucrose } from "./Sucrose";
import { Tartaglia } from "./Tartaglia";
import { Venti } from "./Venti";
import { XiangLing } from "./XiangLing";
import { Xiao } from "./Xiao";
import { XingQiu } from "./XingQiu";
import { Xinyan } from "./Xinyan";
import { Yanfei } from "./Yanfei";
import { Yoimiya } from "./Yoimiya";
import { ZhongLi } from "./ZhongLi";

const characters = [
  Aether,
  Albedo,
  Amber,
  Barbara,
  Beidou,
  Bennett,
  ChongYun,
  Diluc,
  Diona,
  Eula,
  Fischl,
  Ganyu,
  HuTao,
  Jean,
  Kaeya,
  Kazuha,
  KeQing,
  Klee,
  Lisa,
  Lumine,
  Mona,
  NingGuang,
  Noelle,
  QiQi,
  Raiden,
  Razor,
  Rosaria,
  Sucrose,
  Tartaglia,
  Venti,
  XiangLing,
  Xiao,
  XingQiu,
  Xinyan,
  Yanfei,
  Yoimiya,
  ZhongLi,
];

export function getCharacterByName(name: string) {
  const foundCharacter = characters.find((item) => item.name === name);
  return foundCharacter;
}
