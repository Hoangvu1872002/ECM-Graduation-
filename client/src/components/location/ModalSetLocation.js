import React, { useState, useEffect } from "react";
import axios from "axios";
import { showModal } from "../../store/app/appSlice";
import { useDispatch } from "react-redux";

const ModalSetLocation = ({ onClose, onSelect }) => {
  const dispatch = useDispatch();

  const [searchKey, setSearchKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState([]);

  const handleSearchLocation = async (query) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://rsapi.goong.io/Place/AutoComplete",
        {
          params: {
            api_key: "sJrvIqiCKE2h7akqUhzs1gyVqt5PiCURtoVihCjg",
            input: query,
          },
        }
      );

      if (response.status === 200) {
        const dataSaveLocation = response.data.predictions.map((e) => ({
          description: e.structured_formatting.secondary_text,
          main_name_place: e.structured_formatting.main_text,
          place_id: e.place_id,
        }));
        setLocations(dataSaveLocation);
      }
    } catch (error) {
      console.error("Error fetching autocomplete suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCoordinatesFromPlaceId = async (placeId) => {
    const API_KEY = "sJrvIqiCKE2h7akqUhzs1gyVqt5PiCURtoVihCjg";
    const BASE_URL = "https://rsapi.goong.io/Place/Detail";

    try {
      const response = await axios.get(BASE_URL, {
        params: {
          place_id: placeId,
          api_key: API_KEY,
        },
      });

      if (response.status === 200) {
        const { lat, lng } = response.data.result.geometry.location;
        console.log(response.data.result);

        onSelect({
          lat,
          lng,
          main_name_place: response.data.result.name,
          description: response.data.result.formatted_address,
        });
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const handleSelectLocation = (location) => {
    fetchCoordinatesFromPlaceId(location.place_id);
    onClose();
  };

  useEffect(() => {
    if (searchKey) {
      const delayDebounceFn = setTimeout(() => {
        handleSearchLocation(searchKey);
      }, 1000);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setLocations([]);
    }
  }, [searchKey]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Choose Location</h2>
        <div className="mb-4">
          <input
            type="text"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Search for a location..."
          />
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <span>Loading...</span>
          </div>
        ) : (
          <ul className="space-y-2">
            {locations.map((location, index) => (
              <li
                key={index}
                className="p-2 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectLocation(location)}
              >
                <p className="font-bold">{location.main_name_place}</p>
                <p className="text-sm text-gray-500">{location.description}</p>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={() =>
              dispatch(showModal({ isShowMOdal: false, modalChildren: null }))
            }
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalSetLocation;
