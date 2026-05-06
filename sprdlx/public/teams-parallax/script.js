document.addEventListener("mousemove", parallax);

function parallax(e) {
  document.querySelectorAll(".layer").forEach((layer) => {
    const speed = Number(layer.getAttribute("data-speed"));
    const x = (window.innerWidth - e.pageX * speed) / 150;
    const y = (window.innerHeight - e.pageY * speed) / 150;
    layer.style.transform = `translateX(${x}px) translateY(${y}px)`;
  });
}
