const fs = require("fs");
const PDFDocument = require("pdfkit");
const {ToWords} = require('to-words');
const toWords = new ToWords({
    localeCode: 'en-IN',
    converterOptions: {
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
    }
});

function createInvoice(invoice, path) {
    let doc = new PDFDocument({size: "A4", margin: 50});

    generateHeader(doc);
    generateCustomerInformation(doc, invoice);
    generateInvoiceTable(doc, invoice);
    generateFooter(doc);

    doc.end();
    doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc) {
    doc
        .image("logo.png", 50, 45, {width: 50})
        .fillColor("#444444")
        .fontSize(20)
        .text("Biobriqqs Inc.", 110, 57)
        .fontSize(10)
        .text("Biobriqqs Inc.", 200, 50, {align: "right"})
        .text("123 Main Street", 200, 65, {align: "right"})
        .text("New York, NY, 10025", 200, 80, {align: "right"})
        .text("Contact No. " + "7769940521", 200, 95, {align: "right"})
        .text("Email. " + "xyz@gmail.com", 200, 110, {align: "right"})
        .text("GST No. " + "ABCDJSHSHSHSHSHSS23S", 200, 125, {align: "right"})
        .text("PAN No. " + "CJOPM6026A", 200, 140, {align: "right"})
        .moveDown();
}

function generateCustomerInformation(doc, invoice) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("Invoice", 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
        .fontSize(10)
        .text("Invoice Number:", 300, customerInformationTop)
        .font("Helvetica-Bold")
        .text(invoice.invoice_nr, 400, customerInformationTop)
        .font("Helvetica")
        .text("Invoice Date:", 300, customerInformationTop + 15)
        .text(formatDate(new Date()), 400, customerInformationTop + 15)
        .text("PO No:", 300, customerInformationTop + 30)
        .text(
            "12",
            400,
            customerInformationTop + 30
        )
        .text("DC No:", 300, customerInformationTop + 45)
        .text(
            "",
            400,
            customerInformationTop + 45
        )
        .text("Vendor Code:", 300, customerInformationTop + 60)
        .text(
            "",
            400,
            customerInformationTop + 60
        )
        .text("Vehicle No:", 300, customerInformationTop + 75)
        .text(
            "",
            400,
            customerInformationTop + 75
        )
        .text("Delivered To:", 300, customerInformationTop + 90)
        .text(
            "Pune",
            400,
            customerInformationTop + 90
        )

        .font("Helvetica-Bold")
        .text(invoice.shipping.name, 50, customerInformationTop)
        .font("Helvetica")
        .text(invoice.shipping.address, 50, customerInformationTop + 15)
        .text(
            invoice.shipping.city +
            ", " +
            invoice.shipping.state +
            ", " +
            invoice.shipping.country,
            50,
            customerInformationTop + 30
        )
        .text("DHADJHDJSAHDAJSDHAS", 50, customerInformationTop + 45)
        .moveDown();

    generateHr(doc, 307);
}

function generateInvoiceTable(doc, invoice) {
    let i;
    const invoiceTableTop = 330;

    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        invoiceTableTop,
        "Item",
        "HSN Code",
        "Rate",
        "Quantity(Ton)",
        "Amount (Rs)"
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");

    let total = 0;
    for (i = 0; i < invoice.items.length; i++) {
        const item = invoice.items[i];
        const position = invoiceTableTop + (i + 1) * 30;
        generateTableRow(
            doc,
            position,
            item.item,
            item.description,
            formatCurrency(item.rate),
            item.quantity,
            formatCurrency(item.rate * item.quantity)
        );

        generateHr(doc, position + 20);
        total += item.rate * item.quantity;
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
        doc,
        subtotalPosition,
        "",
        "",
        "Total",
        "",
        formatCurrency(total)
    );

    const sgstPosition = subtotalPosition + 20;
    const sgst = formatCurrency(total * 0.025);
    generateTableRow(
        doc,
        sgstPosition,
        "",
        "",
        "SGST (2.5%)",
        "",
        sgst
    );

    const cgstPosition = sgstPosition + 25;
    const cgst = formatCurrency(total * 0.025);
    doc.font("Helvetica");
    generateTableRow(
        doc,
        cgstPosition,
        "",
        "",
        "CGST (2.5%)",
        "",
        cgst
    );

    const grandTotalPosition = cgstPosition + 25;
    const grandTotal = total + Number.parseInt(sgst) + Number.parseInt(cgst);
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        grandTotalPosition,
        "",
        "",
        "Grand Total",
        "",
        formatCurrency(grandTotal)
    );

    const grandTotalInWordsPosition = grandTotalPosition + 25;
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        grandTotalInWordsPosition,
        "Rs In words: " + toWords.convert(grandTotal),
        "",
        "",
        "",
        ""
    );


    doc.font("Helvetica");
}

function generateFooter(doc) {
    doc
        .fontSize(10)
        .text(
            "Payment is due within 15 days of delivery. Thank you for your business.",
            50,
            780,
            {align: "center", width: 500}
        );
}

function generateTableRow(
    doc,
    y,
    item,
    description,
    unitCost,
    quantity,
    lineTotal
) {
    doc
        .fontSize(10)
        .text(item, 50, y)
        .text(description, 150, y)
        .text(unitCost, 280, y, {width: 90, align: "right"})
        .text(quantity, 370, y, {width: 90, align: "right"})
        .text(lineTotal, 0, y, {align: "right"});
}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}

function formatCurrency(cents) {
    return (cents).toFixed(0);
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + "/" + month + "/" + day;
}

module.exports = {
    createInvoice
};
