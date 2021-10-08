import React, { useState, useEffect } from "react";
import "./App.css";
import { MenuItem, FormControl, Select } from '@mui/material';


function App() {
  // State = how to write a variable in React
  const [countries, setCountries ] = useState([]);
  const [country, setCountry] = useState('worldwide');

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
  }

  return (
    <div className="app"> {/* BEM Naming Convention */}
      <div className="app__header">
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
      
      
      {/* Header */}
      {/* Title & Select input dropdown field */}

      {/* Info Boxes */}
      {/* Info Boxes */}
      {/* Info Boxes */}

      {/* Table */}
      {/* Graph*/}

      {/* Map */}
    </div>
  );
}

export default App;
