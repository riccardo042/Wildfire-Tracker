"use client";
import { useState, useEffect, use } from "react";
import dynamic from "next/dynamic";
import Loader from "./Loader";
import Header from "./Header";

const MapComponent = dynamic(() => import("@/components/Map"), {
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center">
        Loading Map...
    </div>
  ),
  ssr: false,
});

export default function App() {
    const [eventData, setEventData] = useState([])
    const [loading, setLoading] = useState(false)
    
    const center = {
        lat: 37.5999, 
        lng: 14.0154
    };

    const zoom = 6;

    useEffect(() => {
        const fetchEvents = async () => {
        setLoading(true)
        try {
            const res = await fetch("https://eonet.gsfc.nasa.gov/api/v2.1/events");
            const { events } = await res.json();
            setEventData(events)
        
        const fireEvents = events.filter(e => 
            e.categories[0].id === 8 &&
            e.geometries?.length > 0
        );

            setEventData(fireEvents);
        } catch (err) {
            console.error("Error fetchind events", err)
        } finally {
            setLoading(false)
        }
      }
        fetchEvents()
    }, [])
    


    useEffect(() => {
        console.log(eventData);
    }, [eventData])
    
    return(
        <div id="dashboard" className="w-full h-screen">
             {!loading ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                <Header />
                <MapComponent 
                    center={center} 
                    zoom={zoom} 
                    eventData={eventData}
                />
                </div>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                <Header />
                <Loader />
                </div>
            )}
        </div>
    )
}