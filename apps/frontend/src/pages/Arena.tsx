import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Arena = () => {
  const { id } = useParams();
  console.log(id);
  const token = localStorage.getItem("token")?.split(" ")[1];
  useEffect(() => {
    const wsConnect = async () => {
      const ws = new WebSocket("ws://localhost:3001");
      //very important statement
      await new Promise((r) => {
        ws.onopen = r;
      });
      //This above statement is ensuring that our code will wait here until the connection is etablished. This was not required if we were not sending anythin over the server but since we have to do the ws.send call so we have to set a new Promise so that it only resolves when the connection is open and then our await statement moves forward as the promise was resolved and we can make sure that the ws.send can now work
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            token,
            mapId: id,
          },
        })
      );
    };
    wsConnect();
  }, []);
  return (
    <div>
      <h1>Arena</h1>
      <p>This is the arena page</p>
    </div>
  );
};

export default Arena;
