const amqp = require('amqplib');

async function connect() {
  const conn = await amqp.connect(process.env.BROKER_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue('OrderPlaced');

  channel.consume('OrderPlaced', (msg) => {
    const order = JSON.parse(msg.content.toString());
    console.log('Updating inventory for order:', order.id);
    channel.ack(msg);
  });
}

connect().then(() => console.log('Inventory Service running'));