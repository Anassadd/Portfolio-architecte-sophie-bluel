// 1. Variables globales
let works = [];
const editButton = document.getElementById("edit-button");
const modal = document.getElementById("modal");
const overlay = document.getElementById("modal-overlay");
const closeModalBtn = document.getElementById("close-modal");
const modalGallery = document.getElementById("modal-gallery");
const loginLink = document.getElementById("login-link");

// 2. Charger les projets depuis l'API
fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(data => {
    works = data;
    displayGallery(works);
  })
  .catch(error => console.error("Erreur chargement API :", error));

// 3. Afficher les projets dans la galerie principale
function displayGallery(projets) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  projets.forEach(work => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;
    const caption = document.createElement("figcaption");
    caption.textContent = work.title;
    figure.appendChild(img);
    figure.appendChild(caption);
    gallery.appendChild(figure);
  });
}

// 4. Filtres
const filterButtons = document.querySelectorAll("#filters button");
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    const categoryId = parseInt(button.dataset.id);
    if (categoryId === 0) {
      displayGallery(works);
    } else {
      const filteredWorks = works.filter(work => work.category.id === categoryId);
      displayGallery(filteredWorks);
    }
  });
});

// 5. Mode admin
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (token) {
    loginLink.textContent = "logout";
    loginLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      window.location.reload();
    });

    const editBar = document.getElementById("edit-bar");
    const filters = document.getElementById("filters");
    if (editBar) editBar.style.display = "block";
    if (editButton) editButton.style.display = "inline-block";
    if (filters) filters.style.display = "none";
  }
});

// 6. Ouvrir la modale
editButton.addEventListener("click", () => {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  displayModalGallery();
});

// 7. Fermer la modale
function closeModal() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
  document.body.style.overflow = "";
}
closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// 8. Afficher les images dans la modale
function displayModalGallery() {
  modalGallery.innerHTML = "";
  works.forEach(work => {
    const container = document.createElement("div");
    container.classList.add("img-container");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const deleteIcon = document.createElement("span");
    deleteIcon.classList.add("delete-icon");
    deleteIcon.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

    container.appendChild(img);
    container.appendChild(deleteIcon);
    modalGallery.appendChild(container);
  });
}

const addPhotoButton = document.getElementById("add-photo");

addPhotoButton.addEventListener("click", () => {
  alert("Tu vas pouvoir ajouter une photo ici !");
  // Ici tu pourras plus tard afficher une autre modale ou formulaire
});





