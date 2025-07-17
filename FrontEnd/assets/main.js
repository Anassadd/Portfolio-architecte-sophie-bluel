// Quand la page est complètement chargée
document.addEventListener("DOMContentLoaded", () => {
  
  // PARTIE 1 : INITIALISATION

  let works = []; // Stocke tous les projets
  
  // Elements de la 1ère modale (galerie)
  const editButton = document.getElementById("edit-button"); // Bouton "modifier"
  const modal = document.getElementById("modal"); // Modale principale
  const overlay = document.getElementById("modal-overlay"); // Fond flou
  const closeModalBtn = document.getElementById("close-modal"); // Bouton de fermeture
  const modalGallery = document.getElementById("modal-gallery"); // Conteneur des images dans la modale

  // Elements de la 2ème modale (ajout photo)
  const modalAdd = document.getElementById("modal-add");
  const overlayAdd = document.getElementById("modal-overlay-add");
  const openAddModalBtn = document.getElementById("add-photo"); // Bouton "Ajouter une photo"
  const closeAddModalBtn = document.getElementById("close-modal-add"); // Bouton de fermeture
  const backToGalleryBtn = document.getElementById("back-to-gallery"); // Bouton retour

 
  // PARTIE 2 : GALERIE PRINCIPALE
  
  
  // Charge les projets depuis l'API
  fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(data => {
      works = data; // Stocke les projets
      displayGallery(works); // Affiche la galerie
    })
    .catch(error => console.error("Erreur:", error));

  // Affiche les projets dans la galerie principale
  function displayGallery(projects) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = ""; // Vide la galerie
    
    // Crée une carte pour chaque projet
    projects.forEach(work => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      img.src = work.imageUrl; // Image du projet
      img.alt = work.title; // Texte alternatif
      const caption = document.createElement("figcaption");
      caption.textContent = work.title; // Titre du projet
      figure.append(img, caption);
      gallery.appendChild(figure);
    });
  }

  
  // PARTIE 3 : FILTRES
  
  const filterButtons = document.querySelectorAll("#filters button");
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Active/désactive les boutons
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      
      // Filtre les projets
      const categoryId = parseInt(button.dataset.id);
      const filteredWorks = categoryId === 0 ? works : works.filter(work => work.category.id === categoryId);
      displayGallery(filteredWorks);
    });
  });

  
  // PARTIE 4 : MODE ADMIN
 
  const token = localStorage.getItem("token");
  const loginLink = document.getElementById("login-link");

  if (token && loginLink) {
    // Mode connecté
    loginLink.textContent = "logout";
    loginLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      window.location.href = "index.html"; // Redirige vers l'accueil
    });

    // Affiche les éléments admin
    document.getElementById("edit-bar").style.display = "block";
    if (editButton) editButton.style.display = "inline-block";
    document.getElementById("filters").style.display = "none"; // Cache les filtres
  }

 
  // PARTIE 5 : 1ère MODALE (GALERIE)
 
  
  // Ouvre la modale
  if (editButton) editButton.addEventListener("click", () => {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
    document.body.style.overflow = "hidden"; // Bloque le scroll
    displayModalGallery(); // Affiche la galerie dans la modale
  });

  // Ferme la modale
  function closeModal() {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
    document.body.style.overflow = ""; // Réactive le scroll
  }
  
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
  if (overlay) overlay.addEventListener("click", closeModal);

  // Affiche la galerie dans la modale
  function displayModalGallery() {
    modalGallery.innerHTML = ""; // Vide la modale
    
    works.forEach(work => {
      const container = document.createElement("div");
      container.classList.add("img-container");

      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;

      // Icône de suppression
      const deleteIcon = document.createElement("span");
      deleteIcon.classList.add("delete-icon");
      deleteIcon.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
      deleteIcon.addEventListener("click", () => deleteWork(work.id, container));

      container.append(img, deleteIcon);
      modalGallery.appendChild(container);
    });
  }

  // Supprime un projet
  function deleteWork(workId, container) {
    const token = localStorage.getItem("token");
    if (!token) return alert("Connectez-vous");

    fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => {
      if (response.ok) {
        works = works.filter(work => work.id !== workId); // Met à jour la liste
        container.remove(); // Supprime visuellement
        displayGallery(works); // Met à jour la galerie principale
      } else {
        alert("Erreur de suppression");
      }
    })
    .catch(error => console.error("Erreur:", error));
  }


  // PARTIE 6 : 2ème MODALE (AJOUT PHOTO)
 
  const categorySelect = document.getElementById("category");
  const imageInput = document.getElementById("image");
  const titleInput = document.getElementById("title");
  const validateBtn = document.getElementById("validate-btn");
  const imagePreview = document.getElementById("image-preview");

  // Ouvre la 2ème modale
  if (openAddModalBtn) openAddModalBtn.addEventListener("click", () => {
    modal.classList.add("hidden"); // Ferme 1ère modale
    modalAdd.classList.remove("hidden"); // Ouvre 2ème modale
    overlayAdd.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    loadCategories(); // Charge les catégories
    resetForm(); // Réinitialise le formulaire
  });

  // Charge les catégories depuis l'API
  async function loadCategories() {
    try {
      const response = await fetch("http://localhost:5678/api/categories");
      const categories = await response.json();
      
      // Réinitialise le select
      categorySelect.innerHTML = '<option value="" disabled selected>-- Catégorie --</option>';
      
      // Ajoute chaque catégorie
      categories.forEach(cat => {
        const option = new Option(cat.name, cat.id);
        categorySelect.add(option);
      });
    } catch (error) {
      console.error("Erreur:", error);
    }
  }

  // Gestion de l'image uploadée
  imageInput.addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        imagePreview.src = e.target.result; // Affiche l'aperçu
        imagePreview.style.display = "block"; //pour afficher
        document.querySelector(".upload-container").classList.add("has-image");
        };
      reader.readAsDataURL(file);
    }
    checkForm(); // Vérifie si le formulaire est complet
  });

  // Vérifie si le formulaire est complet
  function checkForm() {
    const formComplete = (
      imageInput.files.length > 0 && // Image sélectionnée
      titleInput.value.trim() !== "" && // Titre rempli
      categorySelect.value !== "" // Catégorie choisie
    );
    validateBtn.disabled = !formComplete; // Active/désactive le bouton Valider
    validateBtn.classList.toggle('active', formComplete); // Active/désactive le bouton Valider
  }

  // Écoute les modifications du formulaire
  titleInput.addEventListener("input", checkForm);
  categorySelect.addEventListener("change", checkForm);

  // Réinitialise le formulaire
  function resetForm() {
    document.getElementById("add-form").reset();
     document.querySelector(".upload-container").classList.remove("has-image");
    imagePreview.style.display = "none";
    checkForm(); // Désactive le bouton Valider
  }

  // Ferme la 2ème modale
  function closeAddModal() {
    modalAdd.classList.add("hidden");
    overlayAdd.classList.add("hidden");
    overlay.classList.add("hidden");
    document.body.style.overflow = "";
  }

  // Gestion fermeture 2ème modale
  if (closeAddModalBtn) closeAddModalBtn.addEventListener("click", closeAddModal);
  if (overlayAdd) overlayAdd.addEventListener("click", closeAddModal);

  // Retour à la 1ère modale
  if (backToGalleryBtn) backToGalleryBtn.addEventListener("click", () => {
    closeAddModal();
    modal.classList.remove("hidden"); // Réaffiche 1ère modale
    overlay.classList.remove("hidden");
  });

  // Soumission du formulaire (Ajout Photo)
const addForm = document.getElementById("add-form");
if (addForm) {
  addForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté pour ajouter une photo.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageInput.files[0]);
    formData.append("title", titleInput.value.trim());
    formData.append("category", categorySelect.value);

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        alert("Erreur lors de l'ajout de la photo.");
        return;
      }

      const newWork = await response.json();

      // Ajoute le nouveau projet à la galerie principale
      addWorkToMainGallery(newWork);

      // Ajoute le nouveau projet à la galerie de la modale
      addWorkToModalGallery(newWork);

      // Ferme la modale + réinitialise le formulaire
      closeAddModal();
      resetForm();

    } catch (error) {
      console.error("Erreur:", error);
    }
  });
}

// Fonction pour ajouter un work dans la galerie principale
function addWorkToMainGallery(work) {
  const gallery = document.querySelector(".gallery");
  if (!gallery) return;

  const figure = document.createElement("figure");
  figure.dataset.id = work.id;

  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;

  const figcaption = document.createElement("figcaption");
  figcaption.textContent = work.title;

  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
}

// Fonction pour ajouter un work dans la modale
function addWorkToModalGallery(work) {
  const modalGallery = document.querySelector(".modal-gallery");
  if (!modalGallery) return;

  const figure = document.createElement("figure");
  figure.dataset.id = work.id;

  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;

  figure.appendChild(img);
  modalGallery.appendChild(figure);
}

});









