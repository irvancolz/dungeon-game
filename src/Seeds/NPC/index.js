import captainrorik from "./Captain_Rorik.json";
import elandor from "./Elandor.json";
import mirastoneshield from "./Mira_Stoneshield.json";
import seren from "./Seren.json";
import thornunderfoot from "./Thorn_Underfoot.json";

class NPCInformation {
  static npc_list = {
    captain_rorik: captainrorik,
    elandor: elandor,
    mirastoneshield: mirastoneshield,
    seren: seren,
    thorn_thunderfoot: thornunderfoot,
  };

  static getDetail(name = "") {
    return NPCInformation.npc_list[name.toLowerCase()];
  }
}

export default NPCInformation;
