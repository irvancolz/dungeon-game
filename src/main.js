import Experience from "./Experience";
import "./index.scss";

const canvas = document.getElementById("canvas");

const experience = new Experience(canvas);

window.experience = experience;
