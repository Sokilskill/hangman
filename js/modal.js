const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalMessage = document.getElementById("modal-message");
const modalButtonsContainer = document.getElementById(
  "modal-buttons-container"
);

/**
 * {string} title
 * {string} message
 * {Array<Object>} buttons
 * {
 * text: string,
 * className: string,
 * handler: Function
 * }
 */

export function showModal(title, messange, buttons) {
  modalButtonsContainer.innerHTML = "";
  modalTitle.textContent = title;
  modalMessage.textContent = messange;

  if (buttons) {
    buttons.forEach((buttonConfig) => {
      const button = document.createElement("button");
      button.textContent = buttonConfig.text;
      button.className = buttonConfig.className || "";
      button.addEventListener("click", () => {
        if (buttonConfig.handler) {
          buttonConfig.handler();
        }
        hideModal();
      });
      modalButtonsContainer.appendChild(button);
    });
  }

  modal.classList.add("active");

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      hideModal();
    }
  });

  window.addEventListener("keyup", closeModalPressEsc);
}

export function hideModal() {
  modal.classList.remove("active");
  window.removeEventListener("keyup", closeModalPressEsc);
}

const closeModalPressEsc = (e) => {
  if (e.code === "Escape") {
    hideModal();
  }
};
