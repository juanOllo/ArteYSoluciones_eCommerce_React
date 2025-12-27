import { useState } from 'react';
import { Payment, initMercadoPago } from '@mercadopago/sdk-react';

function Checkout({finalPrice, createPurchaseData}) {
  const [preferenceId, setPreferenceId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null); // <-- nuevo estado

  const purchaseData = createPurchaseData();
  console.log("purchaseData: ", purchaseData);

  initMercadoPago('TEST-c6fa5ae2-9252-4a75-9094-b7b1ff74215d', {
    locale: 'es-AR',
  });

  const renderPaymentBrick = async () => {
    const res = await fetch('http://localhost:2000/mercadopago/create-preference', { method: 'POST' });
    const { id } = await res.json();
    setPreferenceId(id);
  };

  const localSaveCustomerInfo = () => {
        // const data = localStorage.getItem("customer-data") ? JSON.parse(localStorage.getItem("customer-data")) : {};
        localStorage.setItem("customer-info", JSON.stringify({name: purchaseData.name, lastname: purchaseData.lastname, email: purchaseData.email}));
  }

  return (
    <div style={{ width: "100%" }}>
      <div id="paymentBrick_container">
        {preferenceId && (
          <Payment
            initialization={{
              amount: finalPrice,
              preferenceId: preferenceId,
            }}
            customization={{
              visual: { style: 'default' },
              paymentMethods: {
                creditCard: 'all',
                debitCard: 'all',
                ticket: 'all',
                bankTransfer: 'all',
              },
            }}
            onSubmit={async (paymentData, event) => {
              try {
                const res = await fetch('http://localhost:2000/mercadopago/process-payment', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  // body: JSON.stringify(paymentData.formData),
                  body: JSON.stringify({paymentData: paymentData.formData, purchaseData: purchaseData}),
                });
                
                // const { id, status } = await res.json();

                // // Verificás el pago
                // const verifyRes = await fetch('http://localhost:2000/mercadopago/verify-payment', {
                //   method: 'POST',
                //   headers: { 'Content-Type': 'application/json' },
                //   body: JSON.stringify({ paymentId: id }),
                // });

                // const { status: verifiedStatus } = await verifyRes.json();

                // Actualizás el estado para mostrarlo en pantalla
                // setPaymentStatus(verifiedStatus);

                const {status} = await res.json();
                // console.log("res.status: ", status);
                setPaymentStatus(status);

                return Promise.resolve();
              } catch (error) {
                console.error('Error en onSubmit:', error);
                setPaymentStatus('error');
                return Promise.reject();
              }
            }}
          />
        )}
      </div>

      <button onClick={() => {renderPaymentBrick(); localSaveCustomerInfo()}}>Pagar</button>

      {/* Mensaje visual */}
      {paymentStatus && (
        <div style={{ marginTop: 20 }}>
          {paymentStatus === 'approved' && <p style={{ color: 'green' }}>✅ Pago aprobado con éxito</p>}
          {paymentStatus === 'pending' && <p style={{ color: 'orange' }}>⏳ Pago pendiente</p>}
          {paymentStatus === 'rejected' && <p style={{ color: 'red' }}>❌ Pago rechazado</p>}
          {paymentStatus === 'error' && <p style={{ color: 'red' }}>⚠️ Ocurrió un error al procesar el pago</p>}
        </div>
      )}
    </div>
  );
}

export default Checkout;



// const body = {
//   items: [
//     {
//       id: "item-ID-1234",       // opcional pero recomendado
//       title: "Impresión 3D personalizada", // obligatorio
//       description: "Servicio de impresión 3D", // opcional
//       picture_url: "https://tusitio.com/img/producto.png", // opcional
//       category_id: "art",       // opcional
//       quantity: 1,              // obligatorio
//       currency_id: "ARS",       // obligatorio (ej: ARS, USD, BRL)
//       unit_price: 1500          // obligatorio
//     }
//   ],
//   back_urls: {
//     success: "http://localhost:2000/success",
//     failure: "http://localhost:2000/failure",
//     pending: "http://localhost:2000/pending"
//   },
//   auto_return: "approved",      // opcional, vuelve automáticamente si se aprueba
//   notification_url: "http://localhost:2000/webhook" // opcional pero MUY recomendado
// };