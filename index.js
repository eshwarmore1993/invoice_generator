const { createInvoice } = require("./createInvoice.js");

const invoice = {
  shipping: {
    name: "John Doe",
    address: "1234 Main Street",
    city: "San Francisco",
    state: "CA",
    country: "US",
    postal_code: 94111
  },
  items: [
    {
      item: "Biomass Briquetts",
      description: "44011010",
      quantity: 18.87,
      rate: 4800
    }
  ],
  subtotal: 8000,
  paid: 0,
  invoice_nr: 1234
};

createInvoice(invoice, "invoice.pdf");
