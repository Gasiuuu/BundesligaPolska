const express = require('express');
const cors = require('cors');
const newsletterRoutes = require('./routes/newsletter');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/newsletter', newsletterRoutes);

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Newsletter is working on http://localhost:${PORT}`);
});