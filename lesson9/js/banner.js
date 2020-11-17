function main() {
    getDate();
    displayBanner();
    getWindChill();
    loadTowns();

}

function getDate() {
    var d = new Date();
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var month = d.getMonth();
    var weekday = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var dayOfWeek = d.getDay();
    var day = d.getDate();
    var year = d.getFullYear();
    var currentDay = `Today is ${weekday[dayOfWeek-1]}, ${day} ${months[month]} ${year} `
    document.getElementById('currentDate').innerHTML = currentDay;
}

function displayBanner(){
    var dayOfWeek = false
    if (new Date().getDay() == "5" || dayOfWeek == true){
        document.getElementById('banner').classList.toggle('hidden');
    }
    document.documentElement.scrollTop = 0;

}


const requestURL = './towndata.json';
fetch(requestURL)
.then(function (response) {
   return response.json();
})
.then(function (jsonObject) {
   //console.table(jsonObject);  // temporary checking for valid response and data parsing
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
      
      image.setAttribute('src', '/lesson9/img/' + towns[i].photo);
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
    

