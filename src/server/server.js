const express = require("express");
const cors = require("cors");
const { WebpayPlus, Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } = require("transbank-sdk");

const app = express();
app.use(cors());
app.use(express.json());

// Crear la transacción con la configuración correcta
const tx = new WebpayPlus.Transaction(
  new Options(
    IntegrationCommerceCodes.WEBPAY_PLUS,
    IntegrationApiKeys.WEBPAY,
    Environment.Integration
  )
);

// Endpoint para crear una transacción
app.post("/create-transaction", async (req, res) => {
  const { amount, buyOrder, sessionId, returnUrl } = req.body;

  try {
    const response = await tx.create(buyOrder, sessionId, amount, returnUrl);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para confirmar la transacción
app.post("/commit-transaction", async (req, res) => {
  const { token } = req.body;

  try {
    const response = await tx.commit(token);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Backend corriendo en el puerto 3000"));
