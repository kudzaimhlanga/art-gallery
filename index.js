document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(Observer);


  //can you detect these changes

  function loadExperience() {
    //store art links and populatte floating images
    const artLinksNodes = document.querySelectorAll("[data-art='item']");
    let artLinks = Array.prototype.slice.call(artLinksNodes);

    const floatingNodes = document.querySelectorAll("[data-art='image']");
    let floatingImages = Array.prototype.slice.call(floatingNodes);

    //even out images and links
    let spliceArray = (diff, arr) => {
      for (let i = 0; i < diff; i++) {
        let randomIndex = Math.floor(Math.random() * arr.length);
        arr.splice(randomIndex, 1);
      }
    };

    if (floatingImages.length > artLinks.length) {
      let diff = floatingImages.length - artLinks.length;
      spliceArray(diff, floatingImages);
    } else {
      let diff = artLinks.length - floatingImages.length;
      spliceArray(diff, artLinks);
    }

    // populatate images
    let imageTrack = document.querySelector("[data-art='track']");

    for (let i = 0; i < floatingImages.length; i++) {
      const newDiv = document.createElement("div");
      newDiv.classList.add("art-image");
      newDiv.innerHTML = artLinks[i].querySelector(
        '[data-art="main-image"]'
      ).innerHTML;

      imageTrack.appendChild(newDiv);

      const newImage = document.createElement("div");
      newImage.classList.add("fill-container");
      newImage.innerHTML =
        artLinks[i].querySelector("[data-art='link']").outerHTML;
      floatingImages[i].appendChild(newImage);
    }

    //gsap observer

    let animating = null;

    const scrollUp = () => {
      if (animating) return;
      floatingImages.forEach((index) => {
        if (index.classList.contains("active-image")) {
          const currIdx = floatingImages.indexOf(index);
          const prevIdx = currIdx - 1;

          if (prevIdx >= 0) {
            animateTrack(floatingImages[prevIdx]);
            console.log(prevIdx);
          } else {
            animateTrack(floatingImages[floatingImages.length - 1]);
            console.log("restart");
          }
        }
      });
    };

    const scrollDown = () => {
      if (animating) return;
      floatingImages.forEach((index) => {
        if (index.classList.contains("active-image")) {
          const currIdx = floatingImages.indexOf(index);
          const nextIdx = currIdx + 1;

          if (nextIdx < floatingImages.length) {
            console.log("valid", currIdx, nextIdx);
            animateTrack(floatingImages[nextIdx]);
          }
        }
      });
    };

    Observer.create({
      target: window,
      type: "wheel",
      onDown: () => {
        scrollDown();
      },
      onUp: () => {
        scrollUp();
      },
      tolerance: 20,
      wheelSpeed: 0.5,
      scrollSpeed: 0.5,
    });

    //make active
    const makeActive = (el) => {
      floatingImages.forEach((index) => {
        index.classList.remove("active-image");
        index.querySelector("img").removeAttribute("data-art");
      });

      el.classList.add("active-image");
      el.querySelector("img").setAttribute("data-art", "active");
    };

    //page load animation
    const pageLoad = () => {};

    //animating the track
    function animateTrack(el) {
      animating = true;
      makeActive(el);
      let idx = floatingImages.indexOf(el);
      let scrollVal = "-" + (idx / floatingImages.length) * 1000 + "%";
      gsap.to(imageTrack, {
        y: scrollVal,
        duration: 2,
        ease: Expo.easeInOut,
        onComplete: () => {
          animating = false;
        },
      });
    }

    floatingImages.forEach((index) => {
      index.addEventListener("mouseenter", () => {
        animateTrack(index);
      });
    });

    animateTrack(floatingImages[0]);
  }

  loadExperience();
});
