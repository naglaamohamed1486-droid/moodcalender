import { useEffect } from "react";
import { useMap } from "react-leaflet";

const defaultCenter = [26.82, 30.8];
const defaultZoom = 6;

export default function FlyToLocation({ place }) {
  const map = useMap();

  useEffect(() => {
    if (!place) {
      map.setView(defaultCenter, defaultZoom, {
        animate: true,
      });
      return;
    }

    const lat = Number(place.lat);
    const lng = Number(place.lng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    map.setView([lat, lng], 10, {
      animate: true,
    });
  }, [place, map]);

  return null;
}