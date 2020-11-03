// function getRandomInt(min, max) {
//     return Math.floor(Math.random() * (max - min + 1) ) + min; //The maximum is inclusive and the minimum is inclusive 
// }

// function getSummary(){
//     let currTemp = getRandomInt(25,100);
//     let windSpeed = getRandomInt(1,12);
//     let windChill;
//     if (currTemp <= 50 && windSpeed > 3.0) {
//         windchill();
//     }

//     document.getElementById('currTemp').innerHTML = `${currTemp}&#8457;`;
//     document.getElementById('windSpeed').innerHTML = `${windSpeed} MPH`;
//     document.getElementById('windChill').innerHTML = `${windChill} HGH`;

// }

//     function windChill(currTemp, windSpeed) {
//         let s = Math.pow(windSpeed, 0.16);
//         let f = 35.74 + (0.6215 * currTemp) - (35.75 * s) + (0.4275 * currTemp * s);
//         return f.toFixed(2) + "&#8457;";
//       }


function getWindchill() {
    const temperature = parseInt(document.getElementById('currTemp').innerText)
    const windSpeed = parseInt(document.getElementById('windSpeed').innerText)
    const windchill = 35.74 + (0.6215* temperature) - (35.75 * Math.pow(windSpeed, 0.16) ) + (0.4275 * temperature * Math.pow(windSpeed, 0.16))
    document.getElementById('windChill').innerText = windchill.toFixed(2)
}
getWindchill()