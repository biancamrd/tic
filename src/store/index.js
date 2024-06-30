import { createStore } from "vuex";
import axios from "axios";
import { auth } from "../../firebaseConfig";
import getAxiosConfig from "../services/firebaseService";
import { API_BASE_URL } from "../services/config";

const store = createStore({
  state: {
    user: null,
    authors: [],
    books: [],
    editedAuthor: { id: "", name: "", author_id: "" },
    editedBook: { id: "", title: "", description: "", picture_url: "" },
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_AUTHORS(state, authors) {
      state.authors = authors.map((author) => {
        const authorCopy = { ...author };
        authorCopy.books = state.books.filter(
          (book) => book.author_id === author.id
        );
        return authorCopy;
      });
    },
    ADD_AUTHOR(state, author) {
      state.authors.push(author);
    },
    SET_BOOKS(state, books) {
      state.books = books;
    },
    ADD_BOOK(state, book) {
      state.books.push(book);
    },
    SET_EDITED_AUTHOR(state, author) {
      state.editedAuthor = author;
    },
    SET_EDITED_BOOK(state, book) {
      state.editedBook = book;
    },
    DELETE_BOOK(state, bookId) {
      state.books = state.books.filter((book) => book.id !== bookId);
    },
    DELETE_AUTHOR(state, authorId) {
      state.authors = state.authors.filter((author) => author.id !== authorId);
      state.books.forEach((book) => {
        if (book.author_id === authorId) {
          book.author_id= "";
        }
      });
    },
    DELETE_BOOK_FROM_AUTHOR(state, bookId) {
      state.books.forEach((book) => {
        if (book.id === bookId) {
          book.author_id = "";
        }
      });
    },
    SET_BOOK_DETAILS(state, bookDetails) {
      state.bookDetails = bookDetails;
    }
  },
  actions: {
    async deleteBookFromAuthor({ commit }, book) {
      try {
        const config = await getAxiosConfig();
        await axios.delete(
          `${API_BASE_URL}/currentBooks/${book.id}`,
          config
        );
        commit("DELETE_BOOK_FROM_AUTHOR", book.id);
        commit("SET_AUTHORS", this.state.authors);
      } catch (error) {
        console.error("Error deleting the book from author", error.message);
      }
    },
    async fetchUser(context) {
      try {
        const user = auth.currentUser;
        context.commit("SET_USER", user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    },
    async createAuthor(context, { name, user_id }) {
      try {
        const config = await getAxiosConfig();
        const response = await axios.post(
          `${API_BASE_URL}/authors`,
          {
            name,
            user_id,
          },
          config
        );

        const createdAuthor = response.data;
        context.commit("ADD_AUTHOR", createdAuthor);
      } catch (error) {
        if (error.response && error.response.status === 409) {
          console.error("The author with the same name already exists:", error);
          throw error;
        } else if (error.response && error.response.status === 400) {
          console.error("Author name cannot be empty:", error);
          throw error;
        } else {
          console.error("Error adding the author:", error);
        }
      }
    },
    async fetchAuthors(context, { userId }) {
      try {
        const response = await axios.get(`${API_BASE_URL}/authors`, {
          params: { user_id: userId },
        });

        const authors = response.data;
        context.commit("SET_AUTHORS", authors);
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    },
    async createBook(context, { title, description, picture_url, user_id }) {
      try {
        const config = await getAxiosConfig();
        const response = await axios.post(
          `${API_BASE_URL}/books`,
          {
            title,
            description,
            picture_url,
            user_id,
          },
          config
        );
        const createdBook = response.data;
        context.commit("ADD_BOOK", createdBook);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.error("Book title cannot be empty:", error);
          throw error;
        } else {
          console.error("Error adding the book:", error);
        }
      }
    },
    async setEditedAuthor({ commit, state }, author) {
      try {
        commit("SET_EDITED_AUTHOR", author);
        const config = await getAxiosConfig();
        await axios.put(`${API_BASE_URL}/authors/${author.id}`, author, config);
        const updatedAuthors = state.authors.map((a) =>
          a.id === author.id ? state.editedAuthor : a
        );
        commit("SET_AUTHORS", updatedAuthors);
      } catch (error) {
        console.error("Error updating the author:", error.message);
      }
    },
    async deleteAuthor({ commit }, author) {
      try {
        const config = await getAxiosConfig();
        await axios.delete(
          `${API_BASE_URL}/authors/${author.id}`,
          config
        );
        commit("DELETE_AUTHOR", author.id);
  
        commit("SET_BOOKS", this.state.books);
        commit("SET_AUTHORS", this.state.authors);

        // Optionally update related state if needed
      } catch (error) {
        console.error("Error deleting the author:", error.message);
      }
    },
    async setEditedBook({ commit, state }, book) {
      try {
        commit("SET_EDITED_BOOK", book);
        const config = await getAxiosConfig();
        await axios.put(
          `${API_BASE_URL}/books/${book.id}`,
          book,
          config
        );

        const updatedBooks = state.books.map((b) =>
          b.id === book.id ? state.editedBook : b
        );

        commit("SET_BOOKS", updatedBooks);
        commit("SET_AUTHORS", state.authors);
      } catch (error) {
        console.error("Error updating the book:", error.message);
      }
    },
    async deleteBook({ commit }, book) {
      try {
        const config = await getAxiosConfig();
        await axios.delete(
          `${API_BASE_URL}/books/${book.id}`,
          config
        );
        commit("DELETE_BOOK", book.id);
        commit("SET_BOOKS", this.state.books);
        commit("SET_AUTHORS", this.state.authors);
        // Optionally update related state if needed
      } catch (error) {
        console.error("Error deleting the book:", error.message);
      }
    },
    async fetchBooks(context, { userId }) {
      try {
        const response = await axios.get(`${API_BASE_URL}/books`, {
          params: { user_id: userId },
        });

        const books = response.data;
        context.commit("SET_BOOKS", books);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    },
  },
  
  
  async getBookDetails({ commit }, bookId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/books/${bookId}`);
      const bookDetails = response.data;
      commit("SET_BOOK_DETAILS", bookDetails);
    } catch (error) {
      console.error("Error fetching book details:", error);
      // Poți trata erorile aici, cum ar fi afișarea unui mesaj de eroare utilizatorului
    }
  },



});

export default store;
