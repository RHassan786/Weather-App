
let HotORCold=(temp)=>{
    let tempClass= temp>30? "hot":"cold";
    return tempClass;
}

let WeatherColor=(Code)=>{
    if(Code<2)
    {
        return "sunVisible";
    }
    else if(Code===2 || Code===3)
    {
        return "cloudy";
    }
    else if(Code===71 || Code===73 || Code===75)
    {
        return "snow"

    }
    else if(Code===61||Code===63||Code===65||Code===80||Code===81||Code===82||Code===51||Code===53||Code===55)
    {
         return "rain"
    }
    else if(Code===95||Code===96||Code===99)
    {
        return "thunder";
    }
    else if(Code===45 || Code===48)
    {
        return "Fog";
    }
    else
    {
        return "Unable to Interpret";
    }
}

let WeatherCode=(code)=>{
    if(code===0)
    {
        return "☀️ Clear Sky"
    }
    else if(code===1)
    {
        return "🌤️ Mainly Clear";
    }
    else if(code===2)
    {
        return "⛅ Partly Cloudy";
    }
    else if(code===3)
    {
        return "☁️ Overcast";
    }
    else if(code===61)
    {
        return "🌦️ Slight Rain";
    }
    else if(code===63)
    {
        return "🌧️ Moderate Rain";
    }
    else if(code===65)
    {
        return "🌧️ Rain with Heavy Intensity";
    }
    else if(code===80)
    {
        return "🌦️ Slight Rain Showers";
    }
    else if(code===81)
    {
        return "🌧️ Moderate Rain Showers";
    }
    else if(code===82)
    {
        return "🌧️ Violent Rain Showers";
    }
    else if(code===95)
    {
        return "⛈️ Slight Thunderstorm";
    }
    else if(code===96)
    {
        return "⛈️ Thunderstorm with slight Hail";
    }
    else if(code===99)
    {
        return "⛈️ Thunderstorm with Heavy Hail";
    }
    else if(code===71 || code===73 || code===75)
    {
        return "❄️ Snow Fall";
    }
    else if(code===51 || code===53 || code===55)
    {
        return "🌦️ Drizzle";
    }
    else if(code===45 || code===48)
    {
       return "🌫️ Fog"
    }
    else{
        return "🌡️ Unable to Interpret";
    }
}




let SearchBtn=document.getElementById("search");
let input=document.getElementById("input");
let output=document.getElementById("output");
  let data;
SearchBtn.addEventListener("click",async ()=>{
 try{

    ///man fix it 
    output.classList.remove("error");

    SearchBtn.disabled=true;
 output.classList.add("outputResult");
    output.innerHTML=`<div class="loading"> Loading... </div>`;

    let response=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${input.value}`);
    if(!response.ok)
    {
        throw new Error(`Something Went Wrong: ${response.status}`);
    }

    console.log("response fetched");

      data=await response.json();
      console.log("Took data from JSON");

    

    if(data.results.length===0||!data.results)
    {
        throw new Error("City Not Found");
    }

    let SecResponse=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${data.results[0].latitude}&longitude=${data.results[0].longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature`);
     
    
    console.log("Second Response Successful");
    
    let WeatherData=await SecResponse.json();

    console.log("WeatherData Returned");
    console.log(WeatherData);
    output.classList.remove("loading");

    output.classList.add("result");
    output.classList.add("outputResult");
    output.innerHTML=` 
    
    <div id="cityName"> ${data.results[0].name}</div>
     <div class="${HotORCold(WeatherData.current.temperature_2m)} Data">  Temperature : ${WeatherData.current.temperature_2m}°C </div>
        <div class="windSpeed Data">  Wind Speed :  ${WeatherData.current.wind_speed_10m} km/h                   </div>
        <div class="humidity Data"> Humidity: ${WeatherData.current.relative_humidity_2m} % </div>
        <div class="${HotORCold(WeatherData.current.apparent_temperature)} Data">  Feels Like : ${WeatherData.current.apparent_temperature}°C </div>
        <div id="weatherCode" class="${WeatherColor(WeatherData.current.weather_code)} Data"> ${WeatherCode(WeatherData.current.weather_code)}</div>
        <button id="WeeklyBtn"> Show Weekly Forecast </button>            `


  
 }
 catch(error)
 {
   
    console.log("error occured");
   

 output.classList.add("outputResult");
   output.innerHTML=`<div class="error"> ${error.message}</div>`;
   
   
 }
 finally{
 SearchBtn.disabled=false;
 output.classList.remove("loading")

 }


})

 let weekly=document.getElementById("weekly");

output.addEventListener("click",async (event)=>{
    weekly.classList.remove("weeklyError");
    weekly.classList.remove("resultWeekly");

   weekly.classList.add("loadingState");
    weekly.innerHTML=`<div class="weeklyLoading "> Loading...  </div>`
    event.target.disabled=true;
    if(event.target===document.getElementById("WeeklyBtn"))
    {
        
      try{
        console.log("Entered Weekly Try")
          let weeklyForecast=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${data.results[0].latitude}&longitude=${data.results[0].longitude}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,apparent_temperature_max,apparent_temperature_min,wind_speed_10m_max,weather_code&timezone=auto&forecast_days=7`);
           console.log("fetched weekly results")
           if(!weeklyForecast.ok)
    {
        throw new Error(`Something Went Wrong: ${weeklyForecast.status}`);
    }
           
            let weeklyData=await weeklyForecast.json();

            let Days=[];
            for(let i=0;i<7;i++)
            {
                let dateObj=new Date(weeklyData.daily.time[i]);
                Days[i]=dateObj.toLocaleDateString("en-US", { weekday: "long" });
            }
             console.log(weeklyData);

             weekly.classList.add("resultWeekly");
            

                     let cardsHTML = "";
        for (let i = 0; i < 7; i++) {
            cardsHTML += `
                <div class="weeklyCard">
                    <div class="day">${Days[i]}</div>
                    <div class="${HotORCold(weeklyData.daily.temperature_2m_mean[i])} WeeklyData">
                        <div>Temperature:</div> <div> ${weeklyData.daily.temperature_2m_max[i]}/${weeklyData.daily.temperature_2m_min[i]} </div>
                    </div>
                    <div class="${WeatherColor(weeklyData.daily.weather_code[i])} WeeklyData">
                        ${WeatherCode(weeklyData.daily.weather_code[i])}
                    </div>
                </div>
            `;
        }
        weekly.classList.remove("loadingState");
        weekly.innerHTML=cardsHTML;


            // weekly.innerHTML=`    <div class="weeklyCard"> <div class="day"> ${Days[0]}  </div> <div class="        ${HotORCold(weeklyData.daily.temperature_2m_max[0])} WeeklyData"> Temperature: ${weeklyData.daily.temperature_2m_max[0]}/${weeklyData.daily.temperature_2m_min[0]} </div>   <div class="${WeatherColor(Data.daily.weather_code[0])} WeeklyData"> ${WeatherCode(weeklyData.daily.weather_code[0])}</div>  </div>
            //                               <div class="weeklyCard"> <div class="day"> ${Days[1]}  </div> <div class="${HotORCold(weeklyData.daily.temperature_2m_max[1])} WeeklyData"> Temperature: ${weeklyData.daily.temperature_2m_max[1]}/${weeklyData.daily.temperature_2m_min[1]} </div>   <div class="${WeatherColor(Data.daily.weather_code[1])} WeeklyData"> ${WeatherCode(weeklyData.daily.weather_code[1])}</div>  </div>
            //                               <div class="weeklyCard"> <div class="day"> ${Days[2]}  </div> <div class="${HotORCold(weeklyData.daily.temperature_2m_max[2])} WeeklyData"> Temperature: ${weeklyData.daily.temperature_2m_max[2]}/${weeklyData.daily.temperature_2m_min[2]} </div>   <div class="${WeatherColor(Data.daily.weather_code[2])} WeeklyData"> ${WeatherCode(weeklyData.daily.weather_code[2])}</div>  </div>
            //                               <div class="weeklyCard"> <div class="day"> ${Days[3]}  </div> <div class="${HotORCold(weeklyData.daily.temperature_2m_max[3])} WeeklyData"> Temperature: ${weeklyData.daily.temperature_2m_max[3]}/${weeklyData.daily.temperature_2m_min[3]} </div>   <div class="${WeatherColor(Data.daily.weather_code[3])} WeeklyData"> ${WeatherCode(weeklyData.daily.weather_code[3])}</div>  </div>
            //                               <div class="weeklyCard"> <div class="day"> ${Days[4]}  </div> <div class="${HotORCold(weeklyData.daily.temperature_2m_max[4])} WeeklyData"> Temperature: ${weeklyData.daily.temperature_2m_max[4]}/${weeklyData.daily.temperature_2m_min[4]} </div>   <div class="${WeatherColor(Data.daily.weather_code[4])} WeeklyData"> ${WeatherCode(weeklyData.daily.weather_code[4])}</div>  </div>
            //                               <div class="weeklyCard"> <div class="day"> ${Days[5]}  </div> <div class="${HotORCold(weeklyData.daily.temperature_2m_max[5])} WeeklyData"> Temperature: ${weeklyData.daily.temperature_2m_max[5]}/${weeklyData.daily.temperature_2m_min[5]} </div>   <div class="${WeatherColor(Data.daily.weather_code[5])} WeeklyData"> ${WeatherCode(weeklyData.daily.weather_code[5])}</div>  </div>
            //                               <div class="weeklyCard"> <div class="day"> ${Days[6]}  </div> <div class="${HotORCold(weeklyData.daily.temperature_2m_max[6])} WeeklyData"> Temperature: ${weeklyData.daily.temperature_2m_max[6]}/${weeklyData.daily.temperature_2m_min[6]} </div>   <div class="${WeatherColor(Data.daily.weather_code[6])} WeeklyData"> ${WeatherCode(weeklyData.daily.weather_code[6])}</div>  </div>`;
        }
        catch(error)
        {
            weekly.classList.remove("resultWeekly");
           weekly.classList.remove("loadingState");
           weekly.classList.add("weeklyError");
          weekly.innerHTML=`<div > ${error.message}  </div>`;
        }
        finally{
            
          weekly.classList.remove("loadingState");
          
          event.target.disabled=false;
        }
    }
})