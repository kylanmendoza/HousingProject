// import { Loader } from '@googlemaps/js-api-loader';


// const apiOptions = {
//     apiKey: 'AIzaSyD7LjDw6VblBQwXbmdpdQKVogUzfPA9auU',
// }
// const loader = new Loader(apiOptions);
// function displayMap() {
//     const mapOptions = {
//         center: {lat: 45.6793, lng: 111.0373},
//         zoom: 8
//     };
//     const mapDiv = document.getElementById('map');
//     const map = new google.maps.Map(mapDiv, mapOptions);
//     return map;
// }

// loader.then(() => {
//     console.log('Maps JS API loaded');
//     const map1 = displayMap();
// });



let map;
let center =  { lat: 45.6793, lng: -111.0373 };

async function initMap() {
    await google.maps.importLibrary('maps');
    await google.maps.importLibrary('marker');
    
    map = new google.maps.Map(document.getElementById('map'), {
        center,
        zoom: 12,
        mapId: "DEMO_Map_ID"
    });
    addMarker();
}

async function addMarker() {
    const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: center,
    });
}
initMap();