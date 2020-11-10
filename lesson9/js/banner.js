function main() {
    getDate()
    displayBanner();
    getWindChill();

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

