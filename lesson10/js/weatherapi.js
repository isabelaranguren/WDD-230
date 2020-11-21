const apiURL = "http://api.openweathermap.org/preston/2.5/forecast?id=5604473&units=imperial&appid=8ad3323b6bd5bd5cba6cbb7707444f1c";

fetch(apiURL)
  .then((response) => response.json())
  .then((preston) => {
    console.log(preston);

    document.getElementById('current-temp').innerHTML = preston.main.temp;
    const imagesrc = 'https://openweathermap.org/img/w/' + preston.weather[0].icon + '.png'; 
    const desc = preston.weather[0].description;  
    document.getElementById('imagesrc').textContent = imagesrc;  
    document.getElementById('icon').setAttribute('src', imagesrc);  
    document.getElementById('icon').setAttribute('alt', desc);

  }
  
  );