function windChill(currTemp, windSpeed) {
    let s = Math.pow(windSpeed, 0.16);
    f = 35.74 + (0.6215 * currTemp) - (35.75 * s) + (0.4275 * currTemp * s);
    return f.toFixed(2) + "&#8457;";
  }