// Modules used for the script
const axios = require('axios');
const csv = require('@fast-csv/format');
const fs = require('fs');

// URL to fetch data from the API
const provinceUrl =
  'https://member.lazada.com.ph/locationtree/api/getSubAddressList';
const municipalityUrl =
  'https://member.lazada.com.ph/locationtree/api/getSubAddressList?addressId=';
const barangayUrl =
  'https://member.lazada.com.ph/locationtree/api/getSubAddressList?addressId=';

// Province and municipality variables
const province = 'Iloilo';
const municipality = 'Iloilo City';

// Async function to retrieve the province data
async function fetchProvinceData() {
  try {
    // Uses axios.get to make an HTTP GET request
    const response = await axios.get(provinceUrl);
    // Extracts the module property from the response data
    const { module } = response.data;

    // Uses find to search for the province with the specified name
    const iloiloProvinceResult = module.find(
      p => p && p.name.toLowerCase() === province.toLowerCase()
    );
    if (iloiloProvinceResult) {
      // Prints out the province name and its id
      console.log(
        `Province: ${iloiloProvinceResult.name}, ID: ${iloiloProvinceResult.id}`
      );
      // Returns the id of iloilo province
      return iloiloProvinceResult.id;
    } else {
      // Error check if province is not found and return null
      console.log('Province not found.');
      return null;
    }
  } catch (error) {
    // Catch the errors
    console.error(error);
    return null;
  }
}

// Async function to retrieve the municipality data
// Takes in provinceId
async function fetchMunicipalityData(provinceId) {
  try {
    // Uses axios.get to make an HTTP GET request
    const response = await axios.get(`${municipalityUrl}${provinceId}`);
    // Extracts the module property from the response data
    const { module } = response.data;

    // Uses find to search for the municipality with the specified name
    const iloiloCityResult = module.find(
      m => m && m.name.toLowerCase() === municipality.toLowerCase()
    );
    // If found, then logs the municipality name and the ID
    if (iloiloCityResult) {
      console.log(
        `Municipality: ${iloiloCityResult.name}, ID: ${iloiloCityResult.id}`
      );
      //returns the ID
      return iloiloCityResult.id;
    } else {
      // Else statement for when municipality is not found
      console.log('Municipality not found.');
      return null;
    }
  } catch (error) {
    // Catch error
    console.error(error);
    return null;
  }
}

// Async function to retrieve the barangay data
async function fetchBarangayData(provinceId) {
  try {
    // Uses axios.get to make an HTTP GET request
    const response = await axios.get(`${barangayUrl}${provinceId}`);
    // Extracts the module property from the response data
    const { module } = response.data;

    // Makes array barangayData to extract data and store them in the name, id and province id
    const barangayData = module.map(barangay => ({
      Name: barangay.name,
      ID: barangay.id,
      ParentID: provinceId
    }));
    // Formats the data into the CSV
    const csvData = [...barangayData];
    // Formats the csv data to make headers true
    const csvStream = csv.format({ headers: true });
    // Write the stream to outputawait.csv
    const writableStream = fs.createWriteStream('outputawait.csv');

    csvStream.pipe(writableStream);
    // Iterates each data in the array to write it to the csv file
    csvData.forEach(data => {
      csvStream.write(data);
    });

    csvStream.end();
    // Notifies user that data export is successful
    console.log('Data has been exported to: outputawait.csv');
  } catch (error) {
    console.error(error);
  }
}

(async () => {
  // This function will run the async functions in order
  const provinceId = await fetchProvinceData();
  if (provinceId) {
    const municipalityId = await fetchMunicipalityData(provinceId);
    if (municipalityId) {
      fetchBarangayData(municipalityId);
    }
  }
})();
