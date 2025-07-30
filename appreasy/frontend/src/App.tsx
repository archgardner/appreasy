import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Map from "./components/Map";
import Sidebar from "./components/Sidebar";

const queryClient = new QueryClient();

export default function App() {
  const [selectedParcel, setSelectedParcel] = useState<string | null>(null);
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-gray-100">
        <Sidebar 
          parcelId={selectedParcel} 
          onClose={() => setSelectedParcel(null)} 
        />
        <Map onSelect={setSelectedParcel} />
      </div>
    </QueryClientProvider>
  );
}
