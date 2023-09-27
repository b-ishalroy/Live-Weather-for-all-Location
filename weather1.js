const http = require("http");
const fs = require("fs");
var requests = require('requests');
const weatherHtmlFile = fs.readFileSync("weather1.html", "utf-8")
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

    return temperature;
}




const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests('https://api.openweathermap.org/data/2.5/weather?q=Agartala&appid=456cb4cf8855e6986c848f01f10e19e4')
            .on('data', (chunk) => {
                const pathmodule = JSON.parse(chunk);
                const arrData = [pathmodule]
                //const originalNumber = arrData[0].main.temp - 273;
                //const formattedNumber = originalNumber.toFixed(2);  //.tofixed used for used to format a number with a specific number of decimal places
                //console.log(formattedNumber)
                // console.log(arrData[0].main.temp- 273);
                const realTimeData = arrData.map((val) => replaceval(weatherHtmlFile, val)).join(" ");
                // console.log(realTimeData);
                res.write(realTimeData);

                

            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });
    }
});
server.listen(8000, "127.0.0.1")
