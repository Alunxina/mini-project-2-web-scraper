// Required modules
const axios = require('axios');
const csv = require('@fast-csv/format');
const fs = require('fs');

// Different API URLs
const provinceUrl =
  'https://member.lazada.com.ph/locationtree/api/getSubAddressList';
const municipalityUrl =
  'https://member.lazada.com.ph/locationtree/api/getSubAddressList?addressId=';
const barangayUrl =
  'https://member.lazada.com.ph/locationtree/api/getSubAddressList?addressId=';

// Constant variables
const province = 'Iloilo';
const municipality = 'Iloilo City';

// Fetches data from API
function fetchProvinceData() {
  // Returns the promise if the province is found
  return new Promise((resolve, reject) => {
    axios
      .get(provinceUrl)
      .then(response => {
        const { module } = response.data;
        const iloiloProvinceResult = module.find(
          p => p && p.name.toLowerCase() === province.toLowerCase()
        );
        if (iloiloProvinceResult) {
          resolve(iloiloProvinceResult.id);
        } else {
          // Resolves with null if municipality is not found
          resolve(null);
        }
      })
      // Rejects promise if error has been found.
      .catch(error => {
        reject(error);
      });
  });
}

//Fetches data of Municipality from API
function fetchMunicipalityData(provinceId) {
  // Returns promise if the municipality data is found
  return new Promise((resolve, reject) => {
    axios
      .get(`${municipalityUrl}${provinceId}`)
      .then(response => {
        const { module } = response.data;
        const iloiloCityResult = module.find(
          m => m && m.name.toLowerCase() === municipality.toLowerCase()
        );
        if (iloiloCityResult) {
          resolve(iloiloCityResult.id);
        } else {
          //Resolves it with null if data is not found
          resolve(null);
        }
      })
      //Rejects promise if there is an error
      .catch(error => {
        reject(error);
      });
  });
}

// Fetches barangay data from API
function fetchBarangayData(provinceId) {
  // Returns the promise if barangay data is found
  return new Promise((resolve, reject) => {
    axios
      .get(`${barangayUrl}${provinceId}`)
      .then(response => {
        const { module } = response.data;

        const csvData = module.map(barangay => ({
          Name: barangay.name,
          ID: barangay.id,
          ParentID: provinceId
        }));

        const csvStream = csv.format({ headers: true });
        const writableStream = fs.createWriteStream('outputpromise.csv');

        csvStream.pipe(writableStream);
        //Writes data for each element in the array
        csvData.forEach(data => {
          csvStream.write(data);
        });
        //notifies the user that data has been written
        console.log('Data has been written to outputpromise.csv');
        csvStream.end();
        //Resolves the promise
        resolve();
      })
      //Rejects the promise if there is an error
      .catch(error => {
        reject(error);
      });
  });
}

// Dictates the flow of the fetching of data from API
fetchProvinceData()
  // Chains promises using then to fetch municipality data
  .then(provinceId => {
    if (provinceId) {
      return fetchMunicipalityData(provinceId);
    }
  })
  // Chains it once municipality data has been found to fetch the barangay data
  .then(municipalityId => {
    if (municipalityId) {
      return fetchBarangayData(municipalityId);
    }
  })
  // Catches errors, logs them to console
  .catch(error => {
    console.error(error);
  });
