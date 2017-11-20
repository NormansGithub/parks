$(document).ready(_ => {
    $('.table').DataTable();
    if (screen.width <= 768) {
        $('.table').addClass('table-responsive');
    }
});

let map;
let markers;

initMap = _ => {
    let previousInfoWindow = null;

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {
            lat: 49.2518,
            lng: -123.1125
        }
    });

    markers = locations.map((location, i) => {
        const marker = new google.maps.Marker({
            position: location
        });
        const infoWindow = new google.maps.InfoWindow({
            content: '<b>' + labels[i] + '"  target="_blank">View on Google Maps</a>'
        });

        marker.addListener('click', _ => {
            if (previousInfoWindow != null) {
                previousInfoWindow.close();
            }

            infoWindow.open(map, marker);
            previousInfoWindow = infoWindow;
        });

        return marker;
    });

    new MarkerClusterer(map, markers);
}

showInfo = id => {
    map.setZoom(18);
    map.setCenter(markers[id].getPosition());
    google.maps.event.trigger(markers[id], 'click');
}