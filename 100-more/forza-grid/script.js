var templateCard = document.querySelector('.templateCard')
var container = document.querySelector('.cards')
console.log(templateCard)

for (var i = 0; i < 10; i++) {
   var clone = templateCard.content.cloneNode(true)
   var color = [
      'pink',
      'yellow',
      'orange',
   ][Math.floor(Math.random()*3)]
   clone.querySelector('.card').classList.add(color)
   var image = [
      "../_assets/images/background-vector-mountains.jpg",
      "../_assets/images/hero-forza-1.png",
      "../_assets/images/placeholder-blue.png",
      "../_assets/images/placeholder-orange.png",
      "../_assets/images/placeholder-purple.png",
   ][Math.floor(Math.random()*5)]

   var title = [
      "FORZA MOTORSPORT'S DRIVING EXPERIENCE IS A COOL EXPERIENCE",
      "The holiday celebrations may be over, however your 2023 driving adventures are already warming up! This is #FORDzathon, available now.",
      "See what's new in Forza Horizon and Forza Motorsport by browsing our collection of blogs and videos giving you the latest updates from the teams at Turn 10 Studios and Playground Games."
   ][Math.floor(Math.random()*3)]
   

   clone.querySelector('.card img').src = image
   clone.querySelector('.card .h2').innerHTML = title
   container.append(clone)
}