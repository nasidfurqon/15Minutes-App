import { useState, useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';

export const useMapZoom = () => {
    const [zoomLevel, setZoomLevel] = useState(null);

    const mapEvents = useMapEvents({
        zoomend: () => {
            setZoomLevel(mapEvents.getZoom());
        },
        load: () => {
            setZoomLevel(mapEvents.getZoom());
        }
    });

    return zoomLevel;
};