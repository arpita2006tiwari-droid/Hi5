require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin (using env variables for security)
// In production, you would use a service account JSON
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || 'hi5-foundation-76527'
  });
}

const db = admin.firestore();

// Routes
const aiRoutes = require('./routes/aiRoutes');
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'SPORTIFY Brain Online', version: '1.0.0' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 SPORTIFY Brain running on port ${PORT}`);
});
