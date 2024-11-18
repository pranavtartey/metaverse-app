import { ChangeEvent, ChangeEventHandler, FormEvent, useState } from "react";
import { SignupFormSchema } from "../types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { signinState } from "../atom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface InputFormProps {
  name: string;
  username: string;
  password: string;
}

const Signup = () => {
  const navigate = useNavigate();
  const setLogin = useSetRecoilState(signinState);
  const [inputValue, setInputValue] = useState<InputFormProps>({
    name: "",
    password: "",
    username: "",
  });

  const changeHandler: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;
    setInputValue((prev: InputFormProps) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (event: FormEvent) => {
    event.preventDefault();
    const parsedData = SignupFormSchema.safeParse(inputValue);

    if (!parsedData.success) {
      return;
    }

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/signup`,
      parsedData.data
    );

    console.log(response.data.token);

    localStorage.setItem("token", response.data.token);

    setLogin({
      isLoggedin: true,
      name: response.data.name,
    });

    navigate("/");

    const token = response.data.token.split(" ")[1];
    console.log(token);
  };

  return (
    <div>
      <h1>Signup page</h1>
      <form onSubmit={submitHandler}>
        <label htmlFor="name">Name : </label>
        <Input
          id="name"
          type="text"
          name="name"
          placeholder="name"
          value={inputValue.name}
          onChange={changeHandler}
        />
        <label htmlFor="username">Username : </label>
        <Input
          id="username"
          type="text"
          name="username"
          placeholder="username"
          value={inputValue.username}
          onChange={changeHandler}
        />
        <label htmlFor="password">Password : </label>
        <Input
          id="password"
          type="password"
          name="password"
          placeholder="password"
          value={inputValue.password}
          onChange={changeHandler}
        />
        <Button value={"default"}>Sign up</Button>
      </form>
    </div>
  );
};

export default Signup;
