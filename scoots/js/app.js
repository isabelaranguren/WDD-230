function main() {
    getWeather()
    // getAlert()
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

      fetch("data/rental.json")
      .then(response => response.json())
      .then(rentals => {
        for (let i = 0; i < rentals.prices.length; i++) {
          // console.log(rentals.prices[i]);
          let title = rentals.prices[i]["rental_type"];
          let max = rentals.prices[i]["max_persons"];
          let reservationHalf = rentals.prices[i]["reservation"]["half"];
          let reservationFull = rentals.prices[i]["reservation"]["full"];
          let walkInHalf = rentals.prices[i]["walk_in"]["half"];
          let walkInFull = rentals.prices[i]["walk_in"]["full"];
          let imageToLoad = rentals.prices[i]["img"];
    
          let rentalOption = document.createElement("div");
          let h2 = document.createElement("h2");
          let row = document.createElement("div")
          let img = document.createElement("img");
          let column = document.createElement("div");
          let ul = document.createElement("ul");
          let rmax = document.createElement("li");
          let rtitle = document.createElement("li");
          let rPrices = document.createElement("li");
          let wtitle = document.createElement("li");
          let wPrices = document.createElement("li");
          let btn = document.createElement("div");
          let reserve = document.createElement("a");
    
          rentalOption.classList = "rental-option card"
          h2.textContent = title;
          img.setAttribute("src", "assets/placeholder2.png");
          img.setAttribute("alt", title);
          img.setAttribute("data-src", imageToLoad);
          row.classList = "flex-row";
          column.classList = "flex-column rental-option-text";
          rmax.textContent = `Max Passengers: ${max}`;
          rtitle.textContent = "Reservation Prices:";
          rPrices.textContent = `Half day: $${reservationHalf} | Full day: $${reservationFull}`
          wtitle.textContent = "Walk In Prices:";
          wPrices.textContent = `Half day: $${walkInHalf} | Full day: $${walkInFull}`
          btn.classList = "button";
          reserve.setAttribute("href", "reservations.html")
          reserve.textContent = "Reserve Now!"
    
    
          rentalOption.appendChild(h2);
          rentalOption.appendChild(row);
          row.appendChild(img);
          row.appendChild(column);
          column.appendChild(ul);
          ul.appendChild(rmax);
          ul.appendChild(rtitle);
          ul.appendChild(rPrices);
          ul.appendChild(wtitle);
          ul.appendChild(wPrices);
          column.appendChild(btn);
          btn.appendChild(reserve);
    
          document.getElementById("rental-container").appendChild(rentalOption);
        }
      });


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
