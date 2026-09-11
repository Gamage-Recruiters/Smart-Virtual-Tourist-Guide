import Counter from '../../models/Safety/Counter.js';
import logger from '../logger.js';

/**
 * Atomically gets the next sequence number for a given name.
 * @param {String} name - The name of the sequence (e.g., 'incident')
 * @returns {Promise<Number>} - The next sequence number
 */
export const getNextSequence = async (name) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { name },
      { $inc: { seq: 1 } },
      { returnDocument: 'after', upsert: true }
    );
    return counter.seq;
  } catch (error) {
    logger.error(`Error getting next sequence for ${name}:`, error);
    throw error;
  }
};
