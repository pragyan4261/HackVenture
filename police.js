const MongoClient = require('mongodb').MongoClient;

// Connection URL and database name
const url = 'mongodb://localhost:27017';
const dbName = 'crime_reports';

// Severity threshold
const severityThreshold = 4; // Highest severity level for prediction

// Date range for previous week
const currentDate = new Date();
const startDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

// Machine learning model for crime severity prediction
// You will need to replace this with your own implementation
const predictCrimeSeverity = (location, date) => {
  // TODO: Implement machine learning model
  return 3; // Placeholder value for severity level (between 1 and 5)
};

// Function to calculate the highest number of crimes committed in any one day of the week, relative to their severity level
const calculateMaxDailySeverity = (crimes) => {
  const dailyCounts = [0, 0, 0, 0, 0];
  const dailyMaxSeverities = [0, 0, 0, 0, 0];

  for (let i = 0; i < crimes.length; i++) {
    const crime = crimes[i];
    const dayOfWeek = crime.date.getDay();
    dailyCounts[dayOfWeek]++;
    if (crime.severity > dailyMaxSeverities[dayOfWeek]) {
      dailyMaxSeverities[dayOfWeek] = crime.severity;
    }
  }

  const maxDailySeverity = Math.max(...dailyMaxSeverities);
  return maxDailySeverity;
};

// Connect to MongoDB
MongoClient.connect(url, (err, client) => {
  console.log('Connected successfully to server');

  const db = client.db(dbName);

  // User input
  const location = 'New York City';
  const inputDate = new Date('2023-05-01');

  // Query database for crimes in location and date range
  db.collection('crimes').find({
    location: location,
    date: {
      $gte: startDate,
      $lt: inputDate,
    },
  }).toArray((err, crimes) => {
    if (err) throw err;

    const numCrimes = crimes.length;
    const maxDailySeverity = calculateMaxDailySeverity(crimes);
    const crimeFrequency = numCrimes / 7;
    const predictedSeverity = predictCrimeSeverity(location, inputDate);
    })