let instance = null;
class MarkersManager {
  constructor() {
    if (instance != null) return instance;

    instance = this;
    this.markers = [];
  }

  seed(s = []) {
    this.markers = s;
  }

  add(marker) {
    this.markers.push(marker);
    marker.on("dispose", () => {
      const idx = this.markers.indexOf(marker);
      this.markers.splice(idx, 1);
    });
  }

  update(playerPos) {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].update(playerPos);
    }
  }
}

export default MarkersManager;
