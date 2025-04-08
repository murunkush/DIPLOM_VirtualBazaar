// adminController.js
const getAdminData = (req, res) => {
    res.send('Admin data fetched successfully');
  };
  
  const updateAdminData = (req, res) => {
    res.send('Admin data updated successfully');
  };
  
  module.exports = { getAdminData, updateAdminData };
  