import express from 'express';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 3000;

app.get('/api/transactions/:walletAddress', async (req, res) => {
    const walletAddress = req.params.walletAddress;
    const url = 'https://api.mainnet-beta.solana.com';

    const requestBody = {
        jsonrpc: '2.0',
        id: 1,
        method: 'getConfirmedSignaturesForAddress2',
        params: [
            walletAddress,
            { limit: 1000 } // Adjust as needed
        ]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Error fetching transactions: ${response.statusText}`);
        }

        const result = await response.json();

        // Simulate the transformation of raw transaction data to your desired structure.
        const transformedData = result.result.map(tx => ({
            uuid: uuidv4(),
            network: 'Solana',
            fee: 5000, // Placeholder value
            compute_units_consumed: 150, // Placeholder value
            timestamp: new Date(tx.blockTime * 1000).toISOString(),
            type: 'send_token', // Placeholder value; determine based on actual data
            wallet_address: walletAddress,
            transaction_hash: tx.signature,
            metadata: {
                amount: '-6000' // Placeholder value; adjust based on actual data
            },
            token: {
                uuid: uuidv4(),
                network: 'Solana',
                contract_address: 'So11111111111111111111111111111111111111112', // Placeholder value
                name: 'Wrapped SOL', // Placeholder value
                symbol: 'SOL', // Placeholder value
                decimals: 9,
                display_decimals: 2,
                logo_url: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png' // Placeholder value
            },
            explorer_url: `https://solscan.io/tx/${tx.signature}?cluster=mainnet-beta`
        }));

        res.json({
            status: 'success',
            message: 'Activity retrieved successfully',
            data: transformedData
        });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
