
-- Creación de tablas
CREATE TABLE BOOK (
    id SERIAL,
    isbn VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    descriptionB TEXT NOT NULL,
    yearReleased INTEGER,
    vol INTEGER,
    nPages INTEGER,
    publisher VARCHAR(50),
    pathBookCover VARCHAR(255) NOT NULL,

    PRIMARY KEY(id)
) ;


CREATE TABLE BOOK_FILES (
    id SERIAL,
    idBook INTEGER,
    pathF VARCHAR(255) NOT NULL,

    PRIMARY KEY(id),
    CONSTRAINT fk_idBook_files FOREIGN KEY (idBook) REFERENCES BOOK(id) ON DELETE CASCADE ON UPDATE CASCADE
) ;


CREATE TABLE BOOK_AUTHORS (
    id SERIAL,
    idBook INTEGER,
    author VARCHAR(255) NOT NULL,

    PRIMARY KEY(id),
    CONSTRAINT fk_idBook_authors FOREIGN KEY (idBook) REFERENCES BOOK(id) ON DELETE CASCADE ON UPDATE CASCADE
) ;


CREATE TABLE BOOK_LANG (
    id SERIAL,
    idBook INTEGER,
    languageB VARCHAR(50) NOT NULL,

    PRIMARY KEY(id),
    CONSTRAINT fk_idBook_lang FOREIGN KEY (idBook) REFERENCES BOOK(id) ON DELETE CASCADE ON UPDATE CASCADE
) ;


CREATE TABLE USERS (
    id SERIAL,
    nameU VARCHAR(255) NOT NULL,
    nickname VARCHAR(50) UNIQUE,
    email VARCHAR(255) UNIQUE,
    country VARCHAR(100),
    registerDate DATE NOT NULL,
    passwordU VARCHAR(255) NOT NULL,
    pathProfilePic VARCHAR(255),
    statusU BOOLEAN NOT NULL,
    isAdmin BOOLEAN NOT NULL,

    PRIMARY KEY(id)
) ;

CREATE TABLE BOOK_COMMENT (
    idComent SERIAL,
    idUser INTEGER,
    idBook INTEGER,
    dateC TIMESTAMP NOT NULL,
    textC TEXT NOT NULL,

    PRIMARY KEY(idComent),
    CONSTRAINT fk_idUser_comment_user FOREIGN KEY (idUser) REFERENCES USERS(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_idBook_comment_book FOREIGN KEY (idBook) REFERENCES BOOK(id) ON DELETE CASCADE ON UPDATE CASCADE
) ;


CREATE TABLE BOOK_RATE (
    idUser INTEGER,
    idBook INTEGER,
    rateValue INTEGER NOT NULL,

    PRIMARY KEY (idUser, idBook),
    CONSTRAINT fk_idUser_rate_user FOREIGN KEY (idUser) REFERENCES USERS(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_idBook_rate_book FOREIGN KEY (idBook) REFERENCES BOOK(id) ON DELETE CASCADE ON UPDATE CASCADE
) ;


CREATE TABLE BOOK_UPLOAD (
    idUser INTEGER,
    idBook INTEGER,
    dateUpload TIMESTAMP NOT NULL,

    PRIMARY KEY (idUser, idBook),
    CONSTRAINT fk_idUser_upload_user FOREIGN KEY (idUser) REFERENCES USERS(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_idBook_upload_book FOREIGN KEY (idBook) REFERENCES BOOK(id) ON DELETE CASCADE ON UPDATE CASCADE
) ;


CREATE TABLE BOOK_DOWNLOAD (
    idUser INTEGER,
    idBook INTEGER,
    dateDownload TIMESTAMP NOT NULL,

    PRIMARY KEY (idUser, idBook),
    CONSTRAINT fk_idUser_download_user FOREIGN KEY (idUser) REFERENCES USERS(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_idBook_download_book FOREIGN KEY (idBook) REFERENCES BOOK(id) ON DELETE CASCADE ON UPDATE CASCADE
) ;


CREATE TABLE BOOK_REPORT (
    id SERIAL,
    idUser INTEGER,
    idBook INTEGER,
    dateReport TIMESTAMP NOT NULL,
    motivation TEXT NOT NULL,
    status BOOLEAN NOT NULL,

    PRIMARY KEY (id),
    CONSTRAINT fk_idUser_report_user FOREIGN KEY (idUser) REFERENCES USERS(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_idBook_report_book FOREIGN KEY (idBook) REFERENCES BOOK(id) ON DELETE CASCADE ON UPDATE CASCADE
) ;


CREATE TABLE BOOK_DELETE (
    id SERIAL,
    idAdmin INTEGER,
    idBook INTEGER,
    dateDelete TIMESTAMP NOT NULL,
    motivation TEXT NOT NULL,

    PRIMARY KEY(id),
    CONSTRAINT fk_idUser_delete_admin FOREIGN KEY (idAdmin) REFERENCES USERS(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_idBook_delete_book FOREIGN KEY (idBook) REFERENCES BOOK(id) ON DELETE SET NULL ON UPDATE CASCADE
) ;


CREATE TABLE USER_BAN (
    id SERIAL,
    idUserBanned INTEGER,
    idAdmin INTEGER,
    motivation TEXT NOT NULL,
    dateBan TIMESTAMP NOT NULL,

    PRIMARY KEY(id),
    CONSTRAINT fk_idUser_ban_userBanned FOREIGN KEY (idUserBanned) REFERENCES USERS(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_idBook_ban_userAdmin FOREIGN KEY (idAdmin) REFERENCES USERS(id) ON DELETE SET NULL ON UPDATE CASCADE
) ;


CREATE TABLE BOOK_LIST (
    id SERIAL,
    title VARCHAR(255) NOT NULL,
    descriptionL TEXT,
    dateL DATE NOT NULL,
    idUserCreator INTEGER,
    isPublic BOOLEAN NOT NULL,

    PRIMARY KEY(id),
    CONSTRAINT fk_list FOREIGN KEY (idUserCreator) REFERENCES USERS(id) ON DELETE CASCADE ON UPDATE CASCADE
) ;


CREATE TABLE BOOK_IN_LIST (
    idBook INTEGER,
    idList INTEGER,

    PRIMARY KEY (idBook, idList),
    CONSTRAINT fk_book_list_book FOREIGN KEY (idBook) REFERENCES BOOK(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_book_list_list FOREIGN KEY (idList) REFERENCES BOOK_LIST(id) ON DELETE CASCADE ON UPDATE CASCADE
) ;


CREATE TABLE CATEGORY (
    id SERIAL,
    categoryName VARCHAR(255) NOT NULL,

    PRIMARY KEY(id)
) ;


CREATE TABLE SUBCATEGORY (
    id SERIAL,
    subCategoryName VARCHAR(255) NOT NULL,
    idCategoryFather INTEGER,

    PRIMARY KEY(id),
    CONSTRAINT fk_subCategory_father FOREIGN KEY (idCategoryFather) REFERENCES CATEGORY(id) ON DELETE CASCADE ON UPDATE CASCADE
) ;


CREATE TABLE BOOK_IN_SUBCATEGORY (
    idBook INTEGER,
    idSubcategory INTEGER,
        
    PRIMARY KEY (idBook, idSubcategory),
    CONSTRAINT fk_book_subCat_book FOREIGN KEY (idBook) REFERENCES BOOK(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_book_subCat_subCat FOREIGN KEY (idSubcategory) REFERENCES SUBCATEGORY(id) ON DELETE CASCADE ON UPDATE CASCADE

) ;