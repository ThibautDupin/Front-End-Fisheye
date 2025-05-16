const confirmModal = document.querySelector(".send");
const closeModalButton = document.querySelector(".close-modal");
const contactModal = document.querySelector("#contact-modal");

closeModalButton.addEventListener("click", () => {
    contactModal.style.transform = "translateX(100%)";
});


