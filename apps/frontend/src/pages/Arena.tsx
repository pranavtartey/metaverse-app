import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

interface RoomType {
  id: string;
  name: string;
  width: string;
  height: string;
  creatorId: string;
}

const Arena = () => {
  const wsRef = useRef<any>();
  const canvasRef = useRef<any>();
  const { id } = useParams();
  const { state } = useLocation();
  const [currentUser, setCurrentUser] = useState<any>({});
  const [users, setUsers] = useState(new Map());

  const token = localStorage.getItem("token")?.split(" ")[1];

  // Track dot position
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    // const canvas = canvasRef.current;
    // const ctx = canvas.getContext("2d");
    wsRef.current = new WebSocket("ws://localhost:3001");

    // const wsConnect = async () => {

    // await new Promise((resolve) => {
    //   ws.onopen = resolve;
    // });
    wsRef.current.onopen = () => {
      wsRef.current.send(
        JSON.stringify({
          type: "join",
          payload: {
            token,
            mapId: id,
          },
        })
      );
    };

    wsRef.current.onmessage = (event: MessageEvent<any>) => {
      const message = JSON.parse(event.data);

      handleWebSocketMessage(message);

      // switch (data.type) {
      //   case "space-joined":
      //     const { x, y } = data.payload.spawn;
      //     const { users } = data.payload;
      //     setUsers(users);

      //     // Set initial dot position from server
      //     setPosition({ x, y });
      //     drawDot(ctx, x, y);
      //     break;
      //   case "user-joined":
      //     const userX = data.payload.x;
      //     const userY = data.payload.y;
      //     const userId = data.payload.userId;
      //     setUsers((prev) => [...prev, { id: userId }]);
      // }
    };
    // };

    // wsConnect();

    // Cleanup WebSocket on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case "space-joined":
        //initialize current user position ad other users
        console.log("this is the message : ", message);
        console.log({
          x: message.payload.spawn.x,
          y: message.payload.spawn.y,
          userId: message.payload.userId,
        });
        setCurrentUser({
          x: message.payload.spawn.x,
          y: message.payload.spawn.y,
          userId: message.payload.userId,
        });
        //Initialize other users from the payload
        setUsers((prev) => {
          const userMap = new Map(prev);
          message.payload.users.forEach((user: any) => {
            userMap.set(user.userId, user);
          });
          console.log("This is the users map from space-joined : ", userMap);
          return userMap;
        });
        break;

      case "user-joined":
        console.log("User joined message just worked : ");
        setUsers((prev) => {
          const newUsers = new Map(prev);
          newUsers.set(message.payload.userId, {
            x: message.payload.x,
            y: message.payload.y,
            userId: message.payload.userId,
          });
          console.log("This is users map : ", newUsers);
          return newUsers;
        });
        break;

      case "movement":
        setUsers((prev) => {
          const newUsers = new Map(prev);
          const user = newUsers.get(message.payload.userId);
          if (user) {
            user.x = message.payload.x;
            user.y = message.payload.y;
            newUsers.set(message.payload.userId, user);
          }
          return newUsers;
        });
        break;
      case "movement-rejected":
        setCurrentUser((prev: any) => ({
          ...prev,
          x: message.payload.x,
          y: message.payload.y,
        }));
        break;
    }
  };

  const handleMove = (newX: any, newY: any) => {
    if (!currentUser) return;
    // console.log("Your handler move is working!!!")
    //send movement request

    wsRef.current.send(
      JSON.stringify({
        type: "move",
        payload: {
          x: newX,
          y: newY,
        },
        userId: currentUser.userId,
      })
    );
  };

  //draw the arena

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draw grid

    ctx.strokeStyle = "#eee";
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    //Draw current user

    if (currentUser && currentUser.x) {
      // console.log("This the current user : ", currentUser);
      // ctx.beginPath();
      // ctx.fillStyle = "#FF6B6b";
      // ctx.arc(currentUser.x * 50, currentUser.y * 50, 20, 0, Math.PI * 2);
      // ctx.fill();
      // ctx.fillStyle = "#000";
      // ctx.font = "14px Arial";
      // ctx.textAlign = "center";
      // ctx.fillText("You", currentUser.x * 50, currentUser.y * 50 + 40);
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(currentUser.x, currentUser.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    //draw other users

    users.forEach((user) => {
      if (!user.x) {
        return;
      }
      // ctx.beginPath();
      // ctx.fillStyle = "#4ECDC4";
      // ctx.arc(user.x * 50, user.y * 50, 20, 0, Math.PI * 2);
      // ctx.fill();
      // ctx.fillStyle = "#000";
      // ctx.font = "14px Arial";
      // ctx.textAlign = "center";
      // ctx.fillText(`User ${user.userId}`, user.x * 50, user.y * 50 + 40);
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(user.x, user.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [currentUser, users]);

  const handleKeyDown = (e: any) => {
    if (!currentUser) return;

    const { x, y } = currentUser;
    switch (e.key) {
      case "ArrowUp":
        handleMove(x, y - 1);
        break;
      case "ArrowDown":
        handleMove(x, y + 1);
        break;
      case "ArrowLeft":
        handleMove(x - 1, y);
        break;
      case "ArrowRight":
        handleMove(x + 1, y);
        break;
    }
  };

  // Handle keyboard input
  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     setPosition((prev) => {
  //       let newX = prev.x;
  //       let newY = prev.y;

  //       if (e.key === "ArrowUp") newY -= 5; // Move up
  //       if (e.key === "ArrowDown") newY += 5; // Move down
  //       if (e.key === "ArrowLeft") newX -= 5; // Move left
  //       if (e.key === "ArrowRight") newX += 5; // Move right

  //       // Clear canvas and redraw the dot
  //       const canvas = canvasRef.current;
  //       const ctx = canvas.getContext("2d");
  //       ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  //       drawDot(ctx, newX, newY);
  //       ws.send(
  //         JSON.stringify({
  //           type: "move",
  //           payload: {
  //             x: newX,
  //             y: newY,
  //           },
  //         })
  //       );

  //       ws.onmessage = (event) => {
  //         console.log("This is the event data : ", event.data);
  //       };

  //       return { x: newX, y: newY };
  //     });
  //   };

  //   window.addEventListener("keydown", handleKeyDown);

  //   // Cleanup event listener on unmount
  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);

  // const drawDot = (ctx: any, x: number, y: number) => {
  // ctx.fillStyle = "red";
  // ctx.beginPath();
  // ctx.arc(x, y, 5, 0, Math.PI * 2);
  // ctx.fill();
  // };

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0}>
      <h1>Arena</h1>
      <canvas
        ref={canvasRef}
        width={state.width}
        height={state.height}
      ></canvas>
    </div>
  );
};

export default Arena;
