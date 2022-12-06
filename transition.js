barba.hooks.after((data) => {
  $(data.next.container).removeClass("fixed");
  $(window).scrollTop(0);
});

barba.hooks.enter((data) => {
  gsap.to(data.current.container, { opacity: 0, duration: 2 });
  gsap.from(data.next.container, { opacity: 0, duration: 2 });
  console.log("okay");
});

function flip(outgoing, incoming) {
  let state = Flip.getState(outgoing);
  $(incoming).empty();
  outgoing.appendTo(incoming);
  Flip.from(state, { duration: 0.5, duration: 1, ease: Expo.easeOut });
}

barba.init({
  preventRunning: true,
  transitions: [
    {
      sync: true,
      from: { namespace: ["gallery"] },
      to: { namespace: ["art"] },
      enter(data) {
        $(data.next.container).addClass("fixed");
        flip($("[data-art='active']"), $("[data-art='display']"));
        return gsap.to(data.current.container, { opacity: 0, duration: 2 });
      }
    },
    {
      sync: true,
      from: { namespace: ["art"] },
      to: { namespace: ["gallery"] },
      enter(data) {
        return loadExperience();
      }
    }
  ]
});
