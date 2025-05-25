import data from "../Seeds/backpack.json";
import BackpackItem from "../Interface/BackpackItem/BackpackItem";
import DropItem from "../Utils/DropItem";

function getAll() {}

function toBackpackItem(id, count) {
  const data = get(id);
  return new BackpackItem({
    name: data.name,
    img: data.img,
    description: data.description,
    count: count,
    id: data.id,
  });
}

function toDropsItem(id, count, position) {
  const data = get(id);

  return new DropItem({
    id: data.id,
    count: count,
    name: data.name,
    position: position,
  });
}

function get(id) {
  const res = data.find((e) => e.id == id);
  if (res) return res;
  console.error("data not found, id :", id);
}

export const items = {
  get,
  toBackpackItem,
  toDropsItem,
};
