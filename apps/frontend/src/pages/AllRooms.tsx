import axios from "axios";
import { useEffect, useState } from "react";

interface RoomsPropsType {
  id: string;
  name: string;
  height: number;
  width: number;
  creatorId: string;
}

const AllRooms = () => {
  const [rooms, setRooms] = useState<RoomsPropsType[]>([]);

  useEffect(() => {
    console.log("Hello ji from allRooms");
    const getRooms = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/space/get-all`,
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );
      console.log(response.data);
      setRooms(response.data.maps);
    };
    getRooms();
  }, []);

  return (
    <div>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>{room.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default AllRooms;
