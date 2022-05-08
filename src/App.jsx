import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { Tooltip } from '@mui/material';
import moment from 'moment';
import {
  BrowserRouter as Router, Routes, Route, useParams, Link,
} from 'react-router-dom';

const getTime = () => {
  const currenTime = new Date();
  const hours = currenTime.getHours();

  if (hours >= 5 && hours <= 11) return 'Morning';
  if (hours >= 12 && hours <= 16) return 'Afternoon';
  if (hours >= 17 && hours <= 20) return 'Evening';
  if ((hours >= 21 && hours <= 23) || (hours >= 0 && hours <= 4)) return 'Night';
  return '';
};

function Weather() {
  const [data, setData] = useState();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const { place } = useParams();

  useEffect(() => {
    setQuery('');
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_API_KEY}&q=${place || 'Johor Bahru'}&days=3&aqi=no&alerts=no`)
      .then((res) => res.json())
      .then((d) => setData(d));
  }, [place]);

  useEffect(() => {
    setResults([]);
    if (query) {
      fetch(`https://api.weatherapi.com/v1/search.json?key=${import.meta.env.VITE_API_KEY}&q=${query}`)
        .then((res) => res.json())
        .then((d) => setResults(d));
    }
  }, [query]);

  return (data
    ? (
      <div className="flex h-full lg:h-screen tracking-wide flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 h-full bg-gradient-to-br from-[#53bfc9] to-cyan-500 flex flex-col justify-center p-12 500:p-20 text-white relative">
          <p className="text-xl ml-0.5">{moment(data.location.localtime_epoch * 1000).format('ddd, MMM D')}</p>
          <h1 className="text-5xl mt-12 tracking-wide">
            Good
            {' '}
            {getTime()}
            , Melvin!
          </h1>
          <p className="font-light mt-3 text-lg text-white opacity-70">Here&apos;s you weather telecast for today.</p>
          <img alt={data.current.condition.text} className="w-20 mt-8" src={data.current.condition.icon.replace('64x64', '128x128')} />
          <p className="flex items-center gap-2 text-xl mt-6 font-light">
            <Icon icon="fluent:location-28-filled" className="w-6 h-6" />
            {data.location.name}
          </p>
          <div className="400:items-center flex flex-col-reverse 400:flex-row justify-between 400:gap-20 mt-12 400:mt-0">
            <div>
              <p className="font-medium text-xl mt-6">{data.current.condition.text}</p>
              <p className="font-light text-sm mt-1">
                Feels like
                {' '}
                {data.current.feelslike_c}
                °C
              </p>
            </div>
            <p className="text-5xl font-medium mt-2">
              {data.current.temp_c}
              °C
            </p>
          </div>

          <Icon icon="mdi:apple-icloud" className="w-32 h-32 object1 text-white opacity-20 absolute top-16 left-12" />
          <Icon icon="mdi:apple-icloud" className="w-64 h-64 object2 text-white opacity-20 absolute top-32 right-24" />
          <Icon icon="mdi:apple-icloud" className="w-44 h-44 object3 text-white opacity-20 absolute bottom-16 left-20" />
          <Icon icon="mdi:apple-icloud" className="w-52 h-52 object4 text-white opacity-20 absolute bottom-32 right-64" />
          <svg className="absolute bottom-0 left-0 text-cyan-800 opacity-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="currentColor" fillOpacity="1" d="M0,256L288,224L576,160L864,256L1152,96L1440,128L1440,320L1152,320L864,320L576,320L288,320L0,320Z" /></svg>
        </div>
        <div className="w-full lg:w-1/2 h-full text-zinc-700 relative overflow-x-hidden lg:overflow-y-auto flex flex-col">
          <div className="flex ml-12 500:ml-24 items-end relative mt-8 500:mt-0">
            <input value={query} onChange={(e) => setQuery(e.target.value)} type="text" placeholder="Location" className="flex-1 border-b-2 border-zinc-200 placeholder-zinc-300 pb-3 text-xl focus:outline-none" />
            <div className="w-24 h-24 bg-[#53bfc9] flex-shrink-0 items-center justify-center hidden 500:flex">
              <Icon icon="uil:search" className="w-6 h-6 text-white" />
            </div>
            <div className="absolute bottom-0 rounded-b-md left-0 flex w-[calc(100%-6rem)] z-10 flex-col translate-y-full bg-white shadow-lg divide-y">
              {query && !results.length && <p className="py-3 px-4 text-center text-zinc-">No results</p>}
              {results.map((result) => (
                <Link className="py-3 px-4 w-full" to={`/${result.url}`}>{[result.name, result.region, result.country].filter((e) => e).join(', ')}</Link>
              ))}
            </div>
          </div>
          <div className="m-12 500:m-24 !my-12">
            <h2 className="font-medium text-2xl">Weather Details</h2>
            <div className="flex flex-col gap-6 mt-8">
              <div className="flex items-center justify-between text-lg">
                <Tooltip title={<span className="text-xs p-2 block font-light">Cloud cover (also known as cloudiness, cloudage, or cloud amount) refers to the fraction of the sky obscured by clouds on average when observed from a particular location.</span>}><span className="text-zinc-500 text-base">Cloudy</span></Tooltip>
                <span>
                  {data.current.cloud}
                  %
                </span>
              </div>
              <div className="flex items-center justify-between text-lg">
                <Tooltip title={<span className="text-xs p-2 block font-light">Humidity is the concentration of water vapour present in the air. Water vapor, the gaseous state of water, is generally invisible to the human eye. Humidity indicates the likelihood for precipitation, dew, or fog to be present. </span>}><span className="text-zinc-500 text-base">Humidity</span></Tooltip>
                <span>
                  {data.current.humidity}
                  %
                </span>
              </div>
              <div className="flex items-center justify-between text-lg">
                <Tooltip title={<span className="text-xs p-2 block font-light">Wind is moving air and is caused by differences in air pressure within our atmosphere. Air under high pressure moves toward areas of low pressure. The greater the difference in pressure, the faster the air flows.</span>}><span className="text-zinc-500 text-base">Wind</span></Tooltip>
                <span className="flex items-center">
                  <Icon
                    icon="typcn:location-arrow"
                    className="origin-center w-6 h-6"
                    style={{
                      transform: `rotate(${data.current.wind_degree - 45}deg)`,
                    }}
                  />
                  {data.current.wind_dir}
                  {' '}
                  @
                  {' '}
                  {data.current.wind_kph}
                  km/h
                </span>
              </div>
              <div className="flex items-center justify-between text-lg">
                <Tooltip title={<span className="text-xs p-2 block font-light">That pressure is called atmospheric pressure, or air pressure. It is the force exerted on a surface by the air above it as gravity pulls it to Earth. Atmospheric pressure is commonly measured with a barometer. In a barometer, a column of mercury in a glass tube rises or falls as the weight of the atmosphere changes.</span>}><span className="text-zinc-500 text-base">Pressure</span></Tooltip>
                <span>
                  {data.current.pressure_mb.toLocaleString()}
                  mb
                </span>
              </div>
              <div className="flex items-center justify-between text-lg">
                <Tooltip title={<span className="text-xs p-2 block font-light">In meteorology, visibility is a measure of the distance at which an object or light can be clearly discerned. It depends only on the transparency of the surrounding air; as such, it is unchanging no matter the ambient light level or time of day. </span>}><span className="text-zinc-500 text-base">Visibility</span></Tooltip>
                <span>
                  {data.current.vis_km}
                  km
                </span>
              </div>
              <div className="flex items-center justify-between text-lg">
                <Tooltip title={<span className="text-xs p-2 block font-light">gust, in meteorology, a sudden increase in wind speed above the average wind speed. More specifically, wind speed must temporarily peak above 16 knots (about 30 km per hour) after accelerating by at least 9–10 knots (about 17–19 km per hour) to qualify as a gust.</span>}><span className="text-zinc-500 text-base">Gust Wind Speed</span></Tooltip>
                <span>
                  {data.current.gust_kph}
                  km/h
                </span>
              </div>
            </div>
          </div>
          <div className="m-12 500:m-24 !mb-0 !mt-12">
            <h2 className="font-medium text-2xl">Forecasts</h2>
            <div className="flex flex-col gap-5 mt-8">
              {data.forecast.forecastday.map((day) => (
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">{moment(day.date_epoch * 1000).format('ddd, MMM D')}</span>
                  <img alt={day.day.condition.text} src={day.day.condition.icon.replace('64x64', '128x128')} className="w-12 h-12" />
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-center mb-4 mt-12 flex-1 h-full flex items-end justify-center">Made with 💖 by MRGA. Project under MIT license.</p>
        </div>
      </div>
    )
    : '');
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Weather />} />
        <Route path="/:place" element={<Weather />} />
      </Routes>
    </Router>
  );
}

export default App;
