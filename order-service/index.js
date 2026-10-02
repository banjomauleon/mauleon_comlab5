const express = require('express');
const amqp = require('amqplib');
const app = express();

app.use(express.json());

let channel;

async function connectRabbitMQ() {
  const conn = await amqp.connect(process.env.BROKER_URL);
  channel = await conn.createChannel();
  await channel.assertQueue('OrderPlaced');
  await channel.assertQueue('PaymentSucceeded');
}

app.post('/orders', async (req, res) => {
  const order = { id: Date.now(), ...req.body, status: 'placed' };
  channel.sendToQueue('OrderPlaced', Buffer.from(JSON.stringify(order)));
  res.json(order);
});

connectRabbitMQ().then(() => {
  app.listen(3000, () => console.log('Order Service on port 3000'));
});