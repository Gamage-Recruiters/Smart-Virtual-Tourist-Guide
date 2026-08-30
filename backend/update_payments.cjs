const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'src', 'models');
const filesToUpdate = [
  'ActivityBooking.js',
  'DriverBooking.js',
  'GuideBooking.js',
  'HotelBooking.js',
  'RestaurantBooking.js',
  'VehicleBooking.js'
];

const newPaymentBlock = `    payment: {
      method: { type: String, default: 'card' },
      cardBrand: { type: String },
      last4: { type: String },
      expiryDate: { type: String },
      paidAt: { type: Date },
      payhereOrderId: { type: String },
      payherePaymentId: { type: String },

      paymentStatus: {
        type: String,
        enum: [
          'pending', 'paid', 'failed', 'refunded', 'full-refunded', 'partial-refunded', 'pending refunded'
        ],
        default: 'pending',
      },

      refundAmount: { type: Number, default: 0 },
      refundReason: { type: String },
      refundDate: { type: Date },
      refundHistory: [
        {
          amount: Number,
          reason: String,
          date: Date
        }
      ],
      refundTransactionId: { type: String },
      cancellationAccountablePerson: { type: String },
    },`;

filesToUpdate.forEach(file => {
  const filePath = path.join(modelsDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Match starting with exactly 4 spaces "    payment: {" 
    // up to exactly 4 spaces "    },"
    const regex = /^ {4}payment:\s*\{[\s\S]*?^ {4}\},/m;
    
    if (regex.test(content)) {
      content = content.replace(regex, newPaymentBlock);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated payment in ${file}`);
    } else {
      console.log(`Could not find payment block in ${file}`);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
});
