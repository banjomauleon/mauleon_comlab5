const amqp = require('amqplib');

async function connect() {
  const conn = await amqp.connect(process.env.BROKER_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue('OrderPlaced');
  await channel.assertQueue('PaymentSucceeded');

  channel.consume('OrderPlaced', async (msg) => {
    const order = JSON.parse(msg.content.toString());
    console.log('Processing payment for order:', order.id);
    const paymentResult = { ...order, paymentStatus: 'success' };
    channel.sendToQueue('PaymentSucceeded', Buffer.from(JSON.stringify(paymentResult)));
    channel.ack(msg);
  });
}

connect().then(() => console.log('Payment Service running'));