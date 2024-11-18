import { useRecoilValue, useSetRecoilState } from "recoil";
import { signinState } from "../atom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Appbar = () => {
  const loginState = useRecoilValue(signinState);
  const setLoginState = useSetRecoilState(signinState);
  const navigate = useNavigate();
  const logoutHandler = () => {
    localStorage.removeItem("token");
    setLoginState({
      isLoggedin: false,
      name: "",
    });
  };

  return (
    <div>
      <div>
        {loginState.isLoggedin ? (
          <div className="flex justify-end">
            <Button onClick={logoutHandler} variant={"destructive"}>
              Logout
            </Button>
          </div>
        ) : (
          <div>
            <button
              onClick={() => {
                navigate("/signin");
              }}
            >
              Signin
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appbar;
