class RefferenceProvider {
  constructor(src = []) {
    this.source = src;
  }

  getRefferences(name) {
    return this.source
      .filter((i) => {
        return i.name.startsWith(name);
      })
      .map((el) => ({
        name: el.name,
        position: el.position,
        rotation: el.rotation,
        quaternion: el.quaternion,
        scale: el.scale,
      }));
  }

  setSource(src = []) {
    this.source = src;
  }
}

export default RefferenceProvider;
