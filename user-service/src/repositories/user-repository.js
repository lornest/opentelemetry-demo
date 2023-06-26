import {pool} from '../utils/pg-pool';

const findUser = async (id) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

export { findUser };