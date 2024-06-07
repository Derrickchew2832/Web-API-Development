// public/script.js
let map;
let selectedType = 'restaurants';

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 5.4112, lng: 100.3354 }, // Centered on Penang by default
    zoom: 12
  });

  map.addListener('dragend', () => {
    const center = map.getCenter();
    updateMap(center.lat(), center.lng(), selectedType);
  });

  document.getElementById('searchForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('searchInput').value;
    const placeType = document.getElementById('placeType').value;
    selectedType = placeType;

    if (input) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: input }, (results, status) => {
        if (status === 'OK') {
          const location = results[0].geometry.location;
          map.setCenter(location);
          updateMap(location.lat(), location.lng(), selectedType);
        } else {
          console.error('Geocode was not successful for the following reason:', status);
        }
      });
    }
  });
}

let markers = [];
let infoWindows = [];

function displayPlacesOnMap(places) {
  markers.forEach(marker => marker.setMap(null));
  markers = [];

  const placesContainer = document.getElementById('places');
  placesContainer.innerHTML = '';

  places.forEach(place => {
    const position = { lat: parseFloat(place.latitude), lng: parseFloat(place.longitude) };

    const photoUrl = (place.photo && place.photo.images && place.photo.images.small.url) ? place.photo.images.small.url : 'https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg';
    
    const placeName = place.name ? place.name : 'No Name Available';
    const placeRating = place.rating ? place.rating : 'No Rating Available';
    const placeAddress = place.address ? place.address : 'No Address Available';
    const placeWebsite = place.website ? place.website : '';
    const placeWebUrl = place.web_url ? place.web_url : '';

    const markerContent = `
      <div class="marker-content">
        <img src="${photoUrl}" alt="${placeName}" class="marker-image"/>
        <div class="marker-info">
          <h3 class="marker-name">${placeName}</h3>
          <div class="marker-rating">${generateStars(placeRating)}</div>
          <p class="marker-address">Address: ${placeAddress}</p>
          <div class="marker-links">
            ${placeWebsite ? `<a href="${placeWebsite}" target="_blank">Website</a>` : ''}
            ${placeWebUrl ? `<a href="${placeWebUrl}" target="_blank">TripAdvisor</a>` : ''}
          </div>
        </div>
      </div>
    `;

    const markerLabel = new google.maps.InfoWindow({
      content: markerContent
    });

    const marker = new google.maps.Marker({
      position: position,
      map: map,
      title: placeName,
      icon: {
        url: photoUrl,
        scaledSize: new google.maps.Size(70, 70),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(25, 25),
      }
    });

    google.maps.event.addListener(marker, 'click', function() {
      infoWindows.forEach(infoWindow => infoWindow.close());
      infoWindows = [];
      markerLabel.open(map, marker);
      infoWindows.push(markerLabel);
    });

    markers.push(marker);
  });
}

function generateStars(rating) {
  if (isNaN(rating)) {
    return 'No Rating Available';
  }
  
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  let stars = '';

  for (let i = 0; i < fullStars; i++) {
    stars += '<span class="star">&#9733;</span>'; // Full star
  }
  if (halfStar) {
    stars += '<span class="star">&#9734;</span>'; // Half star
  }
  return stars;
}


async function updateMap(lat, lng, type) {
  try {
    const response = await fetch(`/api/map?lat=${lat}&lng=${lng}&type=${type}`);
    const data = await response.json();
    console.log('Received data:', data);

    if (data.placesData && data.placesData.length > 0) {
      displayPlacesOnMap(data.placesData);
    } else {
      console.error('No places found in the response:', data);
    }
  } catch (error) {
    console.error('Failed to fetch map data:', error);
  }
}

window.onload = () => {
  initMap();
};

