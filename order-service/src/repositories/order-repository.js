import {pool} from '../utils/pg-pool';

const insertOrder = async (order) => {
  const queryText = 'INSERT INTO Orders (user_id, card_number) VALUES ($1,$2) RETURNING *';
  const values = [order.userId, order.cardNumber];
  console.log(queryText);
  console.log(values);
  const result = await pool.query(queryText, values);
  return result.rows[0];
};

export { insertOrder };
