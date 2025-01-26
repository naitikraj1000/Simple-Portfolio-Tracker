# Portfolio Tracker

This is a simple Portfolio Tracker application built using React.js, Express.js, and PostgreSQL.

## Features

- **Registration/Sign-In**: Secure user authentication.
- **Live Stock Updates**: Automatically fetches and updates stock data every 5 minutes using the CoinMarketCap API.
- **Portfolio Management**: Add, delete, and update stock entries.
- **Profit and Loss Overview**: View your financial performance in your profile.

## Technologies Used

- **Frontend**: React.js  
- **Backend**: Express.js  
- **Database**: PostgreSQL  

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)  
- [PostgreSQL](https://www.postgresql.org/)  

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Configure the Environment Variables

#### Frontend

In the `frontend` directory, create a `.env` file with the following content:
```env
VITE_BACKEND_URL=<backend-server-url>
```

Replace `<backend-server-url>` with the URL where your backend server is running (e.g., `http://localhost:5000`).

#### Backend

In the `backend` directory, create a `.env` file with the following content:
```env
API_KEY=<your-coinmarketcap-api-key>
JWT_SECRET_KEY='your-secret-key'
FRONTEND_URL='your-frontend-url'
DATABASE_URL=<your-database-connection-string>
```

Replace `<your-coinmarketcap-api-key>` with your API key for CoinMarketCap and `<your-database-connection-string>` with the connection string for your PostgreSQL database.

### 3. Run the Frontend

1. Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm run dev
    ```

### 4. Run the Backend

1. Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm run dev
    ```

## Usage

1. Open your browser and navigate to the frontend development server (typically at `http://localhost:5173`).
2. Register or sign in to your account.
3. Add, delete, or update stock entries to track your portfolio.
4. View live updates and analyze your profit/loss in your profile.

## Stock Updates

Stock updates are fetched every 5 minutes using the [CoinMarketCap API](https://coinmarketcap.com/api/). Ensure that you have a valid API key configured in the backend `.env` file under the `API_KEY` variable.

## Deployment

The application is deployed on [Railway](https://railway.app). You can access it using the following link:

[Portfolio Tracker Deployment](https://simple-portfolio-tracker-production-9067.up.railway.app/)

### Disclaimer

**Please note:** Since the application is hosted on Railway, there may be a delay in response times and functionality due to the platform's cold start behavior.

## Troubleshooting

- Ensure the PostgreSQL server is running and accessible.
- Verify that the backend server is correctly connected to the database.
- Check for errors in the console/logs for both frontend and backend.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

Happy Coding! 🎉
