// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// // User Schema
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });

// // Middleware for password hashing
// userSchema.pre('save', async function (next) {
//   console.log('Hashing password for:', this.username); // Debug log

//   if (!this.isModified('password')) return next(); // Prevent hashing on password updates if not modified

//   const salt = await bcrypt.genSalt(10); // Generate salt
//   this.password = await bcrypt.hash(this.password, salt); // Hash password
//   console.log('Password Hashed:', this.password); // Debug log

//   next();
// });

// // Method to compare passwords for login
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// // Export the model
// const User = mongoose.model('User', userSchema);
// module.exports = User;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Middleware for password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export with a specific connection
module.exports = (connection) => connection.model('User', userSchema);
