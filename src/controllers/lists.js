import { pool } from "../db.js";

  /**
 * Create a list in the db
 * @param {*} req
 * @param {*} res
 */
export const createList = async (req, res) => {
    try {
      // Getting data from the request body
      const { 
        title, 
        descriptionL, 
        dateL, 
        idUserCreator, 
        isPublic 
    } = req.body;
  
      // Preparing values for the query
      const query_values = [
        title,
        descriptionL,
        dateL,
        idUserCreator,
        isPublic
    ];
  
      // Inserting the new list into the LIST table
      const newList_query = await pool.query(
        "INSERT INTO BOOK_LIST (title, descriptionL, dateL, idUserCreator, isPublic) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        query_values
      );
  
      // Getting the auto-incremented id of the new list
      const listId = newList_query.rows[0].id;
  
      // Sending response
      res.status(201).send({ message: "List created successfully", listId });
    } catch (error) {
      console.error("Error creating list:", error);
      res.status(500).send({ error: "Failed to create list" });
    }
  };
  
  /**
 * Get a single book information by its id from the data base
 * @param {*} req
 * @param {*} res
 */
export const getList = async (req, res) => {
  try {
    const idList = req.params.id;
    const query_list = await pool.query("SELECT * FROM BOOK_LIST WHERE id = $1", [
      idList,
    ]);

    // Si no se encuentra la lista, devolver un error 404
    if (query_list.rows.length === 0) {
      return res.status(404).json({ error: "List not found" });
    }

    
    //Send response
    res.status(201).send({
      idList,
      title: query_list.rows[0].title,
      descriptionL: query_list.rows[0].descriptionl,
      dateL: query_list.rows[0].datel,
      idUserCreator: query_list.rows[0].idusercreator,
      isPublic: query_list.rows[0].ispublic,
    });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).send({ error: "Error getting the book" });
  }
};
