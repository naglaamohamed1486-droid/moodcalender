import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";
import FlyToLocation from "./FlyToLocation";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const defaultIcon = new L.Icon.Default();

const activeIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: markerShadow,
  iconSize: [30, 48],
  iconAnchor: [15, 48],
  popupAnchor: [1, -40],
});

const egyptBounds = [
  [21.5, 24],
  [32.8, 37],
];

function PlaceMarker({
  place,
  selectedPlace,
  setSelectedPlace,
}) {
  const markerRef = useRef(null);

  const isSelected = selectedPlace?.id === place.id;

  useEffect(() => {
    
    if (isSelected) {
      setTimeout(() => {
        markerRef.current?.openPopup();
      }, 50);
    }
  }, [isSelected]);

  return (
        <Marker
        ref={markerRef}
        position={[Number(place.lat), Number(place.lng)]}
        icon={isSelected ? activeIcon : defaultIcon}
        eventHandlers={{
            click: () => {
            if (selectedPlace?.id === place.id) {
                setSelectedPlace(null);
            } else {
                setSelectedPlace(place);
            }
            },
        }}
        >
      <Popup>
<div style={{width:220}}>

<img
src={place.coverImage}
style={{
width:"100%",
height:110,
objectFit:"cover",
borderRadius:10,
marginBottom:10
}}
/>

<h3>{place.title}</h3>

</div>
      </Popup>
    </Marker>
  );
}

export default function MapView({
  places = [],
  selectedPlace,
  setSelectedPlace,
}) {
  return (
    <MapContainer
      center={[26.82, 30.8]}
      zoom={6}
      minZoom={6}
      maxZoom={12}
      maxBounds={egyptBounds}
      maxBoundsViscosity={1}
      zoomControl={false}
      style={{
      height:"86vh",
      width:"100%",
      borderRadius:"24px",
      overflow:"hidden",
      boxShadow:"0 20px 55px rgba(0,0,0,.15)"
      }}
    >
      <FlyToLocation place={selectedPlace} />
      

      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {places.map((place) => {
        if (!place?.lat || !place?.lng) return null;

        return (
          <PlaceMarker
            key={`${place.id}-${selectedPlace?.id === place.id}`}
            place={place}
            selectedPlace={selectedPlace}
            setSelectedPlace={setSelectedPlace}
          />
        );
      })}
    </MapContainer>
  );
}