import { db } from "../config/db.js";

/**
 * Represents a base model for interacting with a database table.
 * Extend this class to create a repository for a specific table.
 * @abstract
 * @class
 */
export default class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
    this.pool = db.getPool();
  }

  async executeQuery(queryText, params, client = this.pool) {
    const beginTime = performance.now();
    const result = await client.query(queryText, params);
    const endTime = performance.now();

    console.log(`Query executed in ${endTime - beginTime}ms:`, {
      query: queryText,
      params,
      rowCount: result.rowCount,
    });

    return result.rows;
  }

  async findAll() {
    const query = `SELECT * FROM ${this.tableName}`;
    const rows = await this.executeQuery(query);
    return rows.length > 0 ? rows : null;
  }

  async findById(id) {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
    const rows = await this.executeQuery(query, [id]);
    return rows?.[0] || null;
  }

  async findWhere(conditions) {
    const keys = Object.keys(conditions);
    const values = Object.values(conditions);
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE ${keys.map((key, i) => `${key} = $${i + 1}`).join(" AND ")}`;

    const rows = await this.executeQuery(query, values);
    return rows.length > 0 ? rows : null;
  }

  async create(data, client = this.pool) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const query = `
      INSERT INTO ${this.tableName} (${keys.join(", ")})
      VALUES (${keys.map((_, i) => `$${i + 1}`).join(", ")})
      RETURNING *`;
    const rows = await this.executeQuery(query, values, client);
    return rows[0];
  }

  async update(id, data, client = this.pool) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const query = `
      UPDATE ${this.tableName}
      SET ${keys.map((key, i) => `${key} = $${i + 1}`).join(", ")}
      WHERE id = $${keys.length + 1} RETURNING *`;

    const rows = await this.executeQuery(query, [...values, id], client);
    return rows[0];
  }

  async delete(id, client = this.pool) {
    // TODO: Implement this
    throw new Error("Method not implemented");
  }

  async softDelete(id, client = this.pool) {
    // TODO: Implement this
    /*
    const query = `
      UPDATE ${this.tableName}
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING *
    `;
    
    const rows = await this.executeQuery(query, [id]);
    return rows[0];
    */
    throw new Error("Method not implemented");
  }

  /**
   * Executes the provided callback operation within a transaction.
   * Use it when dealing with multiple queries that depend on each other.
   *
   * @param {Function} operation - The operation to be executed within the transaction.
   * @returns {Promise<any>} - A promise that resolves with the result of the operation.
   * @throws {Error} - If an error occurs during the transaction, it will be thrown.
   */
  async transaction(operation) {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");

      // pass the client to the operation
      const result = await operation(client);

      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
