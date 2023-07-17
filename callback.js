// Required modules
const axios = require('axios');

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
function fetchProvinceData(callback) {
  // Uses the province url for HTTP Get request
  axios
    .get(provinceUrl)
    // If succesful, extract module
    .then(response => {
      const { module } = response.data;
      // Searches for the province name and logs the name and ID
      const iloiloProvince = module.find(
        p => p && p.name.toLowerCase() === province.toLowerCase()
      );
      if (iloiloProvince) {
        // Prints the Province and ID
        console.log(
          `Province: ${iloiloProvince.name}, ID: ${iloiloProvince.id}`
        );
        callback(null, iloiloProvince.id);
      } else {
        // If not found, notifies the user and returns null
        console.log('Province not found.');
        callback('Province not found.', null);
      }
    })
    .catch(error => {
      // Catches error
      console.error(error);
      callback(error, null);
    });
}

//fetches municipality data
function fetchMunicipalityData(provinceId, callback) {
  // Use Axios.get using the URL and the province ID provided from the first function
  axios
    .get(`${municipalityUrl}${provinceId}`)
    // If search is success, export the result
    .then(response => {
      const { module } = response.data;
      // Module array is searched using find
      const iloiloCity = module.find(
        m => m && m.name.toLowerCase() === municipality.toLowerCase()
      );
      // If municipality is found, name and ID are logged
      if (iloiloCity) {
        console.log(`Municipality: ${iloiloCity.name}, ID: ${iloiloCity.id}`);
        callback(null, iloiloCity.id);
      } else {
        // If not found, logs that the municipality is not found
        console.log('Municipality not found.');
        callback('Municipality not found.', null);
      }
    })
    // Calls the callback function with error message and null
    .catch(error => {
      console.error(error);
      callback(error, null);
    });
}

function fetchBarangayData(provinceId, callback) {
  // HTTP get request using the url and province ID
  axios
    .get(`${barangayUrl}${provinceId}`)
    .then(response => {
      //gets the response and puts it into module
      const { module } = response.data;
      console.log('Barangays:');
      //The module is iterated for each element to log the ID, the name, and province ID
      module.forEach(barangay => {
        console.log(
          `ID: ${barangay.id}, Name: ${barangay.name}, Parent ID: ${provinceId}`
        );
      });

      callback(null);
    })
    .catch(error => {
      console.error(error);
      callback(error);
    });
}

// Callback function used
// Indicates the flow of the scripts from Province to Municipality to Barangay
fetchProvinceData((provinceError, provinceId) => {
  //If an error esists, the error is logged and ends the program
  if (provinceError) {
    console.error(provinceError);
    return;
  }

  fetchMunicipalityData(provinceId, (municipalityError, municipalityId) => {
    //If an error esists, the error is logged and ends the program
    if (municipalityError) {
      console.error(municipalityError);
      return;
    }

    fetchBarangayData(municipalityId, barangayError => {
      //If an error esists, the error is logged and ends the program
      if (barangayError) {
        console.error(barangayError);
      }
    });
  });
});
