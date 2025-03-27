import Experience from "./Experience";
import "./style.css";

const canvas = document.getElementById("canvas");

const experience = new Experience(canvas);

window.experience = experience;
