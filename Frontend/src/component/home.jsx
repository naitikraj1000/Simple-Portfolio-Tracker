import "./home.css";
import { useEffect, useState, useContext } from "react";
import Signin from "./signin";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "./Context/storecontext";
import { ToastContainer, toast } from "react-toastify";
import SelectedStockDetails from "./stock_details";

function extract_info(stock) {
  const data = {
    name: stock.name.length > 18 ? stock.name.slice(0, 18) : stock.name,
    symbol: stock.symbol.length > 15 ? stock.symbol.slice(0, 15) : stock.symbol,
    price: stock.quote.USD.price,
    market_cap: stock.quote.USD.market_cap,
    volume_24h: stock.quote.USD.volume_24h,
    percent_change_24h: stock.quote.USD.percent_change_24h,
  };

  return data;
}

function Home() {
  const [stock, setStock] = useState([]); 
  const [stock_info, setStock_info] = useState([]); // data from the API call
  const [sortParams, setSortParams] = useState(
    new Map([
      ["name", ">"],
      ["symbol", ">"],
      ["price", ">"],
      ["volume_24h", ">"],
      ["market_cap", ">"],
      ["percent_change_24h", ">"],
    ])
  );

  const { store, setStore } = useContext(StoreContext);
  async function getStocks() {
    let backendUrl = import.meta.env.VITE_BACKEND_URL;
    console.log(" Backend URL ", backendUrl);
    try {
      let response = await fetch(`${backendUrl}/getStocks`);

      let data = await response.json();
      data = data.data;
      let stock_data = data.map((stock) => {
        return extract_info(stock);
      });
      setStock_info(stock_data);
      setStock(stock_data);
      let stock_share_live_price = stock_data.map((stock) => {
        return {
          stocksymbol: stock.symbol,
          stockprice: stock.price,
        };
      });
      setStore((prev) => ({
        ...prev,
        stock_data: stock_share_live_price,
      }));
    } catch (error) {
      console.log(error);
    }
  }

  function search_modify_stock(search_text) {
    console.log(" Search Text ", search_text);
    let stock_data = stock_info.filter((stock) =>
      stock.name.toLowerCase().includes(search_text.toLowerCase())
    );

    setStock(stock_data);
  }

  function sort_stock_helper(search_by) {
    console.log(" Search By ", search_by);
    let ch1 = sortParams.get(search_by);
    if (ch1 == ">") {
      setSortParams((prev) => new Map([...prev.set(search_by, "<")]));
    } else {
      setSortParams((prev) => new Map([...prev.set(search_by, ">")]));
    }

    let stock_data = stock;
    if (ch1 == ">") {
      stock_data.sort((a, b) => {
        const numA = parseFloat(a[search_by]);
        const numB = parseFloat(b[search_by]);

        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return b[search_by]
          .toLowerCase()
          .localeCompare(a[search_by].toLowerCase());
      });

      setStock((prev) => [...stock_data]);
      let stock_data1 = stock_info;
      stock_data1.sort((a, b) => {
        const numA = parseFloat(a[search_by]);
        const numB = parseFloat(b[search_by]);

        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }

        return b[search_by]
          .toLowerCase()
          .localeCompare(a[search_by].toLowerCase());
      });
      setStock_info((prev) => [...stock_data1]);
    } else {
      stock_data.sort((a, b) => {
        const numA = parseFloat(a[search_by]);
        const numB = parseFloat(b[search_by]);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numB - numA;
        }

        return a[search_by]
          .toLowerCase()
          .localeCompare(b[search_by].toLowerCase());
      });

      setStock((prev) => [...stock_data]);
      let stock_data1 = stock_info;
      stock_data1.sort((a, b) => {
        const numA = parseFloat(a[search_by]);
        const numB = parseFloat(b[search_by]);

        if (!isNaN(numA) && !isNaN(numB)) {
          return numB - numA;
        }

        return a[search_by]
          .toLowerCase()
          .localeCompare(b[search_by].toLowerCase());
      });
      setStock_info((prev) => [...stock_data1]);
    }
  }

  function sort_stock_data(e) {
    let search_by = e.target.className;
    search_by = search_by.split(" ")[0];
    search_by = search_by.substring(6);
    console.log(" Search By ", search_by);
    if (search_by == "volume") {
      search_by = "volume_24h";
    }
    if (search_by == "market-cap") {
      search_by = "market_cap";
    }
    if (search_by == "change") {
      search_by = "percent_change_24h";
    }

    sort_stock_helper(search_by);
  }

  function stock_details_window_opener(stock) {
    if (store.isauth) {
      console.log("Stock Details Window Opener ", stock);
      setStore((prev) => ({
        ...prev,
        currstock: stock,
        showSelectedStockDetails: true,
      }));
    } else {
      toast.error("Please Signin to view stock details");
    }
  }
  useEffect(() => {
    getStocks();
  }, []);

  useEffect(() => {
    search_modify_stock(store.search_text);
  }, [store.search_text]);

  return (
    <>
      <>
        <div className="home-container">
          {store.showSelectedStockDetails && <SelectedStockDetails />}
          <div className="stock-details">
            <div
              className="stock-details-header"
              onClick={(e) => sort_stock_data(e)}
            >
              <div className="stock-name stock-details-design">Stock Name</div>
              <div className="stock-symbol stock-details-design">
                Stock Symbol
              </div>
              <div className="stock-price stock-details-design">
                Stock Price
              </div>
              <div className="stock-volume stock-details-design">
                Stock Volume
              </div>
              <div className="stock-market-cap stock-details-design">
                Stock Market Cap
              </div>
              <div className="stock-change stock-details-design">
                Stock Change
              </div>
            </div>

            {stock.map((stock, index) => (
              <div
                key={index}
                className="stock-details-data"
                onClick={() => {
                  stock_details_window_opener(stock);
                }}
              >
                <div className="stock-name stock-details-design">
                  {stock.name}
                </div>
                <div className="stock-symbol stock-details-design">
                  {stock.symbol}
                </div>
                <div className="stock-price stock-details-design">
                  {stock.price}
                </div>
                <div className="stock-volume stock-details-design">
                  {stock.volume_24h}
                </div>
                <div className="stock-market-cap stock-details-design">
                  {stock.market_cap}
                </div>
                <div className="stock-change stock-details-design">
                  {`${stock.percent_change_24h}%`}
                </div>
              </div>
            ))}
          </div>
        </div>
        <ToastContainer />
      </>
    </>
  );
}

export default Home;
