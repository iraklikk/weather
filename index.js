// variables
const cityDisp = document.querySelector('.city');
const dateDisp = document.querySelector('.date');
const input = document.querySelector('.search-bar');
const tempDisp = document.querySelector('.current');
const maxMin = document.querySelector('.max-min');
const description = document.querySelector('.description');
const hourlyP = document.querySelector('.hourly');
const dailyP = document.querySelector('.daily');
const detailsP = document.querySelector('.details');
const indicator = document.querySelector('.indicator');
const infoContainer = document.querySelector('.info-container-two');
const temps = document.querySelectorAll('.hour-info-wrapper p')
const skycons = document.querySelectorAll('.hour-info-wrapper .skycon-two');
const days = document.querySelectorAll('.dialy-info-wrapper h4');
const dailySkycons = document.querySelectorAll('.dialy-info-wrapper .skycon-two');
const dailyTemp = document.querySelectorAll('.dialy-info-wrapper p');
const detailsC = document.querySelector('.details-container');

let tempC = 0;
let tempF = 0;
let tempTomorrowC = 0;
let tempTomorrowF = 0;
let tempAfterTomorrowC = 0;
let tempAfterTomorrowF = 0;
let maxC = 0;
let maxF = 0;
let minC = 0;
let minF = 0;
let city = 'tbilisi';
let hourlyC = [0, 0, 0, 0, 0, 0]
let hourlyF = [0, 0, 0, 0, 0, 0]
let dailyC = [tempC, 0, 0];
let dailyF = [tempF, 0, 0];
let dailyTempsC = []
let dailyTempsF = []

// functions
async function getUrl() {
   let weather = await fetch(`https://weatherapi-com.p.rapidapi.com/forecast.json?q=${city}&days=3`, {
      "method": "GET",
      "headers": {
         "x-rapidapi-key": "96265b79edmsh1bc832b4deba800p1216e3jsn731c5a5e32ae",
         "x-rapidapi-host": "weatherapi-com.p.rapidapi.com"
      }
   })
   let response = await weather.json();
   console.log(response)
   cityDisp.textContent = response.location.name
   dateDisp.textContent = getDate();
   tempC = Math.round(response.current.temp_c);
   tempF = Math.round(response.current.temp_f);
   maxC = Math.round(response.forecast.forecastday[0].day.maxtemp_c);
   maxF = Math.round(response.forecast.forecastday[0].day.maxtemp_f);
   minC = Math.round(response.forecast.forecastday[0].day.mintemp_c);
   minF = Math.round(response.forecast.forecastday[0].day.mintemp_f);
   tempDisp.innerHTML = `${tempC}<span>°</span><span class="sign">C</span>`;
   maxMin.innerHTML = `${maxC}<span>°</span>/${minC}<span>°</span>`;
   description.textContent = response.current.condition.text;
   getIcon();
   generateTime();
   generateHourlyTemperature(response);
   generateHourlySkycon(response);
   generateDay(response);
   generateDailyTemperature(response);
   generateDailySkycon(response);
   generateDetails(response);
}

function submit(event) {
   if (event.key == 'Enter') {
      console.log(this.value)
      city = this.value;
      console.log(city)
      this.value = '';
   }
   getUrl()
}

function getHourly() {
   indicator.style.marginLeft = '0px';
   infoContainer.style.marginLeft = '0%'
}

function getDaily() {
   indicator.style.marginLeft = '45px';
   infoContainer.style.marginLeft = '-100%'
}

function getDetails() {
   indicator.style.marginLeft = '95px';
   infoContainer.style.marginLeft = '-200%'
}

function toggleCF() {
   console.log(this.classList)
   let sign = this.querySelector('.sign')
   if (sign.textContent == "C") {
      tempDisp.innerHTML = `${tempF}<span>°</span><span class="sign">F</span>`
      maxMin.innerHTML = `${maxF}<span>°</span>/${minF}<span>°</span>`;
      for (let i = 0; i < temps.length; i++) {
         temps[i].textContent = `${hourlyF[i]} °`
      }
      for (let i = 0; i < dailyTemp.length; i++) {
         dailyTemp[i].textContent = `${dailyTempsF[i]} °`;
      }
   } else {
      tempDisp.innerHTML = `${tempC}<span>°</span><span class="sign">C</span>`
      maxMin.innerHTML = `${maxC}<span>°</span>/${minC}<span>°</span>`;
      for (let i = 0; i < temps.length; i++) {
         temps[i].textContent = `${hourlyC[i]} °`
      }
      for (let i = 0; i < dailyTemp.length; i++) {
         dailyTemp[i].textContent = `${dailyTempsC[i]} °`;
      }
   }
}

getUrl()

function getDate() {
   let months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
   ]


   let date = new Date();
   let month = months[date.getMonth()]
   let day = date.getDate()
   let year = date.getFullYear()

   return `${month} ${day}, ${year}`
}

getDate()

function generateDetails(response) {
   let info = response.current;
   console.log(info)
   detailsC.querySelector('.humidity').textContent = `Humidity: ${info.humidity}Rh`
   detailsC.querySelector('.wind-deg').textContent = `Wind degree: ${info.wind_degree}°`
   detailsC.querySelector('.wind-speed').textContent = `Wind Speed: ${info.wind_kph}km/h`
   detailsC.querySelector('.pressure').textContent = `Pressure: ${info.pressure_mb}Pa`;
}


function generateTime() {
   let time = new Date()
   let now = time.getHours()
   let headers = infoContainer.querySelectorAll('.hourly-container-two h4')


   for (let i = 1; i < headers.length; i++) {
      let time = now + i;
      time %= 24;
      if (time == 0) {
         headers[i].textContent = `12PM`;
      } else if (time <= 12) {
         headers[i].textContent = `${time}AM`
      } else {
         headers[i].textContent = `${time - 12}PM`
      }
   }

}

function generateDay(response) {
   let months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
   ]
   let info = response.forecast.forecastday;
   let dates = []

   for (let i = 0; i < info.length; i++) {
      dates.push(info[i].date);
   }


   for (let i = 0; i < dates.length; i++) {
      dates[i] = dates[i].substring(5)
      dates[i] = dates[i].split('-')
   }

   for (let i = 1; i < days.length; i++) {
      let month = months[parseInt(dates[i][0]) - 1]
      let day = dates[i][1];
      days[i].innerText = `${day} ${month}`
   }

}


function generateHourlyTemperature(response) {
   let time = new Date();
   let now = time.getHours() - 2;
   let hourForecast = response.forecast.forecastday[0].hour

   for (let i = 0; i < temps.length; i++) {
      let hour = now + i;
      if (hour >= 24) {
         hour -= 24;
      }
      hourlyC[i] = hourForecast[hour].temp_c;
      hourlyF[i] = hourForecast[hour].temp_f;
      temps[i].textContent = `${hourlyC[i]} °`
   }
}


function generateDailyTemperature(response) {
   let info = response.forecast.forecastday;


   for (let i = 0; i < info.length; i++) {
      dailyTempsC.push(info[i].day.avgtemp_c)
      dailyTempsF.push(info[i].day.avgtemp_f)
   }

   for (let i = 0; i < dailyTemp.length; i++) {
      dailyTemp[i].textContent = `${dailyTempsC[i]} °`;
   }
}

function generateDailySkycon(response) {
   let info = response.forecast.forecastday;

   for (let i = 0; i < dailySkycons.length; i++) {
      let description = info[i].day.condition.text;

      switch (description) {
         case "Heavy snow":
            dailySkycons[i].innerHTML = `
            <div class="a-v2"></div>
            <div class="b-v2"></div>
            <div class="c-v2"></div>
            <div class="snowflake-v2"></div>
            <div class="snowflake-v2 snowflake-v2-two"></div>
            <div class="snowflake-v2 snowflake-v2-three"></div>
            <div class="snowflake-v2 snowflake-v2-four"></div>
            <div class="snowflake-v2 snowflake-v2-five"></div>
            <div class="snowflake-v2 snowflake-v2-six"></div>
            `
            break;
         case "Partly cloudy":
            dailySkycons[i].innerHTML = `
               <div class="sun-v2"></div>
               <div class="a-v2"></div>
               <div class="b-v2"></div>
               <div class="c-v2"></div>
               `
            break;
         case 'Cloudy':
            dailySkycons[i].innerHTML = `
               <div class="a-v2"></div>
               <div class="b-v2"></div>
               <div class="c-v2"></div>
               `
            break;
         case 'Sunny':
            dailySkycons[i].innerHTML = `
            <div class="sun-v2"></div>
            `
            break;
         case 'Mist', 'Overcast':
            dailySkycons[i].innerHTML = `
               <div class="a-v2"></div>
               <div class="b-v2"></div>
               <div class="c-v2"></div>
               <div class="rain-v2"></div>
               <div class="rain-v2 rain-two-v2"></div>
               <div class="rain-v2 rain-three-v2"></div>
               <div class="rain-v2 rain-four-v2"></div>
               `
            break;

      }

   }
}

function generateHourlySkycon(response) {
   let hourForecast = response.forecast.forecastday[0].hour;
   let time = new Date()
   let now = time.getHours() - 1

   for (let i = 0; i < skycons.length; i++) {
      let hour = now + i;
      if (hour >= 24) {
         hour -= 24
      }
      let description = hourForecast[hour].condition.text;
      switch (description) {
         case "Heavy snow":
            skycons[i].innerHTML = `
            <div class="a-v2"></div>
            <div class="b-v2"></div>
            <div class="c-v2"></div>
            <div class="snowflake-v2"></div>
            <div class="snowflake-v2 snowflake-v2-two"></div>
            <div class="snowflake-v2 snowflake-v2-three"></div>
            <div class="snowflake-v2 snowflake-v2-four"></div>
            <div class="snowflake-v2 snowflake-v2-five"></div>
            <div class="snowflake-v2 snowflake-v2-six"></div>
            `
            break;
         case "Partly cloudy":
            skycons[i].innerHTML = `
               <div class="sun-v2"></div>
               <div class="a-v2"></div>
               <div class="b-v2"></div>
               <div class="c-v2"></div>
               `
            break;
         case 'Cloudy':
            skycons[i].innerHTML = `
               <div class="a-v2"></div>
               <div class="b-v2"></div>
               <div class="c-v2"></div>
               `
            break;
         case 'Sunny':
            skycons[i].innerHTML = `
            <div class="sun-v2"></div>
            `
            break;
         case 'Mist', 'Overcast':
            skycons[i].innerHTML = `
               <div class="a-v2"></div>
               <div class="b-v2"></div>
               <div class="c-v2"></div>
               <div class="rain-v2"></div>
               <div class="rain-v2 rain-two-v2"></div>
               <div class="rain-v2 rain-three-v2"></div>
               <div class="rain-v2 rain-four-v2"></div>
               `
            break;

      }
   }
}



function getIcon() {
   const skycon = document.querySelector('.skycon');
   switch (description.textContent) {
      case "Partly cloudy":
         skycon.innerHTML = `
         <div class="sun"></div>
         <div class="a"></div>
         <div class="b"></div>
         <div class="c"></div>
         `
         break;
      case 'Cloudy':
         skycon.innerHTML = `
         <div class="a"></div>
         <div class="b"></div>
         <div class="c"></div>
         `
         break;
      case 'Sunny':
         skycon.innerHTML = `
         <div class="sun"></div>
         `
         break;
      case 'Mist', 'Overcast':
         skycon.innerHTML = `
         <div class="a"></div>
         <div class="b"></div>
         <div class="c"></div>
         <div class="rain"></div>
         <div class="rain rain-two"></div>
         <div class="rain rain-three"></div>
         <div class="rain rain-four"></div>
         `
         break;
      case "Heavy snow":
         skycon.innerHTML = `
         <div class="a"></div>
         <div class="b"></div>
         <div class="c"></div>
         <div class="snowflake"></div>
         <div class="snowflake snowflake-two"></div>
         <div class="snowflake snowflake-three"></div>
         <div class="snowflake snowflake-four"></div>
         <div class="snowflake snowflake-five"></div>
         <div class="snowflake snowflake-six"></div>
         `
   }
}





input.addEventListener('keydown', submit);
tempDisp.addEventListener('click', toggleCF);
hourlyP.addEventListener('click', getHourly);
dailyP.addEventListener('click', getDaily);
detailsP.addEventListener('click', getDetails);