const express = require('express');
const expressGraphQL = require('express-graphql');

const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]

const app = express();
const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
	GraphQLInt,
	GraphQLNonNull
} = require('graphql');

// very basic hello world program
/*const schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: "tabakade",
		fields: () => ({
			message: {
				type: GraphQLString,
				resolve: () => "Hello World!"
			}
		})
	})
})
*/

const AuthorType = new GraphQLObjectType({
	name: 'Author',
	description: 'the list of authors of the book',
	fields: () => ({
		id: {type: GraphQLNonNull(GraphQLInt)},
		name: {type: GraphQLNonNull(GraphQLString)},
		books: {
			type: new GraphQLList(BookType),
			resolve: (authors) => {
				return books.filter(book => book.authID === authors.id)
			}
		}
	})
})

const BookType = new GraphQLObjectType({
	name: 'Book',
	description: 'the list of all the books:',
	fields: () => ({
		id: { type: GraphQLNonNull(GraphQLInt)},
		name: { type: GraphQLNonNull(GraphQLString)},
		authorID: {type: GraphQLNonNull(GraphQLInt)},
		author: {
			type: AuthorType,
			resolve: (book) => {
				authors.find(author => author.id === book.authorID)
			}
		}
	})
})


const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    book: {
      type: BookType,
      description: 'A Single Book',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => books.find(book => book.id === args.id)
    },
    books: {
      type: new GraphQLList(BookType),
      description: 'List of All Books',
      resolve: () => books
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: 'List of All Authors',
      resolve: () => authors
    },
    author: {
      type: AuthorType,
      description: 'A Single Author',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => authors.find(author => author.id === args.id)
    }
  })
})

/*const RootQueryType = new GraphQLObjectType({
	name: 'Query',
	description: 'Welcome to my graphql tutorial project!',
	fields: () => ({
		book: {  // if we want a single bookk
			type: BookType,
			description: 'a single book'
			args: {
				id: {type: GraphQLInt}
			},
			resolve: (parent, args) => books.find(book => book.id === args.id)
		},
		books: {  // similar to route parameter that you enter working with rest api
			type: new GraphQLList(BookType),  
			description: "we have a list of all the books",
			resolve: () => books
		},
		authors: {  // similar to route parameter that you enter working with rest api
			type: new GraphQLList(AuthorType),  
			description: "we have a list of all the authors",
			resolve: () => authors
		},
		author: {  // if we want a single author
			type: new GraphQLList(AuthorType),  
			description: "a single author",
			args: {
				id: {type: GraphQLInt}
			},
			resolve: (parent, args) => authors.find(author => author.id === args.id)
		}
	})
})
*/

const RootMutationType = new GraphQLObjectType({
	name: 'Mutation',
	description: '',
	fields: () => ({
		addBook: {
			type: BookType,
			description: 'add a book',
			args: {
				name: {type: GraphQLNonNull(GraphQLString)},
				authorId: {type: GraphQLNonNull(GraphQLInt)}
			},
			resolve: (parent, args) => {
				const book = {id: books.length + 1, name: args.name, authorId: args.authorId}
				books.push(book);
				return book
			}
		},
		addAuthor: {
			type: AuthorType,
			description: 'adds an author',
			args: {
				name: {type: GraphQLNonNull(GraphQLString)}
			},
			resolve: (parent, args) => {
				const author = {id: authors.length + 1, name: args.name}
				authors.push(author);
				return author
			}
		}
	})
})

const schema = new GraphQLSchema({
	query: RootQueryType,
	mutation: RootMutationType
})

app.use('/graphql', expressGraphQL({
	schema: schema,
	graphiql: true
}));
app.listen(5000, () => console.log("server running!"));

// -----------------------------------------------------------------------------------------------------------






/*

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    addBook: {
      type: BookType,
      description: 'Add a book',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: (parent, args) => {
        const book = { id: books.length + 1, name: args.name, authorId: args.authorId }
        books.push(book)
        return book
      }
    },
    addAuthor: {
      type: AuthorType,
      description: 'Add an author',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: (parent, args) => {
        const author = { id: authors.length + 1, name: args.name }
        authors.push(author)
        return author
      }
    }
  })
})
*/