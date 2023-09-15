import {pool} from '../utils/pg-pool';

const createOrder = async (order) => {
  const queryText = 'INSERT INTO Orders (user_id, payment_card) VALUES ($1,$2) RETURNING *';
  const values = [order.userId, order.paymentCard];
  const result = await pool.query(queryText, values);
  return result.rows[0];
};

export { createOrder };
