document.addEventListener("DOMContentLoaded", () => {
  const animateTextElements = (selector, splitBy) => {
    const textContainers = document.querySelectorAll(selector);

    textContainers.forEach((textContainer) => {
      let elements = [];
      let elementType = "";

      if (splitBy === "words") {
        elements = textContainer.textContent.trim().split(/\s+/);
        elementType = "word";
      } else if (splitBy === "letters") {
        const words = textContainer.textContent.trim().split(/\s+/);
        elements = [];

        words.forEach((word, wordIndex) => {
          for (let i = 0; i < word.length; i++) {
            elements.push(word[i]);
          }

          if (wordIndex < words.length - 1) {
            elements.push(" ");
          }
        });

        elementType = "letter";
      }

      textContainer.textContent = "";

      const animatedElements = [];

      elements.forEach((element, index) => {
        if (splitBy === "letters" && element === " ") {
          textContainer.appendChild(document.createTextNode(" "));
          return;
        }

        const elementSpan = document.createElement("span");
        elementSpan.classList.add(elementType);
        elementSpan.textContent = element;
        textContainer.appendChild(elementSpan);

        if (splitBy === "words" && index < elements.length - 1) {
          textContainer.appendChild(document.createTextNode(" "));
        }

        animatedElements.push({
          element: elementSpan,
          originalX: 0,
          originalY: 0,
          currentX: 0,
          currentY: 0,
          targetX: 0,
          targetY: 0,
        });
      });

      setTimeout(() => {
        animatedElements.forEach((element) => {
          const rect = element.element.getBoundingClientRect();
          element.originalX = rect.left + rect.width / 2;
          element.originalY = rect.top + rect.height / 2;
          element.currentX = 0;
          element.currentY = 0;
          element.targetX = 0;
          element.targetY = 0;
        });
      }, 100);

      document.addEventListener("mousemove", (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const radius = 150;
        const maxDisplacement = 300;

        animatedElements.forEach((element) => {
          const originalX = element.originalX;
          const originalY = element.originalY;

          const dx = originalX - mouseX;
          const dy = originalY - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < radius) {
            const force = (1 - distance / radius) * maxDisplacement;

            element.targetX = (dx / distance) * force;
            element.targetY = (dy / distance) * force;
          } else {
            element.targetX = 0;
            element.targetY = 0;
          }
        });
      });

      const animate = () => {
        const lerpFactor = 0.1;

        animatedElements.forEach((element) => {
          element.currentX += (element.targetX - element.currentX) * lerpFactor;
          element.currentY += (element.targetY - element.currentY) * lerpFactor;

          element.element.style.transform = `translate(${element.currentX}px, ${element.currentY}px)`;
        });

        requestAnimationFrame(animate);
      };

      animate();
    });
  };

  animateTextElements(".anime-text", "words");
  animateTextElements(".anime-header", "letters");
});
