const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());


app.post('/api/orders', async (req, res) => {
  try {
    const response = await fetch(`http://order-service:3000/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "yyyyyyyyyyyyyyyyyyyyyyyyyyyy"});
  }
});

const PORT = 8080;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));