import data from "../Seeds/backpack.json";
import BackpackItem from "../Interface/BackpackItem/BackpackItem";
import DropItem from "../Utils/DropItem";

function toBackpackItem(name, count) {
  const data = get(name);
  return new BackpackItem({
    name: data.name,
    img: data.img,
    description: data.description,
    count: count,
    id: data.id,
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
