function main() {
  displayBanner();
  getWindChill();
  getTownData();
  getEvent();
}

// Get Date for the footer
const date = new Date();
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
const monthAbbrNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const day = date.getDay();
const dayName = days[day];
const month = date.getMonth();
const monthName = monthNames[month];
const year = date.getFullYear();
document.getElementById("currentDate").innerHTML = dayName + ', ' + date.getDate() + ' ' + monthName  + ' ' + year;
document.getElementById("year").innerHTML = year;


const hamBtn = document.querySelector('.ham');
const mainnav = document.querySelector('.navigation')

hamBtn.addEventListener('click', () => {mainnav.classList.toggle('responsive')}, false);

// Displays banner on top of the header on fridays
function displayBanner(){
  var dayOfWeek = false
  if (new Date().getDay() == "5" || dayOfWeek == true){
      document.getElementById('banner').classList.toggle('hidden');
  }
  document.documentElement.scrollTop = 0;

}

// Town Data CARDS
function getTownData() {
  const requestURL = './towndata.json';
  fetch(requestURL)
  .then(function (response) {
   return response.json();
})
  .then(function (jsonObject) {
  const towns = jsonObject['towns'];
  for (let i = 0; i < towns.length; i++) {
      if (towns[i].name == "Preston" || towns[i].name == "Fish Haven" || towns[i].name == "Soda Springs") {
        let card = document.createElement('section');
        let name = document.createElement('h2');
        let motto = document.createElement('h4');
        let image = document.createElement('img');
        let yearFounded = document.createElement('p');
        let currentPopulation = document.createElement('p');
        let averageRainfall = document.createElement('p');
        let details = document.createElement('div');
      
      name.textContent = towns[i].name;
      motto.textContent = towns[i].motto;
      
      currentPopulation.textContent = 'Population: ' + towns[i].currentPopulation;
      averageRainfall.textContent = 'Annual Rainfall: ' + towns[i].averageRainfall + ' ' + 'in.';
      yearFounded.textContent = 'Year Founded: ' + towns[i].yearFounded;
      
      image.setAttribute('src', '/lesson11/img/' + towns[i].photo);
      image.setAttribute('alt', towns[i].name);
      
      details.setAttribute('id', 'details');
      
      card.appendChild(details);
      card.appendChild(image);
      
      details.appendChild(name);
      details.appendChild(motto);
      details.appendChild(yearFounded);
      details.appendChild(currentPopulation);
      details.appendChild(averageRainfall);
      document.querySelector('div.cards').appendChild(card);
      }
   }

  });
}


// Observer 
let imagesToLoad = document.querySelectorAll('img[data-src]');
const loadImages = (image) => {
  image.setAttribute('src', image.getAttribute('data-src'));
  image.onload = () => {
    image.removeAttribute('data-src');
  };
};

const imgOptions = {
  threshold: 0,
  rootMargin: "0px 0px -100px 0px"
};

if('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((items, observer) => {
    items.forEach((item) => {
      if(item.isIntersecting) {
        loadImages(item.target);
        observer.unobserve(item.target);
      }
    });
  }, imgOptions);

  imagesToLoad.forEach((img) => {
    observer.observe(img);
  });
} else {
  imagesToLoad.forEach((img) => {
    loadImages(img);
  });
}

function getSummary(id) {
  const apiURL = "https://api.openweathermap.org/data/2.5/weather?id=" + id + "&units=imperial&APPID=8ad3323b6bd5bd5cba6cbb7707444f1c";
  fetch(apiURL)
    .then((response) => response.json())
          //console.log(JSON.stringify(jsObject));

    .then((jsObject) => {

      let temp = jsObject.main['temp'];
      let speed = jsObject.wind['speed'];
      document.getElementById('temperature').textContent = `Current Temperature: ${temp} \u2109`;
      document.getElementById('tempHigh').textContent    = `High: ${jsObject.main['temp_max']} \u2109`;
      document.getElementById('tempLow').textContent     = `Low: ${jsObject.main['temp_min']} \u2109`;
      document.getElementById('humidity').textContent    = `Humidity: ${jsObject.main['humidity']}%`;
      document.getElementById('wind').textContent        = `Wind Speed: ${speed} MPH`;
      document.getElementById('windchill').textContent   = `Wind Chill: ${getWindChill(temp, speed)} \u2109`;
    });
}


// Calculate windchill
function getWindChill(tempF, speed) {
  let s = Math.pow(speed, 0.16);
  f = 35.74 + (0.6215 * tempF) - (35.75 * s) + (0.4275 * tempF * s);
  return f.toFixed(2)
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function updateSeverity(val) {
  document.getElementById('severitydisplay').innerHTML = "Severity: " + val; 
}


/* 5 day forecast */
function getForecast(id) {
  const apiURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + id + "&units=imperial&APPID=8ad3323b6bd5bd5cba6cbb7707444f1c";
  fetch(apiURL)
  .then(response => response.json())
  .then((jsObject) => {
      console.log(jsObject);
      const forecastData = jsObject.list.filter((element)=>element.dt_txt.includes('18:00:00'));

console.log(forecastData);

const weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

  let day = 0;
forecastData.forEach(forecast => {
  let x = new Date(forecast.dt_txt);
  document.getElementById('temp'+(day+1)).textContent = Math.round(forecast.main.temp) + ' °F';
  document.getElementById('icon'+(day+1)).src = "https://openweathermap.org/img/w/" + forecast.weather[0].icon + ".png";
  document.getElementById('icon'+(day+1)).alt = forecast.weather[0].description
  document.getElementById('day'+(day+1)).textContent = weekdays[x.getDay()];
  day++;	  
});
});
}

// Town Events
function getEvent(town) {
  const requestURL = './towndata.json';
  fetch(requestURL)
 .then(function (response) {
   return response.json();
 })
 .then(function (jsonObject) {
   const towns = jsonObject['towns'];
   for (let i = 0; i < towns.length; i++ ) {
       if (towns[i].name == town) {
           let events = towns[i].events;
           for (let i=0; i < events.length; i++) {
               let event = document.createElement('p');
               event.innerHTML = events[i];
               document.querySelector('#events').appendChild(event);
           }
       }
   }
});
}
