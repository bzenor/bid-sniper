# Bid Sniper

This project was created with jQuery 1.7 because that's what ebay still uses.

## Build

First step is to install minify
`npm i`

Then run minify
```npm run build```

## Usage

Copy the `sniper.min.js` file to your buffer/clipboard
```pbcopy < sniper.min.js```

Open the ebay listing, paste the code in the browser's Developer Tools Console tab.

Next create a new Sniper class by customizing your options and copy/paste the code into the console.
```var sniper = new Sniper({ maxBid: 300, timeWindow: 1, dryRun: false });```

## Options

Option | default | Description
--- | --- | --- | ---
maxBid | null | The max bid to place (minus shipping).
dryRun | true | When true, it fills out the input and does not submit the bid.
timeWindow | 3 | Indicates the seconds from zero time to place the bid.
increments | 0.5 | Default increment is 0.5, but can be customized.