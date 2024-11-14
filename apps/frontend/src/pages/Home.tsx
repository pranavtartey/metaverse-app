import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NewRoom from "./NewRoom";

const Home = () => {
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
      <p>Join a room</p>
    </div>
  );
};

export default Home;
