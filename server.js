const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');
const app = express();

const corsOptions = {
  origin: ['http://localhost:5000'],
};

app.use(cors(corsOptions));
app.use(express.json());

// New GET route for rendering a basic page
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Basic Page</title>
      </head>
      <body>
        <h1>Welcome to the Basic Page</h1>
        <p>This is a simple page rendered by Express.js.</p>
      </body>
    </html>
  `);
});

app.post('/example', async (req, res) => {
  const { email } = req.body;
  try {
    console.log('Received request data with email info as :', email);
    let info ="success";
    res.json({ success: true, info});
  } catch (error) {
    console.error('Error in process:', error);
    console.log(error.response.messages)
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/upload-and-fill-pdf', async (req, res) => {
  try {
    const pdfFilePath = 'Blank2122-A.pdf'; // Replace with the actual path to your PDF file
    const outputPdf = 'Completed2122a.pdf';
    const veteranMetadata = req.body;

    if (!pdfFilePath || !veteranMetadata) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Log the received metadata
    console.log('Received Metadata:', req.body);

    // Read the existing PDF file
    const readFile = util.promisify(fs.readFile);
    const file = await readFile(pdfFilePath);
    const pdfDoc = await PDFDocument.load(file);
    const form = pdfDoc.getForm();

    const fieldsToFill = {
      'form1[0].#subform[0].VeteransFirstName[0]': veteranMetadata.veteranFirstName,
      'form1[0].#subform[0].VeteransLastName[0]': veteranMetadata.veteranLastName,
    };

    // Iterate through the specified fields and fill in text
    Object.entries(fieldsToFill).forEach(([fieldName, fieldValue]) => {
      const field = form.getTextField(fieldName);
      if (field) {
        field.setText(fieldValue);
      }
    });

    const pdfBytes = await pdfDoc.save();
    await fs.promises.writeFile(outputPdf, pdfBytes);
    console.log('PDF created with filled metadata!');


const signerName = 'Aaron';
const signerEmailAddress = 'aaron@solutionsafoot.com';

    // Send the completed PDF to BoldSign
    await sendDocument(outputPdf, signerName, signerEmailAddress);

    // Respond with a success message
    res.status(200).json({
      success: true,
      message: 'PDF filled and sent to BoldSign successfully',
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fill PDF and send to BoldSign' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
