import crypto from 'crypto';

/**
 * Generate PayHere checkout hash.
 * Formula: MD5(merchant_id + order_id + amount + currency + MD5(merchant_secret).toUpperCase())
 */
export const generatePaymentHash = ({ orderId, amount, currency }) => {
  const merchantId = String(process.env.PAYHERE_MERCHANT_ID || '').trim();
  const merchantSecret = String(process.env.PAYHERE_MERCHANT_SECRET || '').trim();

  // Step 1: Hash the merchant secret → uppercase
  const hashedSecret = crypto
    .createHash('md5')
    .update(merchantSecret)
    .digest('hex')
    .toUpperCase();

  // Step 2: Format amount to 2 decimal places
  const formattedAmount = Number(amount || 0).toFixed(2);

  // Step 3: Concatenate and hash
  const rawString = merchantId + String(orderId).trim() + formattedAmount + String(currency).trim() + hashedSecret;

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
