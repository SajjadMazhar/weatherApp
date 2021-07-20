const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    var mainData = tempVal.replace("{%tempval%}", Math.round(orgVal.main.temp - 273));
    mainData = mainData.replace("{%temp_max%}", Math.round(orgVal.main.temp_max - 273));
    mainData = mainData.replace("{%temp_min%}", Math.round(orgVal.main.temp_min - 273));
    mainData = mainData.replace("{%location%}", orgVal.name);
    mainData = mainData.replace("{%country%}", orgVal.sys.country);
    mainData = mainData.replace("{%weather%}", orgVal.weather[0].main);
    mainData = mainData.replace("{%windspeed%}", Math.round((orgVal.wind.speed)*(18/5)));
    mainData = mainData.replace("{%humid%}", orgVal.main.humidity);
    
    return mainData;

} 

const server = http.createServer((req, res) => {
    if (req.url == '/') {
        let apid = "https://api.openweathermap.org/data/2.5/weather?q=Kolkata&appid=cb5f6ffe24f31fc8184d357055b8c992"
        requests(apid)
            .on("data", (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData]
                const realTimeData = arrData.map(val => replaceVal(homeFile, val)).join("");
                res.write(realTimeData);
            })
            .on("end", (err) => {
                if (err) return console.log("connection closed due to error", err);
                res.end();
            });
    }
});

server.listen(8000, "127.0.0.1");