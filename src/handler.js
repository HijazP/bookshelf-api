const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let book = books.map((item) => ({
    id: item.id,
    name: item.name,
    publisher: item.publisher,
  }));

  if (books.length > 0) {
    if (name) {
      const result = books.filter((item) => item.name.toLowerCase().includes(name.toLowerCase()));
      book = result.map((item) => ({
        id: item.id,
        name: item.name,
        publisher: item.publisher,
      }));
      const response = h.response({
        status: 'success',
        data: {
          books: book,
        },
      });
      response.code(200);
      return response;
    }

    if (reading === '0') {
      const result = books.filter((item) => !item.reading);
      book = result.map((item) => ({
        id: item.id,
        name: item.name,
        publisher: item.publisher,
      }));
      const response = h.response({
        status: 'success',
        data: {
          books: book,
        },
      });
      response.code(200);
      return response;
    }
    if (reading === '1') {
      const result = books.filter((item) => item.reading);
      book = result.map((item) => ({
        id: item.id,
        name: item.name,
        publisher: item.publisher,
      }));
      const response = h.response({
        status: 'success',
        data: {
          books: book,
        },
      });
      response.code(200);
      return response;
    }

    if (finished === '0') {
      const result = books.filter((item) => !item.finished);
      book = result.map((item) => ({
        id: item.id,
        name: item.name,
        publisher: item.publisher,
      }));
      const response = h.response({
        status: 'success',
        data: {
          books: book,
        },
      });
      response.code(200);
      return response;
    }
    if (finished === '1') {
      const result = books.filter((item) => item.finished);
      book = result.map((item) => ({
        id: item.id,
        name: item.name,
        publisher: item.publisher,
      }));
      const response = h.response({
        status: 'success',
        data: {
          books: book,
        },
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: 'success',
      data: {
        books: book,
      },
    });
    response.code(200);
    return response;
  }

  return {
    status: 'success',
    data: {
      books,
    },
  };
};

const getBooksByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((b) => b.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);
  const finished = pageCount === readPage;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBooksByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
