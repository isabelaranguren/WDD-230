let mapsToLoad = document.querySelectorAll('div[data-embed]');
const loadMaps = (map) => {
  map.innerHTML = map.getAttribute('data-embed');
  map.onload = () => {
    map.removeAttribute('data-embed');
  };
};

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((items, observer) => {
    items.forEach((item) => {
      if (item.isIntersecting) {
        loadMaps(item.target);
        observer.unobserve(item.target);
      }
    });
  });
   mapsToLoad.forEach((map) => {
    observer.observe(map);
  });
} else {
  mapsToLoad.forEach((map) => {
    loadMaps(map);
  });
}