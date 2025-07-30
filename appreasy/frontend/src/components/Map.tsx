import maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

interface MapProps {
  onSelect: (id: string) => void;
}

export default function Map({ onSelect }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [174.763, -36.848], // Auckland, NZ
      zoom: 10,
    });

    map.current.on("load", () => {
      // Add a simple marker for demo purposes
      const marker = new maplibregl.Marker()
        .setLngLat([174.763, -36.848])
        .addTo(map.current!);

      // Add click handler for demo
      map.current!.on("click", (e) => {
        console.log("Map clicked at:", e.lngLat);
        // For demo, select a dummy parcel ID
        onSelect("demo-parcel-123");
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [onSelect]);

  return (
    <div className="flex-1 relative">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-white p-2 rounded shadow">
        <p className="text-sm text-gray-600">Click anywhere on the map to select a property</p>
      </div>
    </div>
  );
}
