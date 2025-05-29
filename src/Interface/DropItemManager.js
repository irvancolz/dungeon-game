import * as THREE from "three";
import DropItem from "../Utils/DropItem";
import vertexShader from "../Shaders/drops/vertex.glsl";
import fragmentShader from "../Shaders/drops/fragment.glsl";
import { items } from "../Backend/items";

/**
 *  I could use some of these alternatives :
 *    - Sprite : still dont understand about shader modification, and which part to change
 *    - not instancing : idk about the performace, maybe try next time
 *    - instanced mesh : how can i create billboarding effect with same attribute?. maybe try instancedBufferAttribute
 *    - particles : i dont think its good for this scenario.
 */
let instance = null;
class DropItemManager {
  #MAX_COUNT = 1000;
  constructor() {
    if (instance != null) return instance;

    instance = this;

    this.items = [];
    this.position = [];
  }

  setScene(scene) {
    this.scene = scene;
  }

  setTexture(texture) {
    this.texture = texture;
    if (this.material) {
      this.material.uniforms.uAlphaTexture.value = texture;
    }
  }

  initItems(s) {
    for (let i = 0; i < s.length; i++) {
      const seed = s[i];
      const item = new DropItem({
        id: seed.id,
        name: seed.name,
        count: seed.count,
        position: seed.position,
      });

      this.add(item);
    }
  }

  initGeometry() {
    const positionArray = [];
    const uvArray = [];
    const size = 1;
    //bl
    positionArray.push(-1 * size, -1 * size, 0);
    uvArray.push(0, 0);
    //tr
    positionArray.push(1 * size, 1 * size, 0);
    uvArray.push(1, 1);
    //br
    positionArray.push(1 * size, -1 * size, 0);
    uvArray.push(1, 0);
    //tl
    positionArray.push(-1 * size, 1 * size, 0);
    uvArray.push(0, 1);

    const indices = [0, 1, 2, 1, 0, 3];

    this.geometry = new THREE.InstancedBufferGeometry();
    this.geometry.setIndex(indices);
    this.geometry.instanceCount = this.#MAX_COUNT;
    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(positionArray), 3)
    );
    this.geometry.setAttribute(
      "uv",
      new THREE.BufferAttribute(new Float32Array(uvArray), 2)
    );
    this.geometry.translate(0, size, 0);
  }

  initMaterial() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uAlphaTexture: new THREE.Uniform(this.texture),
      },
      vertexShader: vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }

  initMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  updateInstances() {
    const positionArray = [];
    this.geometry.instanceCount = this.position.length;
    for (let i = 0; i < this.position.length; i++) {
      const arr = this.position[i].toArray();
      positionArray.push(...arr);
    }

    this.geometry.setAttribute(
      "aCenter",
      new THREE.InstancedBufferAttribute(new Float32Array(positionArray), 3)
    );
  }

  init(seed = []) {
    this.initGeometry();
    this.initMaterial();
    this.initMesh();
    this.initItems(seed);
    this.updateInstances();
    this.scene.add(this.mesh);
  }

  update(player) {
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].update(player);
    }
  }

  add(i) {
    if (!i instanceof DropItem) {
      console.error("canceled : trying to insert non dropItem into manager");
      return;
    }

    const item = items.toDropsItem(i.id, i.count, i.position);
    this.items.push(item);
    this.position.push(item.position);

    item.on("taken", () => {
      const idx = this.items.indexOf(item);
      this.items.splice(idx, 1);
      this.position.splice(idx, 1);
      this.updateInstances();
    });
    this.updateInstances();
  }
}

export default DropItemManager;
