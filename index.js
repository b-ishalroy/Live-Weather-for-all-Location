const http = require("http");
const fs = require("fs");
var requests = require('requests');
const weatherHtmlFile = fs.readFileSync("index.html", "utf-8")
// console.log(weatherHtmlFile);

const replaceval = (tempval, orgval) => {
    // Format the temperature with two decimal places
    const formattedTemperature = (orgval.main.temp - 273.15).toFixed(2);
    const formattedMinTemp = (orgval.main.temp_min - 273.15).toFixed(2);
    const formattedMaxTemp = (orgval.main.temp_max - 273.15).toFixed(2);

    let temperature = tempval.replace("{%tempval%}", formattedTemperature);
    temperature = temperature.replace("{%tempmin%}", formattedMinTemp);
    temperature = temperature.replace("{%tempmax%}", formattedMaxTemp);
    temperature = temperature.replace("{%location%}", orgval.name);
    temperature = temperature.replace("{%tempstatus%}", orgval.weather[0].main);

    return temperature;
}




const server = http.createServer((req, res) => {
    if (req.url === '/') {
        if (req.method === 'POST') {
            let body = '';

            req.on('data', (data) => {
                body += data;
            });

            req.on('end', () => {
                const city = decodeURIComponent(body.split('=')[1]);
                const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=456cb4cf8855e6986c848f01f10e19e4`;

                requests(apiUrl)
                    .on('data', (chunk) => {
                        const pathmodule = JSON.parse(chunk);
                        const arrData = [pathmodule];
                        const realTimeData = arrData.map((val) => replaceval(weatherHtmlFile, val)).join(" ");
                        res.write(realTimeData);
                    })
                    .on('end', (err) => {
                        if (err) return console.log('connection closed due to errors', err);
                        res.end();
                    });
            });
        } else {
    // Render a form for user input
    res.write('<html><head><style>');
    res.write('body { font-family: Arial, sans-serif; text-align: center; }');
    res.write('form { margin: 20px auto; padding: 20px; border: 1px solid #ccc; width: 300px; }');
    res.write('input[type="text"] { width: 100%; padding: 10px; margin: 5px 0; }');
    res.write('input[type="submit"] { width: 100%; padding: 10px; background-color: #007BFF; color: #fff; border: none; cursor: pointer; }');
    res.write('</style></head><body>');
    res.write('<form method="post">');
    res.write('<h2>Weather Information</h2>');
    res.write('<input type="text" name="city" placeholder="Enter a city name">');
    res.write('<input type="submit" value="Get Weather">');
    res.write('</form>');
    res.write('</body></html>');
    res.end();
}

    }
});

server.listen(8000, "127.0.0.1");
