function main() {
    getDate()
    displayBanner();
    getSummary();
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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min; //The maximum is inclusive and the minimum is inclusive 
}

function getSummary(){
    let currTemp = getRandomInt(25,90);
    let windSpeed = getRandomInt(1,12);
    let windChill;
    if (currTemp <= 50 && windSpeed > 3.0){
        windChill = windChill(currTemp, windSpeed);
    }

    document.getElementById('currTemp').innerHTML = `${currTemp}&#8457;`
    document.getElementById('windSpeed').innerHTML = `${windSpeed} MPH`
    document.getElementById('windChill').innerHTML = `${windChill}`
}
