import crypto from 'crypto';

/**
 * Generate PayHere checkout hash.
 * Formula: MD5(merchant_id + order_id + amount + currency + MD5(merchant_secret).toUpperCase())
 */
export const generatePaymentHash = ({ orderId, amount, currency }) => {
  const merchantId = process.env.PAYHERE_MERCHANT_ID;
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

  // Step 1: Hash the merchant secret → uppercase
  const hashedSecret = crypto
    .createHash('md5')
    .update(merchantSecret)
    .digest('hex')
    .toUpperCase();

  // Step 2: Format amount to 2 decimal places
  const formattedAmount = parseFloat(amount).toFixed(2);

  // Step 3: Concatenate and hash
  const rawString = merchantId + orderId + formattedAmount + currency + hashedSecret;

  const hash = crypto
    .createHash('md5')
    .update(rawString)
    .digest('hex')
    .toUpperCase();

  return hash;
};

/**
 * Verify PayHere notification signature (md5sig).
 * Formula: MD5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + MD5(merchant_secret).toUpperCase())
 */
export const verifyNotification = ({ merchant_id, order_id, payhere_amount, payhere_currency, status_code, md5sig }) => {
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

  const hashedSecret = crypto
    .createHash('md5')
    .update(merchantSecret)
    .digest('hex')
    .toUpperCase();

  const rawString = merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret;

  const localHash = crypto
    .createHash('md5')
    .update(rawString)
    .digest('hex')
    .toUpperCase();

  return localHash === md5sig;
};
