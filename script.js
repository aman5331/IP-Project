let map;

// Function to create and show Google Map
function showMap(lat, lon) {
  const location = { lat, lng: lon };
  map = new google.maps.Map(document.getElementById("map"), {
    center: location,
    zoom: 10,
  });
  const marker = new google.maps.Marker({
    position: location,
    map: map,
    title: "User Location",
  });
}

// Function to get user's IP address
async function getUserIPAddress() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    const ipAddress = data.ip;
    document.getElementById("ipAddress").textContent = ipAddress;
    return ipAddress;
  } catch (error) {
    console.error("Error fetching IP address:", error);
  }
}

// Function to fetch user's location and display it on Google Map
async function getUserLocation(ipAddress) {
  try {
    const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
    const data = await response.json();
    const lat = parseFloat(data.latitude);
    const lon = parseFloat(data.longitude);

    // Display location on Google Map
    showMap(lat, lon);

    // Get user's timezone and display it
    const timezone = data.timezone;
    document.getElementById("timezone").textContent = timezone;
    return { lat, lon, timezone };
  } catch (error) {
    console.error("Error fetching user location:", error);
  }
}

// Function to fetch and display post offices based on pincode
async function fetchPostOffices(pincode) {
  try {
    const response = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    const data = await response.json();
    const postOffices = data[0].PostOffice;

    const postOfficeList = document.getElementById("postOfficeList");
    const searchBox = document.getElementById("searchBox");

    // Populate and filter post offices
    function populatePostOffices() {
      postOfficeList.innerHTML = "";
      const filterText = searchBox.value.toLowerCase();

      for (const office of postOffices) {
        if (
          office.Name.toLowerCase().includes(filterText) ||
          office.BranchType.toLowerCase().includes(filterText)
        ) {
          const listItem = document.createElement("li");
          listItem.textContent = `${office.Name} (${office.BranchType})`;
          postOfficeList.appendChild(listItem);
        }
      }
    }

    searchBox.addEventListener("input", populatePostOffices);
    populatePostOffices();
  } catch (error) {
    console.error("Error fetching post offices:", error);
  }
}

// Event listener for the "Get Location" button
document
  .getElementById("getLocationButton")
  .addEventListener("click", async () => {
    const ipAddress = await getUserIPAddress();
    if (ipAddress) {
      const { lat, lon, timezone } = await getUserLocation(ipAddress);
      fetchPostOffices(timezone);
    }
  });
<script
  async
  defer
  src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCVbDBLFGky314At4rlKEnSDeY8jqrpRgA&callback=initMap"
></script>;
