import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NewRoom from "./NewRoom";
import AllRooms from "./AllRooms";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { signinState } from "@/atom";
import JoinRoom from "./joinRoom";

const Home = () => {
  const setloginState = useSetRecoilState(signinState);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setloginState({
        isLoggedin: true,
        name: "",
      });
    }
  }, []);
  return (
    <div>
      <h1>Home Page</h1>
      <Dialog>
        <DialogTrigger>Create Room</DialogTrigger>
        <DialogContent>
          <DialogTitle>Create new room</DialogTitle>
          <NewRoom />
        </DialogContent>
      </Dialog>
      <br />
      <Dialog>
        <DialogTrigger>All Rooms</DialogTrigger>
        <DialogContent>
          <DialogTitle>All rooms</DialogTitle>
          <AllRooms />
        </DialogContent>
      </Dialog>
      <br />
      <Dialog>
        <DialogTrigger>Join room</DialogTrigger>
        <DialogContent>
          <DialogTitle>Join Room</DialogTitle>
          <JoinRoom />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
