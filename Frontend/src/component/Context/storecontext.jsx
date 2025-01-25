import { createContext, useState } from "react";

export const StoreContext = createContext();

export const StoreProvider = (props) => {
   const [store,setStore]=useState({
    search_text: "",
    isauth:false,
    currstock: {},
    showSelectedStockDetails: false,
    user_email: "",
    stock_data:[],
    portfolioUpdated:false
   })
  return (
    <StoreContext.Provider value={{store,setStore }}>
      {props.children}   
    </StoreContext.Provider>
  );
};
