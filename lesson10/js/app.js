function main() {
  displayBanner();
  getWindChill();
  getSummary();
  getForecast();
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

function getSummary() {
  const apiURL = "https://api.openweathermap.org/data/2.5/weather?id=5604473&units=imperial&APPID=8ad3323b6bd5bd5cba6cbb7707444f1c";
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
function getForecast() {
  const apiURL = "https://api.openweathermap.org/data/2.5/forecast?id=5604473&units=imperial&APPID=8ad3323b6bd5bd5cba6cbb7707444f1c";
  fetch(apiURL)
  .then((response) => response.json())
  .then((town) => {
     const townList = town.list;
     let daycount = 0;
     for (let i = 0; i < town.list.length; i++ ) {
        let day = townList[i].dt_txt;
        if (day.substr(11, 19) == '18:00:00') {
           daycount += 1;
           let dateParts = day.substr(0,10).split('-');
           let month = monthAbbrNames[+dateParts[1]];
           let date = month + " " + +dateParts[2];
           let dateElement = 'day' + daycount;
           document.getElementById(dateElement).innerHTML = date;

           // Get description
           let descriptionLower = townList[i].weather[0].description;
           let description = descriptionLower.charAt(0).toUpperCase() + descriptionLower.slice(1);
           let descriptionElement = 'condition' + daycount;
           document.getElementById(descriptionElement).innerHTML = description;

           // Get high
           let temp = Math.round(townList[i].main.temp_max) + " &#176;F";
           let tempElement = 'temp' + daycount;
           document.getElementById(tempElement).innerHTML = temp;

           // Get icon
           const imagesrc = 'https://openweathermap.org/img/w/' + townList[i].weather[0].icon + '.png';
           let imageElement = 'icon' + daycount;
           document.getElementById(imageElement).setAttribute('src', imagesrc);
           document.getElementById(imageElement).setAttribute('alt', description);
        }
     }
  });
}

