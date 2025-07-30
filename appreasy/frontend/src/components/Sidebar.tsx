import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface SidebarProps {
  parcelId: string | null;
  onClose: () => void;
}

export default function Sidebar({ parcelId, onClose }: SidebarProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["parcel", parcelId],
    queryFn: async () => {
      if (!parcelId) return null;
      const response = await axios.get(`/api/parcel/${parcelId}`);
      return response.data;
    },
    enabled: !!parcelId,
  });

  if (!parcelId) return null;

  return (
    <div className="w-96 bg-white shadow-xl border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onClose}
          className="flex items-center text-gray-600 hover:text-gray-800 text-sm"
        >
          ← Back to map
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-500">Loading property details...</div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <p className="text-red-800 text-sm">
              Error loading property data. This is likely because the backend 
              is still starting up or the parcel doesn't exist in the database yet.
            </p>
          </div>
        )}
        
        {data && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {data.address || "Address not available"}
              </h2>
              <p className="text-sm text-gray-500">Parcel ID: {data.id}</p>
            </div>
            
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded">
                <h3 className="font-semibold text-gray-700 mb-2">Property Details</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Title:</span> {data.title_no || "N/A"}</p>
                  <p><span className="font-medium">Area:</span> {data.area ? `${data.area.toLocaleString()} m²` : "N/A"}</p>
                  <p><span className="font-medium">Legal Description:</span> {data.legal_desc || "N/A"}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <h3 className="font-semibold text-gray-700 mb-2">Valuation & Sales</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Capital Value:</span> {data.cv ? `$${data.cv.toLocaleString()}` : "N/A"}</p>
                  <p><span className="font-medium">Last Sale:</span> {data.last_sale_price ? `$${data.last_sale_price.toLocaleString()}` : "N/A"}</p>
                  <p><span className="font-medium">Sale Date:</span> {data.last_sale_date || "N/A"}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <h3 className="font-semibold text-gray-700 mb-2">Additional Info</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Median Rent:</span> {data.median_rent ? `$${data.median_rent}` : "N/A"}</p>
                  <p><span className="font-medium">Zoning:</span> {data.zone_code || "N/A"}</p>
                  <p><span className="font-medium">Hazards:</span> {data.hazard_summary || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {parcelId === "demo-parcel-123" && !data && !isLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Demo Mode</h3>
            <p className="text-blue-700 text-sm">
              This is a demo parcel. In the full system, this would show real 
              property data from LINZ and other NZ government sources.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
