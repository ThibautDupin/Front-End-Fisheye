const contactModal = document.querySelector("#contact-modal");
const contactButton = document.querySelector(".contact_button");
const closeModalButton = document.querySelector(".close-modal");

contactButton.addEventListener("click", () => {
    contactModal.style.transform = "translateX(0%)";
});
   