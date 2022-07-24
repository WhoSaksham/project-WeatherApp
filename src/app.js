const http = require("http");
const fs = require("fs");
const requests = require('requests');
const port = process.env.PORT || 8000;

// Reading index.html
const homeFile = fs.readFileSync("src/index.html", "utf-8");

// Function to replace values from index.html
const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};

// Creating the node server
const server = http.createServer((req, res) => {
  if (req.url == "/") {
    // Reading the API 
    requests(
      `http://api.openweathermap.org/data/2.5/weather?q=agra&units=metric&appid=1132a8f72f516e8be73fb7e8cf7d8473`
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk); // parsing the json data into object data
        const arrData = [objdata]; // converting the  object data into an array
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val)) // calling the replaceVal function and changing values
          .join(""); // method to show string in output and not array
        res.write(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("Connection closed due to error/s", err);
        res.end();
      });
  } else {
    res.end("File not found");
  }
});

server.listen(port, '0.0.0.0');
console.log(`Server has successfully initiated on http://127.0.0.1:${port}`)