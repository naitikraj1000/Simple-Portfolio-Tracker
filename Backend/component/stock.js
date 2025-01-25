import axios from 'axios';



async function getStocks(req, res) {

    // https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest

    // https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest
    
    try {
        let response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
            headers: {
                'X-CMC_PRO_API_KEY': process.env.API_KEY,
            },
        })

        res.send(response.data);
    } catch (error) {
        res.send(error);
    }

}

export default getStocks;