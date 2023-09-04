const http=require('http');
const fs=require('fs');
var requests=require('requests');
const homeFile=fs.readFileSync("home.html","utf-8");
//const city=prompt("Enter your city name");
const replaceVal=(tempval,orgVal)=>{
    let temperature=tempval.replace("{%tempval%}",orgVal.main.temp);
    temperature=temperature.replace("{%tempmin%}",orgVal.main.temp_min);
    temperature=temperature.replace("{%tempmax%}",orgVal.main.temp_max);
    temperature=temperature.replace("{%location%},",orgVal.name);
    temperature=temperature.replace("{%country%}",orgVal.sys.country);
    temperature=temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
    return temperature;
}
const server=http.createServer((req,res)=>{
    if(req.url=="/")
    {
        requests('https://api.openweathermap.org/data/2.5/weather?q=gunupur&appid=d70681cca4d98d04932cee371ab781fc')
        .on('data',  (chunk)=> {
            const objData=JSON.parse(chunk);
            const arrData=[objData];
            //console.log(arrData[0].main.temp-273);
            const realTimeData=arrData.map((val)=>replaceVal(homeFile,val)).join("");
            res.write(realTimeData);
           // console.log(realTimeData);
        })
        .on('end',  (err) =>{
        if (err) return console.log('connection closed due to errors', err);
        
        res.end();
        });
    }
});
server.listen(8000,"127.0.0.1");