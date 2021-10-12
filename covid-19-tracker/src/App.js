import React, { useState, useEffect } from "react";
import InfoBox from "./InfoBox";
import Map from "./Map";
import { MenuItem, FormControl, Select, Card, CardContent } from '@mui/material';
import "./App.css";

function App() {
  // State = how to write a variable in React
  const [countries, setCountries ] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});

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
            
            setCountries(countries);
          });
      };
  
      getCountriesData();
    }, []);

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
      });
  }

  console.log('Country Info>', countryInfo);

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
          {/* Info Boxes */}
          <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
          <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
        </div>
        <Map />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          {/* Table */}
          <h3>Worldwide New Cases</h3>
          {/* Graph*/}

        </CardContent>
      </Card>
    </div>
  );
}

export default App;
