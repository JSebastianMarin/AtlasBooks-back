import { pool } from "../db.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

// Obtén la ruta del archivo actual (este módulo)
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Get books from the data base
 * @param {*} req
 * @param {*} res
 */
export const getBooks = async (req, res) => {
  try {
    const db_result = await pool.query("SELECT * FROM BOOK");
    res.send({ message: "ruta de los libros", rows: db_result.rows });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Get a single book information by its id from the data base
 * @param {*} req
 * @param {*} res
 */
export const getBook = async (req, res) => {
  try {
    const idBook = req.params.id;
    const query_book = await pool.query("SELECT * FROM BOOK WHERE id = $1", [
      idBook,
    ]);

    // Si no se encuentra el libro, devolver un error 404
    if (query_book.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    //Get book's authors
    const query_book_authors = await pool.query(
      "SELECT * FROM BOOK_AUTHORS WHERE idBook = $1",
      [idBook]
    );

    //Get book's languages
    const query_book_lang = await pool.query(
      "SELECT * FROM BOOK_LANG WHERE idBook = $1",
      [idBook]
    );

    //Get book's files
    const query_book_files = await pool.query(
      "SELECT * FROM BOOK_FILES WHERE idBook = $1",
      [idBook]
    );

    res.status(201).send({
      idBook,
      data: {
        book_info: query_book.rows,
        book_authors: query_book_authors.rows,
        book_lang: query_book_lang.rows,
        book_filesPaths: query_book_files.rows,
      },
    });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).send({ error: "Error getting the book" });
  }
};

/**
 * Create a book in the db
 * @param {*} req
 * @param {*} res
 */
export const createBook = async (req, res) => {
  try {
    //getting data
    const {
      isbn,
      title,
      descriptionB,
      yearReleased,
      vol,
      nPages,
      publisher,
      //multivalued fields
      authors,
      languages,
    } = req.body;

    //Get path book cover
    const cover = req.files["cover"] ? req.files["cover"][0].filename : null;

    // ==== insert into BOOK table =====
    const query_values = [
      isbn,
      title,
      descriptionB,
      yearReleased,
      vol,
      nPages,
      publisher,
      cover,
    ];

    const newBook_query = await pool.query(
      "INSERT INTO BOOK (isbn, title, descriptionB, yearReleased, vol, nPages, publisher, pathBookCover) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
      query_values
    );

    // ==== insert into BOOK_FILES talbe =====
    // -- getting the auto increment id of BOOK
    const bookId = newBook_query.rows[0].id;

    // -- Get the paths of uploaded files
    const bookFiles = req.files["bookFiles"]
      ? req.files["bookFiles"].map((file) => file.path)
      : [];

    if (bookFiles.length > 0) {
      const fileQueries = bookFiles.map((path) =>
        pool.query("INSERT INTO BOOK_FILES (idBook, pathF) VALUES ($1, $2)", [
          bookId,
          path,
        ])
      );
      await Promise.all(fileQueries);
    }

    // ==== insert into BOOK_AUTHORS talbe =====
    const insertAuthorQueries = authors.map(async (author) => {
      pool.query("INSERT INTO BOOK_AUTHORS (idBook, author) VALUES ($1, $2)", [
        bookId,
        author,
      ]);
    });
    await Promise.all(insertAuthorQueries);

    // ==== insert into BOOK_LANG talbe =====
    const insertLanguageQueries = languages.map(async (language) => {
      pool.query("INSERT INTO BOOK_LANG (idBook, languageB) VALUES ($1, $2)", [
        bookId,
        language,
      ]);
    });
    await Promise.all(insertLanguageQueries);

    // ==== response ====
    res.status(201).send({ message: "Book created successfully" });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).send({ error: "Failed to create book" });
  }
};

/**
 * Update book info in the db
 * @param {*} req
 * @param {*} res
 */
export const updateBook = async (req, res) => {};

/**
 * Delete a book in the db
 * @param {*} req
 * @param {*} res
 */
export const deleteBook = async (req, res) => {};
