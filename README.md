# WeatherWindow

A Vue 3 + TypeScript proof of concept implementing the supplied WeatherWindow wireframes with live Open-Meteo data. The original Technology Demo Lab remains an independent page.

## Run in your existing lab folder

Use Node 24 LTS. In VS Code open the folder containing package.json, then run one command at a time:

```bash
node --version
npm ci
npm run dev
```

Open the exact local URL printed by Vite. That is the main WeatherWindow app. Append `demo.html` to the same base URL for the lab, for example `http://127.0.0.1:5173/demo.html`. No link to the lab appears in the main app. This is URL-only navigation, not password protection or access control.

The main app starts with city search; once a city is saved it restores the last city and fetches a fresh forecast. To see search again, choose Change. Use a real city, then adjust temperature, wind, and rain preferences. Unit switching preserves canonical Fahrenheit comparison values. Recent city history is based on your actual selections.

The product and lab use different localStorage keys. Lab preferences cannot overwrite product preferences. The old app is preserved in src/DemoLab.vue, with independent demo.ts and lab.css entry files. A multi-page Vite build produces index.html and demo.html, so direct URLs work on GitHub Pages without history-routing rewrites.

## What works

- Debounced city search and disambiguation with region/country, recent choices, loading, empty results, and retry.
- Live forecast request for 48 hourly slots starting with the current hour.
- Validated numeric and slider controls for minimum/maximum temperature, wind speed, and rain probability.
- Fahrenheit/Celsius display and input conversion, with mph wind and inches precipitation.
- Match count and accessible timeline states for matching, outside-limit, and unavailable hours.
- Chronological matching rows, mobile swipe cards, and an Adjust limits bottom-sheet dialog.
- Expanded comparisons and supporting weather fields where available.
- Automatic saving/restoring of city, unit, valid limits, and up to five recent cities.
- Forecast loading, failure with retained preferences, Retry, and Refresh.
- Preserved seven-experiment Demo Lab at /demo.html.

No private weather API key, login, sensor, server database, or paid weather plan is needed for a noncommercial prototype under the provider terms. 



## To run on mobile

1. Connect your Mac and phone to the same Wi-Fi network.
2. In VS Code, stop the server with Control+C.
3. Run:
   npm run dev -- --host 0.0.0.0
4. Find the Network address printed in the terminal. It will look similar to:
   http://192.168.1.25:5173/
5. Open that exact address in Safari or Chrome on your phone.
Use the Network address, rather than localhost or 127.0.0.1, on the phone. To open the separate lab, add demo.html to the address.

If the phone cannot connect, check that the server is still running, both devices are on the same Wi-Fi, and your Mac’s firewall allows Node.js connections. Use this on a trusted local network.
