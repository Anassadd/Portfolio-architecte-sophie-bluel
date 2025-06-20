// On déclare un tableau vide qui va contenir les projets récupérés depuis l'API
let works = [];

// On fait la requête pour récupérer les projets depuis le serveur
fetch('http://localhost:5678/api/works')
  .then(response => response.json()) // On transforme la réponse en JSON
  .then(data => {
    works = data; // On stocke les projets dans la variable works
    displayGallery(works); // On affiche tous les projets dans la galerie au chargement
  })
  .catch(error => console.error('Erreur :', error)); // En cas d'erreur, on l'affiche dans la console

// Fonction qui affiche les projets passés en paramètre dans la galerie HTML
function displayGallery(data) {
  const gallery = document.querySelector('.gallery'); // On cible la div galerie
  gallery.innerHTML = ""; // On vide la galerie avant d'afficher

  // Pour chaque projet dans data, on crée les éléments HTML nécessaires
  data.forEach(work => {
    const figure = document.createElement('figure'); // Création de la balise <figure>
    const img = document.createElement('img'); // Création de la balise <img>
    img.src = work.imageUrl; // On met l'URL de l'image
    img.alt = work.title; // On met le titre en alt pour l'accessibilité

    const caption = document.createElement('figcaption'); // Création de la légende
    caption.textContent = work.title; // Le texte de la légende est le titre du projet

    figure.appendChild(img); // On ajoute l'image dans la figure
    figure.appendChild(caption); // On ajoute la légende dans la figure
    gallery.appendChild(figure); // On ajoute la figure dans la galerie
  });
}

const filterButtons = document.querySelectorAll('#filters button');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Enlève la classe "active" sur tous les boutons
    filterButtons.forEach(btn => btn.classList.remove('active'));

    // Ajoute la classe "active" au bouton cliqué
    button.classList.add('active');

    // Récupère l'id de la catégorie
    const categoryId = parseInt(button.dataset.id);

    if (categoryId === 0) {
      displayGallery(works); // Affiche tous les projets
    } else {
      const filtered = works.filter(work => work.category.id === categoryId);
      displayGallery(filtered); // Affiche les projets filtrés
    }
  });
});

