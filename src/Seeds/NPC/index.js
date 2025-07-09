import capraionrorik from "./Captain_Rorik.json";
import elandor from "./Elandor.json";
import mirastoneshield from "./Mira_Stoneshield.json";
import seren from "./Seren.json";
import thornunderfoot from "./Thorn_Underfoot.json";

class NPCInformation {
  static npc_list = {
    captain_rorik: capraionrorik,
    elandor: elandor,
    mira_stoneshield: mirastoneshield,
    seren: seren,
    thorn_thunderfoot: thornunderfoot,
  };

  static getDetail(name = "") {
    return NPCInformation.npc_list[name.toLowerCase()];
  }
}

export default NPCInformation;
