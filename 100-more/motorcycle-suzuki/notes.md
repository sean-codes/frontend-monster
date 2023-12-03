# Suzuki Nav
This is a rewrite of the suzuki motorcycles navigation menu. It only incldues the desktop version as the larger part of the time spent on this project went into scrapping the motorcycle data.

Overall I appreciated the difficulty of building this UI. It had quite a few layers. Nav -> Category -> Bike -> Bike Display. 

This caused the javascript to get a bit tangled but in the end only ~100 lines felt fair and the performance was quite a bit improved over their production version. (mostly due to local image loading).


# Challenges

## Scrapping the Data
Getting the initial data from their site was not too difficult. Most of the bike data I needed was stored in data attributes.

After I got the categories and bikes for each category I looped over that in node to download a small and large image. I never really downloaded images in node and the documentation I was finding was streams based and not basic sync functions. After some poking I was able to put together a really simple image download

```js
const data = await fetch(imageUrl).then(d => d.arrayBuffer())
fs.writeFileSync('image.png', Buffer.from(data), 'utf-8')
```

## Javascript rendering using templates
Finding using javascript templates somewhat clunky. I did decide to make a `clonseTemplate` function to make it more comfortable to read. 

```
function cloneTemplate(template) {
   // forgot why I could not get the first element!
   return template.content.cloneNode(true).querySelector('div')
}
```


Using that you can get a new element using
```
const newDiv = cloneTemplate(templateElement)
```

## General organization of the pattern
Need to improve the overall pattern for these multi layer menus. The end result is performant and not too huge but readability and flow is all over the place :(
