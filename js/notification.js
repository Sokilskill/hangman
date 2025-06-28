export function showNotification(message, type = "info") {
  const toastContainer = document.getElementById("toastContainer");
  const toast = document.createElement("div");

  toast.classList.add("toast");
  toast.textContent = message;

  toast.classList.add(type);

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 10); // Невелика затримка після натискання на кноку

  setTimeout(() => {
    toast.classList.remove("show");

    toast.addEventListener(
      "transitionend", // коли CSS-анімацію завершено.
      () => {
        toast.remove();
      },

      { once: true }
    );
  }, 3000);
}
