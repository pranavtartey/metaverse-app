import { atom } from "recoil";

export const signinState = atom({
    key: 'signinState',
    default: {
        isLoggedin: false,
        name: ""
    }
})

// export const countState = atom({
//     key: "countState",
//     default: 0
// })