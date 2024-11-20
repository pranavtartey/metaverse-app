import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JoinRoomSchema } from "@/types";
import axios from "axios";
import { ChangeEvent, ChangeEventHandler, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinRoom = () => {
    const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    roomId: "",
  });

  const changeHandler: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (event: FormEvent) => {
    event.preventDefault();
    console.log(inputValue);
    const parsedData = JoinRoomSchema.safeParse(inputValue.roomId);
    if (!parsedData.success) return;
    console.log("This is your parsedData : ", parsedData);
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/space/get-space`,
      parsedData,
      {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    );

    if(!response.data.space){
        return
    }

    const space = response.data.space

    navigate(`/arena/${space.id}`, { state: space });

    console.log("This is your response : ", response);
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="mb-4">
        <label htmlFor="roomId">Room ID :</label>
        <Input
          id="roomId"
          name="roomId"
          value={inputValue.roomId}
          onChange={changeHandler}
        />
      </div>
      <Button type="submit">Join</Button>
    </form>
  );
};

export default JoinRoom;
