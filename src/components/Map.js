"use client"
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { useMemo, useState, useCallback } from "react";
import LocationInfobox from "./LocationInfoBox";

const Map = ({ eventData, center, zoom }) => {
    const [map, setMap] = useState(null);
    const [locationInfo, setLocationInfo] = useState(null);
    const [hoveredMarker, setHoveredMarker] = useState(null)
    const libraries = useMemo(() => ["places", "marker"], []);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const mapCenter = useMemo(() => center, [center]);
    
    const options = useMemo(() => ({
        disableDefaultUI: false,
        clickableIcons: true,
        maxZoom: 16,
        minZoom: 3,
        streetViewControl: false,
    }), []);
    
    const handleOnLoad = useCallback((mapInstance) => {
        setMap(mapInstance);
    }, []);
    
    const handleClose = () => {
        setLocationInfo(null)
    }

    const markerIcon = useMemo(() => {
        if (!isLoaded) return null;
        return {
            url: "/mdi--fire-red.svg",
            scaledSize: new window.google.maps.Size(24, 24),
            anchor: new window.google.maps.Point(12, 12),
        };
    }, [isLoaded]);
    
    const scaledMarkerIcon = useMemo(() => {
        if (!isLoaded) return null;
        return {
            url: "/mdi--fire-red.svg",
            scaledSize: new window.google.maps.Size(30, 30),
            anchor: new window.google.maps.Point(13, 13),
        };
    }, [isLoaded]);

    const markers = useMemo(() => {
        if (!isLoaded || !eventData?.length) return [];
        
        return eventData
            .filter(ev => ev.categories[0]?.id === 8 && ev.geometries?.[0]?.coordinates)
            .map((ev, index) => {
                const lat = ev.geometries[0].coordinates[1];
                const lng = ev.geometries[0].coordinates[0];
                
                if (!lat || !lng) return null;
                
                const isHovered = hoveredMarker === ev.id;

                return (
                    <Marker 
                        key={`${lat}-${lng}-${index}`}
                        position={{ lat, lng }}
                        icon={isHovered ? scaledMarkerIcon : markerIcon}
                        onMouseOver={() => setHoveredMarker(ev.id)}
                        onMouseOut={() => setHoveredMarker(null)}
                        onClick={() => setLocationInfo({
                            id: ev.id,
                            title: ev.title,
                            coordinates: (
                                <span>
                                    lat: {ev.geometries[0].coordinates[1]} <br />
                                    lng:  {ev.geometries[0].coordinates[0]}
                                </span>
                            )
                        })}
                    />
                );
            })
            .filter(Boolean); // Remove any null markers
    }, [eventData, markerIcon, scaledMarkerIcon, isLoaded, hoveredMarker]);

    if (loadError) {
        return (
            <div className="w-full h-full flex items-center justify-center text-red-500">
                Error loading maps
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                Loading maps...
            </div>
        );
    }

    return (
        <div id="map" className="w-full h-full">
            <GoogleMap
                mapContainerClassName="w-full h-full"
                center={mapCenter}
                zoom={zoom}
                options={options}
                onLoad={handleOnLoad}
            >
                {markers}
            </GoogleMap>
            {locationInfo && <LocationInfobox onClick={handleClose} info={locationInfo} />}
        </div>
    );
};

export default Map;