import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


/*
  Fade Up Animation

  使用例:
  class="js-fade-up"
*/

export function fadeUp(targets) {

  gsap.from(targets, {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    stagger: 0.15,
    scrollTrigger: {
      trigger: targets,
      start: "top 80%",
      once: true
    }
  });

}


/*
  Fade In

*/

export function fadeIn(targets) {

  gsap.from(targets, {
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: targets,
      start: "top 80%",
      once: true
    }
  });

}
