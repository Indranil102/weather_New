import { useEffect, useRef, useState } from 'react';
import './Weather.css';
import { CiSearch } from "react-icons/ci";

const Weather = () => {
    const inputRef = useRef();
    const [weatherData, setWeatherData] = useState('');
    const [backimg, setBackImg]= useState(null);
    const [icons, setIcons]= useState({icons:null});
    const [forecast, setForcast]=useState([]);
    

    const search = async (city) => {
        if (!city) {
            alert("Enter a city name!");
            return;
        }

        const formatDate = (timestamp) => {
            const date = new Date(timestamp * 1000);
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            const options = { hour: 'numeric', minute: 'numeric', hour12: true };
            const timeString = date.toLocaleTimeString([], options);
          
            if (date >= today && date < tomorrow) {
              return `Today at ${timeString}`;
            } else if (date >= tomorrow && date < new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate() + 1)) {
              return `Tomorrow at ${timeString}`;
            } else {
              return date.toLocaleDateString() + ' at ' + timeString;
            }
          };

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const response = await fetch(url);
            const data = await response.json();
            setWeatherData(data);
            console.log(data);
            if (!response.ok) {
                throw new Error("city not exist");
            
            }
            const api_key = "adc390e108e66ab3771e17adab3aec79";
           
            const forecastapi =` https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}`;
            const FResponse = await fetch(forecastapi);
            const FData = await FResponse.json();
            console.log(FData);

                const tempe=[], icone=[], desp=[], dateTime=[];
            for (let i = 0; i < 40; i++) {
                icone.push(
                  `https://openweathermap.org/img/wn/${FData.list[i].weather[0].icon}.png`
                );
                tempe.push((FData.list[i].main.temp - 273).toFixed(0));
                desp.push(FData.list[i].weather[0].description);
                dateTime.push(formatDate(FData.list[i].dt));
            }
            setForcast({t:tempe,
                dsc:desp,
                dt:dateTime,

            })

            


            const WeatherIcons =`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
            setIcons({icon:WeatherIcons});
            const BgImg={
                'broken clouds': 'broken_clouds.jpg',
                'clear sky': 'clear_sky.jpg',
                'few clouds': 'few_clouds.jpg',
                'fog':'fog.jpg',
                'mist':'mist.jpg',
                'rain':'rain.jpg',
                'scattered cloud':'scattered_cloud.jpg',
                'shower rain':'shower_rain.jpg',
                'snow':'snow.jpg',
                'thunderstorm':'thunderstorm.jpg',
                'icon':'WeatherIcons',
            };
            setBackImg(
                `./Images/${BgImg[data.weather[0].description.toLowerCase()]||'snow.jpg'}`
            );

        } catch (error) {
            console.error("Error fetching weather data:", error);
            alert("An error occurred while fetching weather data.");
        
        } 
    };

    useEffect(() => {
      
        search('Guna')
      
    }, []);

    return (
        <div className='weather' style={{backgroundImage:`url(${backimg})`}}>
            <div className="highlight-temp">
                <h1>{weatherData && weatherData.main ? (weatherData.main.temp).toFixed(0) : 'Loading...'} °C </h1>
                
                    <div className='time-name'>
                    <p>{weatherData.name}</p> 
                        <p>{}</p>
                        
                    </div>
                    
                    <div className='time-details'> 
                       
                        <img src={icons.icon} alt="" />
                        <p id='mood'>{weatherData && weatherData.weather[0] ? weatherData.weather[0].description : ''}</p>
                    </div>
                
            </div>
            <div className="display-weather">
                <form>
                    <label htmlFor="enter location"></label>
                    <input id ='city' ref={inputRef} type="text" placeholder='Enter City' />
                    <span><CiSearch size={26} fontWeight={20} onClick={() => search(inputRef.current.value)}
                        style={{ cursor: 'pointer' }}/></span>
                </form>
                <div className='weather-details'>
                    <h4>Weather Details</h4>
                    <div className='sub-weather-details'>
                        <p>Max Temperature</p> <span>{weatherData && weatherData.main ? weatherData.main.temp_max : ''}°C
                            
                        </span>
                    </div>
                    <div className='sub-weather-details'>
                        <p>Min Temperature</p> <span>{weatherData && weatherData.main ? weatherData.main.temp_min : ''}°C</span>
                    </div>
                    <div className='sub-weather-details'>
                        <p>Humidity</p><span>{weatherData && weatherData.main ? weatherData.main.humidity : ''}%</span>
                    </div>
                    {/* <div className='sub-weather-details'>
                        <p>Min Temperature</p> <span>{weatherData && weatherData.main ? weatherData.main.temp_max : ''}</span>
                    </div> */}
                    <div className='sub-weather-details'>
                        <p>wind</p> <span>{weatherData && weatherData.wind ? weatherData.wind.speed : ''}%</span>
                    </div>
                    <hr />
                </div>
            
                <h4 className='h4'>Weather Forecast</h4>
                    <div className='forecast-details'>
                        {
                            
                            
                            forecast.t?.slice(0,40).map((icon,index)=>(
                                <div className='more' key={index}>
                                   <div className="weather-forecast-detals" >
                                      <img src={icons.icon} alt="" />

                                      <div>
                                      <p>{forecast.dt? forecast.dt[index]: " "}</p>
                                     

                                      <p>{forecast.dsc? forecast.dsc[index]: ""}</p>
                                      </div>
                                </div>

                                <div className='tj'>
                                   <p className='forcastid'>{forecast.t[index]}°C</p>
                                </div>
                        </div>
                        
                            )) 

                        }
        
                    </div>
                
            </div>
        </div>
    );
};

export default Weather;
