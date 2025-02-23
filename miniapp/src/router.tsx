import { createBrowserRouter } from "react-router";
import CryptoPage from "./view/CryptoPage";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <CryptoPage/>
    },
    // {
    //     path: '*',
    //     element: <CryptoPage/> add error page
    // }
]);