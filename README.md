# frontend

## Installation

```
npm install
```

## Build

```
ionic build
```

## Run the app in localhost (8100)

```
ionic serve
```
Visit http://localhost:8100 in your browser.

## Install the app on an android device

To install the app on an android, you must have android studio installed and configured.

This command will re-build the projet (if not already done), and launch android studio.
```
npm run android
```

You will then need to connect your android device to your computer, select it in android studio, and click on the "Launch app" button.

## Features 

### Home page :

Not implemented yet

### Cocktails list :

All the cocktails are displayed in a list. You can click on a cocktail to see its details and add it to your cart.
There is a "Personalize your cocktail" button that will open a modal to let you choose the bottles you want to add to your cocktail and type the quantity for each bottle.
In the header, there is a button to open a modal to see your cart.

### Order page :

If you haven't ordered yet, you can see the list of your cocktails and the total price of your cart. You can click on the "Validate your order" button to start your order.
If you have ordered, you can see your current status of your order on this page.

## Notes
- Ionic : 6.20.8
- Angular CLI: 15.1.1
- Node: 18.13.0
- npm: 8.19.3
