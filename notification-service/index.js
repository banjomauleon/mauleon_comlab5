const amqp = require('amqplib');

async function connect() {
  const conn = await amqp.connect(process.env.BROKER_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue('PaymentSucceeded');

  channel.consume('PaymentSucceeded', (msg) => {
    const order = JSON.parse(msg.content.toString());
    console.log('Sending notification for order:', order.id);
    channel.ack(msg);
  });
}

connect().then(() => console.log('Notification Service running'));