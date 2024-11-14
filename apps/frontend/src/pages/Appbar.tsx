import { useRecoilValue } from "recoil";
import { signinState } from "../atom";
import { useNavigate } from "react-router-dom";

const Appbar = () => {
  const loginState = useRecoilValue(signinState);
  const navigate = useNavigate()
  return (
    <div>
      <div>
        {loginState.isLoggedin ? (
            <div>{loginState.name}</div>
        ) : (
            <div>
                <button onClick={() => {
                    navigate("/signin")
                }}>Signin</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Appbar;
