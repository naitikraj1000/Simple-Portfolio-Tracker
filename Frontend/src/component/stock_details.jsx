import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "./Context/storecontext";
import "./stock_details.css";

function SelectedStockDetails() {
  const { store, setStore } = useContext(StoreContext);

  const [transactions, setTransactions] = useState([]);

  const [newQuantity, setNewQuantity] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDate, setNewDate] = useState("");

  const getTransactions = async () => {
    const { name: stockname, symbol: stocksymbol } = store.currstock;
    const { user_email } = store;

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const url = `${backendUrl}/getuserstock?stockname=${encodeURIComponent(
        stockname
      )}&stocksymbol=${encodeURIComponent(
        stocksymbol
      )}&user_email=${encodeURIComponent(user_email)}`;

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      setTransactions(data.data);
    } catch (error) {
      console.error("Error in getTransactions:", error.message);
    }
  };

  const handleAddTransaction = async () => {
    if (
      newQuantity.trim() !== "" &&
      newPrice.trim() !== "" &&
      newDate.trim() !== "" &&
      parseFloat(newQuantity) > 0 &&
      parseFloat(newPrice) > 0
    ) {
      const newTransaction = {
        date: newDate,
        stockquantity: parseFloat(newQuantity),
        stockavgprice: parseFloat(newPrice),
        stockname: store.currstock.name,
        stocksymbol: store.currstock.symbol,
        user_email: store.user_email,
      };

      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      try {
        const response = await fetch(`${backendUrl}/addstock`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTransaction),
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        newTransaction.transaction_id = data.transaction_id;
        console.log("Transaction added successfully", data);
        setTransactions((prev) => [...prev, newTransaction]);
        setStore((prev) => ({ ...prev, portfolioUpdated: !prev.portfolioUpdated }));

        console.log("Transactions:", transactions);
      } catch (error) {
        console.log(error);
      }
      setNewQuantity("");
      setNewPrice("");
      setNewDate(""); // Reset date input
    } else {
      alert("Please enter valid Quantity, Buy Price, and Date.");
    }
  };

  const handleEditTransaction = async (index) => {
    const currentTransaction = transactions[index];
    const editedDate = prompt(
      "Enter new date (YYYY-MM-DD):",
      currentTransaction.date
    );
    const editedQuantity = prompt(
      "Enter new quantity:",
      currentTransaction.stockquantity
    );
    const editedPrice = prompt(
      "Enter new buy price:",
      currentTransaction.stockavgprice
    );

    if (
      editedDate !== null &&
      editedQuantity !== null &&
      editedPrice !== null &&
      editedDate.trim() !== "" &&
      parseFloat(editedQuantity) > 0 &&
      parseFloat(editedPrice) > 0
    ) {
      let newTransactions = {
        date: editedDate,
        stockquantity: parseFloat(editedQuantity),
        stockavgprice: parseFloat(editedPrice),
        stockname: store.currstock.name,
        stocksymbol: store.currstock.symbol,
        user_email: store.user_email,
        transaction_id: currentTransaction.transaction_id,
      };
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        let response = await fetch(`${backendUrl}/updatestock`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTransactions),
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        setTransactions((prev) =>{
          let temp_transactions = [...prev];
          temp_transactions[index] = newTransactions;
          return temp_transactions;
        })
        setStore((prev) => ({ ...prev, portfolioUpdated: !prev.portfolioUpdated }));

        console.log("Transaction updated successfully", data);

      } catch (error) {
        console.error("Error updating transaction:", error.message);
      }
    } else {
      alert("Please enter valid Date, Quantity, and Buy Price.");
    }
  };

  const handleDeleteTransaction = async (index) => {
    const transactionToDelete = transactions[index];
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      const response = await fetch(`${backendUrl}/deletestock`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transaction_id: transactionToDelete.transaction_id,
          user_email:store.user_email,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP Error: ${response.status}`);
      }

      setTransactions((prev) => prev.filter((_, idx) => idx !== index));
      setStore((prev) => ({ ...prev, portfolioUpdated: !prev.portfolioUpdated }));

      console.log("Transaction deleted successfully");
    } catch (error) {
      console.error("Error deleting transaction:", error.message);
    }
  };

  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.currstock]);

  const calculateTotalProfit = () => {
    if (!store.currstock.price) return 0;
    const currentPrice = parseFloat(store.currstock.price);
    return transactions
      .reduce((total, txn) => {
        const profit = (currentPrice - txn.stockavgprice) * txn.stockquantity;
        return total + profit;
      }, 0)
      .toFixed(2);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div
          className="go-to-home"
          onClick={() => {
            setStore((prev) => ({
              ...prev,
              showSelectedStockDetails: false,
            }));
          }}
        >
          Close
        </div>

        <div className="stock-selected-header">
          <div>Stock Name: {store.currstock.name}</div>
          <div>Stock Symbol: {store.currstock.symbol}</div>
          <div>Stock Price: {store.currstock.price}</div>
          <div>Total Profit: {calculateTotalProfit()}</div>
        </div>

        <div className="stock-selected-transaction-data">
          <div className="transaction-header">
            <div>Date</div>
            <div>Quantity</div>
            <div>Average Price</div>
            <div>Amount</div>
            <div>Edit</div>
            <div>Delete</div>
          </div>

          {transactions.map((transaction, index) => (
            <div
              key={transaction.transaction_id || index}
              className="transaction-row"
            >
              <div>{transaction.date}</div>
              <div>{transaction.stockquantity}</div>
              <div>{transaction.stockavgprice}</div>
              <div>
                {(
                  transaction.stockquantity * transaction.stockavgprice
                ).toFixed(2)}
              </div>
              <button
                className="edit-button"
                onClick={() => handleEditTransaction(index)}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => handleDeleteTransaction(index)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <div className="stock-selected-transaction">
          <label htmlFor="stock-date">Date</label>
          <input
            type="date"
            id="stock-date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
          <label htmlFor="stock-quantity">Quantity</label>
          <input
            type="number"
            id="stock-quantity"
            min={0}
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
          />
          <label htmlFor="stock-price">Buy Price</label>
          <input
            type="number"
            id="stock-price"
            min={0}
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
          />
          <div className="stock-selected-buttons">
            <button className="add-button" onClick={handleAddTransaction}>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectedStockDetails;
