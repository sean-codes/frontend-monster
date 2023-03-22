var app = document.querySelector('.app')
// today component
var today = app.querySelector('.component-today')
var todayDayName = today.querySelector('.day')
var todayDate = today.querySelector('.date')
var todayTemp = today.querySelector('.temp .num')
var todayWeather = today.querySelector('.type')

// details
var details = app.querySelector('.component-details')
var detailsPrecipitation = details.querySelector('#precipitation .num')
var detailsHumidity = details.querySelector('#humidity .num')
var detailsWind = details.querySelector('#wind .num')

// days
var daysList = app.querySelector('.component-days')
for (var htmlDay of daysList.querySelectorAll('.day')) {
   htmlDay.onclick = onClickDay
}



// DAY OBJECT DEFINITION
// {
//    date: '22 Mar 2023',
//    name: 'Tue',
//    degree: 50,
//    weather: 'sunny',
//    precipitation: 0,
//    humidity: 0.34,
//    wind: 0,
// }

var days = [
   {
      date: '22 Mar 2023',
      name: 'Tuesday',
      nameShort: 'tue',
      degree: 55,
      weather: 'sunny',
      precipitation: 0,
      humidity: 0.34,
      wind: 0,
   },
   {
      date: '23 Mar 2023',
      name: 'Wednesday',
      nameShort: 'wed',
      degree: 32,
      weather: 'rain',
      precipitation: 0.5,
      humidity: 0.34,
      wind: 0,
   },
   {
      date: '24 Mar 2023',
      name: 'Thusday',
      nameShort: 'thr',
      degree: 45,
      weather: 'cloudy',
      precipitation: 0.1,
      humidity: 0.34,
      wind: 0,
   },
   {
      date: '25 Mar 2023',
      name: 'Fryyay',
      nameShort: 'fri',
      degree: 56,
      weather: 'sunny',
      precipitation: 0,
      humidity: 0.34,
      wind: 0,
   }
]

var dayIndex = 0

function onClickDay() {
   dayIndex = Number(this.getAttribute('index'))
   render()
}

render()
function render() {
   console.log(days)
   console.log(currentDay)
   var currentDay = days[dayIndex]

   // update day component
   todayDayName.innerHTML = currentDay.name
   todayDate.innerHTML = currentDay.date
   todayTemp.innerHTML = currentDay.degree
   todayWeather.innerHTML = currentDay.weather

   // update details component
   detailsPrecipitation.innerHTML = currentDay.precipitation
   detailsHumidity.innerHTML = currentDay.humidity
   detailsWind.innerHTML = currentDay.wind

   // days list component
   var daysListCurrent = daysList.querySelector('.active')
   daysListCurrent.classList.remove('active')
   var daysListNext = daysList.querySelector(`[index="${dayIndex}"]`)
   daysListNext.classList.add('active')

   var i = 0;
   for (var day of days) {
      var htmlDay = daysList.querySelector(`[index="${i}"]`)
      var htmlDayName = htmlDay.querySelector('.label')
      var htmlDayTemp = htmlDay.querySelector('.temp .num')
      htmlDayName.innerHTML = day.nameShort
      htmlDayTemp.innerHTML = day.degree

      i = i + 1
   }
} 