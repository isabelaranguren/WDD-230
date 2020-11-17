function getWindchill() {
    const temperature = parseInt(document.getElementById('currTemp').innerText)
    const windSpeed = parseInt(document.getElementById('windSpeed').innerText)
    const windchill = 35.74 + (0.6215* temperature) - (35.75 * Math.pow(windSpeed, 0.16) ) + (0.4275 * temperature * Math.pow(windSpeed, 0.16))
    document.getElementById('windChill').innerText = windchill.toFixed(2)
}
getWindchill()