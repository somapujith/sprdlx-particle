document.addEventListener("DOMContentLoaded", () => {
  const services = document.querySelectorAll(".service");
  const indicator = document.querySelector(".indicator");
  const activeIndex = 2;
  const serviceHeight = 38;

  if (!indicator || !services.length || !services[activeIndex]) return;

  const activeService = services[activeIndex];
  const activeWidth = activeService.getBoundingClientRect().width + 8;

  services.forEach((service) => service.classList.remove("active"));
  activeService.classList.add("active");

  indicator.style.width = `${activeWidth}px`;
  indicator.style.transform = `translate(-50%, ${activeIndex * serviceHeight}px)`;
});
