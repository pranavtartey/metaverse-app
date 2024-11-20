import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface RoomsPropsType {
  id: string;
  name: string;
  height: number;
  width: number;
  creatorId: string;
}

interface RoomType {
  id: string;
  name: string;
  width: number;
  height: number;
  creatorId: string;
}

const AllRooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomsPropsType[]>([]);

  useEffect(() => {
    // console.log("Hello ji from allRooms");
    const getRooms = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/space/get-all`,
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );
      // console.log(response.data);
      setRooms(response.data.maps);
    };
    getRooms();
  }, []);

  const roomHandler = (room: RoomType) => {
    // console.log("This is your room from the allRooms page : ", room);
    navigate(`/arena/${room.id}`, { state: room });
  };

  return (
    <div>
      {rooms.map((room) => (
        <Button
          onClick={() => {
            roomHandler(room);
          }}
          variant="link"
          key={room.id}
        >
          {room.name}
        </Button>
      ))}
    </div>
  );
};

export default AllRooms;
