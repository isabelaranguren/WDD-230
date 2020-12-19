var data;

function main() {
    getWeather();
    loadData();
    buildChart() 
    buildRates()
    buildRentals()
    loadRentalTypes();
    initMap();
}

const hamBtn = document.querySelector('.ham');
const mainnav = document.querySelector('.navigation')

hamBtn.addEventListener('click', () => {mainnav.classList.toggle('responsive')}, false);


function getWeather() {
    const apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=20.5083&lon=-86.9458&units=imperial&exclude=minutely,hourly&APPID=8ad3323b6bd5bd5cba6cbb7707444f1c";
    fetch(apiURL)
      .then((response) => response.json())
      .then((town) => {

         // Current weather
        let description = town.current.weather[0].description;
        document.getElementById("temp").innerHTML = `Temp: ${(Math.round(town.current.temp))}&#8457;`
        document.getElementById("humidity").innerHTML = `Humidity: ${town.current['humidity']}%`
        document.getElementById('current').innerHTML = description.charAt(0).toUpperCase() + description.slice(1);
        // console.log(JSON.stringify(town))
        
        let forecastAmount = 3
        let start = 1
        while (start <= forecastAmount) {
            let day = new Date().getDay();
            let days= ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            let today = days[day+start];
            if (day+start >= 7 ) {
              today = days[day+start-7]
             }

           let temp = `${town["daily"][start]["temp"]["day"]}\u2109`;
           let imageUrl = town["daily"][start]["weather"][0]["icon"];
           let imageSrc = `https://openweathermap.org/img/w/${imageUrl}.png`;
       
           //Define Variable
           let container = document.createElement("div");
           container.classList = "card forecast";
           let icon = document.createElement("img");
           let weatherInfo = document.createElement("ul");
           let forecastDay = document.createElement("li")
           let dayTemp = document.createElement("li");
       
           //Assign Attributes and data values
           icon.setAttribute('src',imageSrc);
           forecastDay.textContent = today;
           dayTemp.textContent = temp;
       
           //Add to container
           container.appendChild(icon);
           container.appendChild(weatherInfo);
           weatherInfo.appendChild(forecastDay);
           weatherInfo.appendChild(dayTemp);
       
           //Add container to DOM
           document.getElementById("threeDay").append(container)
           start++;
  

      }})}


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


function initMap() {
    let pdcCoords = {lat: 20.6296, lng: -87.0739};
    let pmCoords = {lat: 20.4757, lng: -86.9753};
    let coords = {lat: 20.5750, lng: -87.0739};
    let map = new google.maps.Map(document.getElementById('map'), {zoom: 10, center: coords});
    var pdc = new google.maps.Marker({position: pdcCoords, map: map});
    var pm = new google.maps.Marker({position: pmCoords, map: map});
 }

 function loadData() {
    const requestURL = './data/types.json';
 
    fetch(requestURL)
    .then(function (response) {
       return response.json();
    })
    .then(function (jsonObject) {
       data = jsonObject;
    });
 }
 
 function buildChart() {
    if (data === undefined) {
       setTimeout(buildChart, 200);
    } else {
       let table = '<table id="priceChart">';
       table += '<caption>Max Persons and Price Chart <span class="smaller">(includes Tax)</span></caption>';
       table += '<tr><th colspan="2">&nbsp;</th><th colspan="2">Reservation</th><th colspan="2">Walk-In</th></tr>';
       table += '<tr><th>Rental Type</th><th>Max Persons</th><th>Half Day<br>(3 hrs)</th><th>Full Day</th><th>Half Day<br>(3 hrs)</th><th>Full Day</th></tr>';
       data.types.forEach(type => {
          type.rentals.forEach(rental => {
             table += '<tr><td>' + rental.rental_type + '</td><td>' + rental.max_persons + '</td><td>$' + rental.pricing.reservation.half_day;
             table += '</td><td>$' + rental.pricing.reservation.full_day + '</td><td>$' + rental.pricing.walk_in.half_day;
             table += '</td><td>$' + rental.pricing.walk_in.full_day + '</td></tr>'
          })
       });
       table += '</table>';
       document.getElementById('chart').innerHTML = table;
    }
 }
 
 function buildRates() {
       if (data === undefined) {
          setTimeout(buildRates, 200);
       } else {
          let html = "";
          data.types.forEach(type => {
             type.rentals.forEach(rental => {
                html += '<div><h3>' + rental.rental_type + '</h3>';
                html += '<div><img class="rental_image" src="' + rental.image + '"></div>';
                html += '<div class="rental_detail">' + rental.description  + '</div>';
                html += '<div class="rental_price">';
                html += 'Max Persons - ' + rental.max_persons + '<br><br>';
                html += '<span class="rental_price_lable">1/2 Day Reserved</span> $' + rental.pricing.reservation.half_day + '<br>';
                html += '<span class="rental_price_lable">Full Day Reserved</span> $' + rental.pricing.reservation.full_day + '<br>';
                html += '<span class="rental_price_lable">1/2 Day Walk-in</span> $' + rental.pricing.walk_in.half_day + '<br>';
                html += '<span class="rental_price_lable">Full Day Walk-in</span> $' + rental.pricing.walk_in.full_day + '<br>';
                html += '</div>';
                html += '<div><button class="button3" onclick="javascript:window.location.href=\'reservations.html\'">Reserve a ' + rental.rental_type + '</button></div>';             
                html += '</div>';
             })
          });
          document.getElementById('rentals').innerHTML = html;
       }
    }
 
 function buildRentals() {
    if (data === undefined) {
       setTimeout(buildRentals, 200);
    } else {
       let main = document.getElementById('home_main');
       data.types.forEach(type => {
          type.rentals.forEach(rental => {
             let parent = document.createElement("div");
             let img_div = document.createElement("div");
             img_div.setAttribute('class', 'rental_image_div');
             let img = document.createElement("img");
             img.setAttribute('src', rental.image);
             img.setAttribute('alt', rental.rental_type);
             img.setAttribute('class', 'rental_image');
             img_div.appendChild(img)
             let txt_div = document.createElement("div");
             txt_div.setAttribute('class', 'txt_div');
             txt_div.textContent = rental.description;
             parent.appendChild(img_div);
             parent.appendChild(txt_div);
             main.appendChild(parent);
          })
       });
    }
 }
 
 function loadRentalTypes() {
    if (data === undefined) {
       setTimeout(loadRentalTypes, 200);
    } else {
       let select = document.getElementById('rental_type');
       let option = document.createElement("option");
       option.innerText = "Select Type";
       select.appendChild(option);
       data.types.forEach(type => {
          type.rentals.forEach(rental => {
             option = document.createElement("option");
             option.innerText = rental.rental_type;
             select.appendChild(option);
          })
       });
    }
 }

d = new Date
document.getElementById('rStart').min = `${d.getMonth()+1}-${d.getDate()}-${d.getFullYear()}`;

document.getElementById('rEnd').min = `${d.getMonth()+1}-${d.getDate()+1}-${d.getFullYear()}`;

fetch("data/types.json")
  .then(response => response.json())
  .then(rentals => {
    for (let i = 0; i < rentals.prices.length; i++) {
      option = document.createElement("option");
      option.setAttribute("value", rentals.prices[i].rental_type);
      option.textContent = rentals.prices[i].rental_type;

      document.getElementById('vehicleType').appendChild(option);
    }
  });
