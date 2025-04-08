// disputeController.js
const createDispute = (req, res) => {
    res.send('Dispute created successfully');
  };
  
  const resolveDispute = (req, res) => {
    res.send('Dispute resolved successfully');
  };
  
  module.exports = { createDispute, resolveDispute };
  