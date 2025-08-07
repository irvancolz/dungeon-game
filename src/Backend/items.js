import data from "../Seeds/Items/database";
import BackpackItem from "../Interface/BackpackItem/BackpackItem";
import DropItem from "../World/DropItem";

function toBackpackItem(name, count, model) {
  const data = get(name);
  return new BackpackItem({
    name: data.name,
    img: data.img,
    description: data.description,
    count: count,
    id: data.id,
    model: model ?? data.model,
  });
}

function toDropsItem(name, count, position) {
  const data = get(name);

  return new DropItem({
    id: data.id,
    count: count,
    name: data.name,
    position: position,
  });
}

function get(name) {
  const res = data.find((e) => e.name == name);
  if (res) return res;
  console.error("data not found, id :", name);
}

export const itemsUtils = {
  get,
  toBackpackItem,
  toDropsItem,
};
