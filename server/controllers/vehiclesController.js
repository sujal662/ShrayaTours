const Vehicle = require('../models/Vehicle');

exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createVehicle = async (req, res) => {
  const vehicle = new Vehicle(req.body);
  try {
    const newVehicle = await vehicle.save();
    res.status(201).json(newVehicle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedVehicle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
