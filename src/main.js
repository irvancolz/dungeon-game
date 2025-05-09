import Experience from "./Experience";
import "./style.css";

window.addEventListener("keydown", (e) => {
  if (e.code == "KeyF") {
    document.body.requestFullscreen();
  }
});

const canvas = document.getElementById("canvas");

const experience = new Experience(canvas);

window.experience = experience;
