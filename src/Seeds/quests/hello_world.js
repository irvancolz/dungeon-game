import Backpack from "../../Interface/Backpack/Backpack";
import Quest from "../../Interface/Quest/Quest";
import NPCManager from "../../World/NPCManager";
import PlayerEvent from "../../World/PlayerEvent";
import ItemReceiver from "../../Interface/ItemReceiver/ItemReceiver";
import ItemDetail from "../../Interface/ItemDetail/ItemDetail";

const npcManager = new NPCManager();
const backpack = new Backpack();
const itemReceiver = new ItemReceiver();
const itemDetail = new ItemDetail();

const detail = {
  title: "Welcome to Eldermere",
  description:
    "Introduce yourself to the townsfolk and lend a hand where needed.",
  status: Quest.STATUS_IN_PROGRESS,
  onComplete: () => console.log("quest finished"),
  objectives: [
    {
      type: PlayerEvent.EVENT_TALK,
      onComplete: () => {},
      value: {
        id: "npc001",
        name: "Elandor the Wise",
        chat: [
          { author: "Player", chat: "Hello, are you Elandor?" },
          {
            author: "Elandor",
            chat: "Indeed I am. Welcome, traveler. Might you bring me a Red Apple for my potion?",
          },
        ],
      },
    },
    {
      type: PlayerEvent.EVENT_COLLECT,
      value: {
        id: "item003",
        name: "Apples",
        count: 1,
      },
    },
    {
      type: PlayerEvent.EVENT_GIVE,
      value: [
        {
          id: "item003",
          name: "Apples",
          count: 1,
          receiver: "elandor",
        },
      ],
      onStart: () => {
        const npc = npcManager.find("Elandor the Wise");
        npc.setMarker();
        npc.setConversation([
          {
            author: "Elandor",
            chat: "Do you get the Apples?",
          },
        ]);
        npc.conversation.on("chat:start", () => {
          itemReceiver.setRequirements([
            {
              id: "item003",
              name: "Apples",
              count: 1,
            },
          ]);
          backpack.setSecondaryInterface(itemReceiver);
          setTimeout(() => {
            backpack.open();
          }, 1000);
        });
      },
      onComplete: () => {
        backpack.setSecondaryInterface(itemDetail);
        backpack.close();

        const npc = npcManager.find("Elandor the Wise");
        npc.disable();
        npc.setConversation([
          {
            author: "Elandor",
            chat: "Thankyou. here take this as gift, you can visit mia next",
          },
        ]);
        npc.talk();

        // give potion
        backpack.insert({ name: "Potion of Minor Healing" }, 2);
      },
    },
    {
      type: PlayerEvent.EVENT_TALK,
      onComplete: () => {
        backpack.insert({ name: "Dagger of the Silent Step" }, 1);
      },
      value: {
        id: "npc002",
        name: "Mira Stoneshield",
        chat: [
          { author: "Player", chat: "Hi, Elandor sent me to meet you." },
          {
            author: "Mira",
            chat: "Ha! Did the old man send you to babysit me? Take this rusty sword to Rorik and show him what passes for a weapon these days.",
          },
        ],
      },
    },
    {
      type: PlayerEvent.EVENT_GIVE,
      value: [
        {
          id: "item006",
          name: "Dagger of the Silent Step",
          count: 1,
          receiver: "captain rorik",
        },
      ],
      onStart: () => {
        const captRorik = npcManager.find("Captain Rorik");
        captRorik.setConversation([
          {
            author: "Player",
            chat: "Captain Rorik? Mira asked me to show you this sword.",
          },
        ]);
        captRorik.setMarker();

        captRorik.conversation.on("chat:start", () => {
          itemReceiver.setRequirements([
            {
              id: "item006",
              name: "Dagger of the Silent Step",
              count: 1,
            },
          ]);
          backpack.setSecondaryInterface(itemReceiver);
          setTimeout(() => {
            backpack.open();
          }, 1500);
        });
      },
      onComplete: () => {
        backpack.setSecondaryInterface(itemDetail);
        backpack.close();

        const npc = npcManager.find("Captain Rorik");
        npc.disable();
        npc.setConversation([
          {
            author: "Rorik",
            chat: "That scrap? Hah! At least Mira still has a sense of humor. You should visit Seren next, she’ll teach you something useful.",
          },
        ]);
        npc.talk();
      },
    },
    {
      type: PlayerEvent.EVENT_TALK,
      value: {
        id: "npc003",
        name: "Seren of the Glade",
        chat: [
          { author: "Player", chat: "Captain Rorik told me to find you." },
          {
            author: "Seren",
            chat: "Then listen well. The forest speaks—go and gather two Forest Herbs. We will see if you hear it too.",
          },
        ],
      },
    },
    {
      type: PlayerEvent.EVENT_COLLECT,
      value: {
        id: "item004",
        name: "Forest Herb",
        count: 2,
      },
    },
    {
      type: PlayerEvent.EVENT_TALK,
      value: {
        id: "npc004",
        name: "Thorn Underfoot",
        chat: [
          { author: "Player", chat: "Seren sent me to you." },
          {
            author: "Thorn",
            chat: "Ah, new faces and empty pockets! My favorite combination. Welcome to Eldermere, friend.",
          },
        ],
      },
    },
  ],
};

export default new Quest(detail);
