import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateRoomSchema } from "@/types";
import axios from "axios";
import { ChangeEvent, ChangeEventHandler, FormEvent, useState } from "react";

interface InputPropsType {
  name: string;
  dimensions: string;
}

const NewRoom = () => {
  const [inputValue, setInputValue] = useState<InputPropsType>({
    name: "",
    dimensions: "",
  });
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const changeHandler: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;
    setInputValue((prev: InputPropsType) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    const parsedData = CreateRoomSchema.safeParse(inputValue);
    console.log("This is your create room value : ", inputValue);
    console.log("This is your parsedData value : ", parsedData);

    if (!parsedData.success) {
      setIsError(true);
      setErrorMessage(parsedData.error.issues[0].message);
      return;
    }

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/space/new-space`,
      parsedData,
      {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    );

    console.log("This is your create space response : ", response);
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="">
        <div className="ml-2 mb-2">
          <label htmlFor="name">Name :</label>
        </div>
        <Input
          id="name"
          name="name"
          placeholder="name"
          value={inputValue.name}
          onChange={changeHandler}
        />
      </div>
      <div className="mt-4">
        <div className="ml-2 mb-2">
          <label htmlFor="dimensions">Dimensions :</label>
        </div>
        <Input
          id="dimensions"
          name="dimensions"
          placeholder="'width'x'height'"
          value={inputValue.dimensions}
          onChange={changeHandler}
        />
        {isError && (
          <p className="text-xs text-red-500 mt-2 ml-3">{errorMessage}</p>
        )}
      </div>
      <Button className="mt-4" type="submit">
        Submit
      </Button>
    </form>
  );
};

export default NewRoom;
