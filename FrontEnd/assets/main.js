let works = [];

fetch('http://localhost:5678/api/works')
  .then(response => response.json())
  .then(data => {
    works = data;
    displayGallery(works); // Affiche tout au début
  })
  .catch(error => console.error('Erreur :', error));

// Fonction pour afficher les projets dans la galerie
function displayGallery(data) {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = "";

  data.forEach(work => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;

    const caption = document.createElement('figcaption');
    caption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(caption);
    gallery.appendChild(figure);
  });
}

// Gestion des filtres
document.getElementById('filters').addEventListener('click', function (event) {
  const categoryId = parseInt(event.target.dataset.id);

  if (categoryId === 0) {
    displayGallery(works); // Tous
  } else {
    const filtered = works.filter(work => work.category.id === categoryId);
    displayGallery(filtered);
  }
});
