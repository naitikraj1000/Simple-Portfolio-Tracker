import React from "react";
import "./portfolio.css";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState, useContext } from "react";
import { StoreContext } from "./Context/storecontext";
import SelectedStockDetails from "./stock_details";
import { use } from "react";
function Portfolio() {
  const { store, setStore } = useContext(StoreContext);
  const [stock, setStock] = useState([]);
  const [stock_info, setStock_info] = useState([]);

  async function getPortfolio() {
    try {
      let backendUrl = import.meta.env.VITE_BACKEND_URL;
      console.log(" Backend URL ", backendUrl);
      let url = `${backendUrl}/getuserprotfoliostocks`;

      let res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP Error: ${res.status}`);
      }
      let data = await res.json();
      data = data.data;
      let stock_share_live_price = store.stock_data;
      // now join data with live price with the help of stock symbol

      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < stock_share_live_price.length; j++) {
          if (data[i].stocksymbol === stock_share_live_price[j].stocksymbol) {
            data[i].stockcurrentPrice = stock_share_live_price[j].stockprice;
            break;
          }
        }
      }

      setStock(data);
      setStock_info(data);
      console.log(" Portfolio Data ", data);
    } catch (error) {
      console.log(error);
    }
  }

  function search_modify_stock(search_text) {
    let new_stock = stock_info.filter((stock) => {
      return stock.stockname.toLowerCase().includes(search_text.toLowerCase());
    });
    setStock(new_stock);
  }

  useEffect(() => {
    getPortfolio();
  }, [store.stock_data, store.portfolioUpdated]);

  useEffect(() => {
    search_modify_stock(store.search_text);
  }, [store.search_text]);

  function stock_details_window_opener(stock) {
    let new_format_stock = {
      name: stock.stockname,
      symbol: stock.stocksymbol,
      price: stock.stockcurrentPrice,
    };
    setStore((prev) => ({
      ...prev,
      currstock: new_format_stock,
      showSelectedStockDetails: true,
    }));
  }

  return (
    <>
      {store.showSelectedStockDetails && <SelectedStockDetails />}
      <div className="portfolio">
        {/* Header */}
        <div className="portfolio-header">
          <div className="portfolio-name">Stock Name</div>
          <div className="portfolio-symbol">Stock Symbol</div>
          <div className="portfolio-quantity">Quantity</div>
          <div className="portfolio-avg-price">Avg. Price</div>
          <div className="portfolio-current-price">Current Price</div>
          <div className="portfolio-profit">Profit</div>
        </div>

        {/* Stock Rows */}
        {stock.map((stock, index) => (
          <div
            key={index}
            className="portfolio-row"
            onClick={() => {
              stock_details_window_opener(stock);
            }}
          >
            <div className="portfolio-name">{stock.stockname}</div>
            <div className="portfolio-symbol">{stock.stocksymbol}</div>
            <div className="portfolio-quantity">{stock.stockquantity}</div>
            <div className="portfolio-avg-price">{stock.stockavgprice}</div>
            <div className="portfolio-current-price">
              {stock.stockcurrentPrice}
            </div>
            <div className="portfolio-profit">
              {(
                (stock.stockcurrentPrice - stock.stockavgprice) *
                stock.stockquantity
              ).toFixed(2)}
            </div>
          </div>
        ))}

        {/* Total Net Profit */}
        <div className="portfolio-row total-row">
          <div className="portfolio-name">Total</div>
          <div className="portfolio-symbol"></div>
          <div className="portfolio-quantity"></div>
          <div className="portfolio-avg-price"></div>
          <div className="portfolio-current-price"></div>
          <div className="portfolio-profit">
            {stock
              .reduce(
                (total, stock) =>
                  total +
                  (stock.stockcurrentPrice - stock.stockavgprice) *
                    stock.stockquantity,
                0
              )
              .toFixed(2)}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Portfolio;
