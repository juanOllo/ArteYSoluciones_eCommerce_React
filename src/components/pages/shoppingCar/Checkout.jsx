import { Payment } from '@mercadopago/sdk-react';

function Checkout() {
  const renderPaymentBrick = async () => {
    const res = await fetch('http://localhost:2000/mercadopago/create-preference', { method: 'POST' });
    const { id } = await res.json();

    const bricksBuilder = new Payment({
      initialization: {
        amount: 1500,
        preferenceId: id,
      },
      customization: {
        visual: { style: 'default' },
      },
    });

    bricksBuilder.create('paymentBrick_container');
  };

  return (
    <div>
      <div id="paymentBrick_container"></div>
      <button onClick={renderPaymentBrick}>Pagar</button>
    </div>
  );
}

export default Checkout;