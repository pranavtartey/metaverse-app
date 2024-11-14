import { ChangeEvent, ChangeEventHandler, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SigninFormSchema } from "../types";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { signinState } from "../atom";

interface InputValueProps {
  username: string;
  password: string;
}

const Signin = () => {
  const navigate = useNavigate();
  const setSignin = useSetRecoilState(signinState);
  const [inputValue, setInputValue] = useState<InputValueProps>({
    username: "",
    password: "",
  });

  const changeHandler: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;
    setInputValue((prev: InputValueProps) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (event: FormEvent): Promise<void> => {
    try {
      event.preventDefault();
      console.log("Signin form value : ", inputValue);
      const parsedData = SigninFormSchema.safeParse(inputValue);
      console.log(parsedData);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/signin`,
        parsedData.data
      );

      console.log("This is your signin response : ", response.data);

      localStorage.setItem("token", response.data.token);

      setSignin({
        isLoggedin: true,
        name: response.data.name,
      });

      navigate("/");
    } catch (error) {
      console.error(
        "Something wrnt wrong in the signin submitHandler : ",
        error
      );
    }
  };

  return (
    <div>
      <h1>Signin page</h1>
      <form onSubmit={submitHandler}>
        <label htmlFor="username">Username : </label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="username"
          value={inputValue.username}
          onChange={changeHandler}
        />
        <label htmlFor="password">Password : </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="password"
          value={inputValue.password}
          onChange={changeHandler}
        />
        <button type="submit">Submit</button>
      </form>
      <Link to="/signup">Don't have an account?</Link>
    </div>
  );
};

export default Signin;
