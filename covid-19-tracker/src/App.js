import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from '@mui/material';
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Table from "./Table";
import { sortData } from "./util";
import numeral from "numeral";
// import Map from "./Map";
// import "leaflet/dist/leaflet.css";


function App(){
  // State = how to write a variable in React
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
 //  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  // const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  // const [mapZoom, setMapZoom] = useState(3);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);


  // useEffect = Runs a piece of code based on a given condition
  useEffect(() =>{
    // Code inside here will run once when the component loads and not again
      // async -> send a request, wait for it and then do something with the info
      const getCountriesData = async () => {
        fetch("https://disease.sh/v3/covid-19/countries")
          .then((response) => response.json())
          .then((data) => {
            const countries = data.map((country) => ({
              name: country.country,
              value: country.countryInfo.iso2,
            }));
            
            const sortedData = sortData(data);
            setCountries(countries);
            // setMapCountries(data);
            setTableData(sortedData);
            
          });
      };
  
      getCountriesData();
    }, []);
  
  console.log(casesType);
  
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
      await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        // All of the data from the country response
        setCountryInfo(data);
        //setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
       // setMapZoom(4);
      });
  }

  return (
    <div className="app"> {/* BEM Naming Convention */}
      <div className="app__left">
        <div className="app__header">
          {/* Header - Title & Select input dropdown field */}
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
                {/* Loop through all countries and show a drop down of the options */}
                <MenuItem value="worldwide">Worldwide</MenuItem>
                {
                  countries.map((country) => (
                    <MenuItem value={country.value}>{country.name}</MenuItem>
                  ))
                }

            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
        <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            cases={(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>
        <h1>Map</h1>
      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
              <h3>Live Cases by Country</h3>
              <Table countries={tableData} />
              <h3>Worldwide new {casesType}</h3>
              <LineGraph casesType={casesType} />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
