console.clear()
var templateTimer = document.getElementById('template-timer')
var eleTimers = document.getElementById('timers')


// uhhh
var oneSecond = 1000
var oneMinute = oneSecond * 60
var oneHour = oneMinute * 60
var oneDay = oneHour * 24


var now = Date.now()

// Used for getting the reference numbers
// console.log(now + (oneDay*2) + (oneHour*5) + (oneMinute*1) + (oneSecond*55))

// timer references
var timerRaid40Reference = 1770177599414
var timerOnyReference = 1770523198908
var timerKaraReference = 1770177601911
var timerRaid20Reference = 1770523196377

// console.log(timerRaid40Reference)

var timers = [
   {
      // resets in 2 Days, 5 hours
      title: 'Raid 40',
      raids: 'MC / BWL / AQ40 / Naxx / ES',
      reset: 'Resets every 7 days',
      reference: timerRaid40Reference,
      resetTime: oneDay*7,
      img: '../_assets/images/raid-mc.webp',
   },
   {
      title: 'Onyxia',
      raids: 'A dragon',
      reset: 'Resets every 5 days',
      reference: timerOnyReference,
      resetTime: oneDay*5,
      img: '../_assets/images/raid-ony.webp',
   },
   {
      title: 'Karazhan',
      raids: 'The tower of Kharazhan',
      reset: 'Resets every 5 days',
      reference: timerKaraReference,      
      resetTime: oneDay*5,
      img: '../_assets/images/raid-kara.webp',
   },
   {
      title: 'Raid 20',
      raids: 'ZG / AQ20',
      reset: 'Resets every 3 days',
      reference: timerRaid20Reference,      
      resetTime: oneDay*3,
      img: '../_assets/images/raid-zg.jpg',
   },
]

update()
setInterval(() => {
   update()
}, 1000)

function update() {
   eleTimers.innerHTML = ''
   for (var timerIndex in timers) {
      var timer = timers[timerIndex]

      // clone a template
      var newTemplate = document.importNode(templateTimer.content, true)

      // update the informating
      newTemplate.querySelector('.img').src = timer.img
      newTemplate.querySelector('.title').innerHTML = timer.title
      newTemplate.querySelector('.raids').innerHTML = timer.raids
      newTemplate.querySelector('.reset').innerHTML = timer.reset


      // calculate it?????
      var now = Date.now()
      var reference = timer.reference
      var resetTime = timer.resetTime
      
      var end = reference + resetTime
      var timeToReset = end - now
      
      var days = Math.floor(timeToReset / (oneDay))
      var hrs = Math.floor((timeToReset - (days*oneDay)) / oneHour)
      var mins = Math.floor((timeToReset - (days*oneDay) - (hrs*oneHour)) / oneMinute)
      var secs = Math.floor((timeToReset - (days*oneDay) - (hrs*oneHour) - (mins*oneMinute)) / oneSecond)
      console.log(days, hrs, mins, secs)


      // update timer
      newTemplate.querySelector('.when .days .top').innerHTML = days
      newTemplate.querySelector('.when .hrs .top').innerHTML = hrs
      newTemplate.querySelector('.when .mins .top').innerHTML = mins
      newTemplate.querySelector('.when .secs .top').innerHTML = secs
      
      // append it
      eleTimers.appendChild(newTemplate)
   }
}