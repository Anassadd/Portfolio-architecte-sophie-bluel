document.addEventListener("DOMContentLoaded", () => {
  // 1. Variables globales
  let works = [];
  const editButton = document.getElementById("edit-button");
  const modal = document.getElementById("modal");
  const overlay = document.getElementById("modal-overlay");
  const closeModalBtn = document.getElementById("close-modal");
  const modalGallery = document.getElementById("modal-gallery");
  const loginLink = document.getElementById("login-link");

  // Éléments pour la modale d'ajout photo
  const modalAdd = document.getElementById("modal-add");
  const overlayAdd = document.getElementById("modal-overlay-add");
  const openAddModalBtn = document.getElementById("add-photo");
  const closeAddModalBtn = document.getElementById("close-modal-add");
  const backToGalleryBtn = document.getElementById("back-to-gallery");

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

  // 6. Ouvrir la modale principale
if (editButton) {
  editButton.addEventListener("click", () => {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    displayModalGallery();
  });
}

  // 7. Fermer la modale principale
  function closeModal() {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
    document.body.style.overflow = "";
  }
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
  if (overlay) overlay.addEventListener("click", closeModal);

  // 8. Galerie modale
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

      const icon = document.createElement("i");
      icon.classList.add("fa-solid", "fa-trash-can");

      deleteIcon.appendChild(icon);
      deleteIcon.addEventListener("click", () => {
        deleteWork(work.id, container);
      });

      container.appendChild(img);
      container.appendChild(deleteIcon);
      modalGallery.appendChild(container);
    });
  }

  function deleteWork(workId, container) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté pour supprimer.");
      return;
    }

    fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(async response => {
        if (response.ok) {
          works = works.filter(work => work.id !== workId);
          container.remove();
          displayGallery(works);
        } else {
          const errorText = await response.text();
          console.error("Erreur API:", response.status, errorText);
          alert(`Erreur lors de la suppression : ${response.status}`);
        }
      })
      .catch(error => {
        console.error("Erreur réseau :", error);
        alert("Erreur réseau ou serveur.");
      });
  }

  // Fonction pour ouvrir la modale d'ajout photo
if (openAddModalBtn) {
  openAddModalBtn.addEventListener("click", () => {
    // Fermer la première modale
    modal.classList.add("hidden");
    overlay.classList.add("hidden");

    // Ouvrir la deuxième modale (ajout photo)
    modalAdd.classList.remove("hidden");
    overlayAdd.classList.remove("hidden");

    document.body.style.overflow = "hidden";
  });
}

// Fermer la modale d'ajout photo
if (closeAddModalBtn) {
  closeAddModalBtn.addEventListener("click", () => {
    modalAdd.classList.add("hidden");
    overlayAdd.classList.add("hidden");
    document.body.style.overflow = "";
  });
}

if (overlayAdd) {
  overlayAdd.addEventListener("click", () => {
    modalAdd.classList.add("hidden");
    overlayAdd.classList.add("hidden");
    document.body.style.overflow = "";
  });
}

// Revenir à la galerie (modale 1)
if (backToGalleryBtn) {
  backToGalleryBtn.addEventListener("click", () => {
    modalAdd.classList.add("hidden");
    overlayAdd.classList.add("hidden");

    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  });
}



  // Fermer modale galerie (croix ou overlay)
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeAllModals);
  }

  if (overlay) {
  overlay.addEventListener("click", closeAllModals);
}

});












