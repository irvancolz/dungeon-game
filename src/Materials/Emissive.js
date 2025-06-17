import * as THREE from "three";
import fragmentShader from "../Shaders/emissiveFragment.glsl";

export default function EmissiveMaterial(
  color = "#ff0000",
  intensity = 1,
  debug,
  name
) {
  const debugOpt = {
    color,
  };

  const uniforms = {
    uColor: new THREE.Uniform(new THREE.Color(color)),
    uIntensity: new THREE.Uniform(intensity),
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    fragmentShader,
  });

  if (debug.active) {
    const f = debug.ui.addFolder({ title: name, expanded: false });
    f.addBinding(debugOpt, "color").on("change", () => {
      material.uniforms.uColor.value.set(debugOpt.color);
    });
    f.addBinding(material.uniforms.uIntensity, "value", {
      min: 0,
      max: 1,
      step: 0.001,
      label: "intensity",
    });
  }
  return material;
}
