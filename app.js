const express = require('express')
const bodyParser = require('body-parser')
const validator = require("email-validator");

const {MongoClient} = require('mongodb');
const Fuse = require('fuse.js')
const alert =  require('alert')
const mongodb = require('./mongodb') 

//()
// const books = [{
		
// 		bookID: "1",
// 		bookName: "Rudest Book Ever",
// 		bookAuthor: "Shwetabh Gangwar",
// 		bookGenre: "Mistery"
// 	},
// 	{
// 		bookID: "2",
// 		bookName: "Do Epic Shit",
// 		bookAuthor: "Ankur Wariko",
// 		bookGenre: "Horror"
// 	}
// ]

async function main()
{

	const uri = "mongodb+srv://deehan:deehan1997@cluster0.7jxxgwk.mongodb.net/?retryWrites=true&w=majority";
 

    const client = new MongoClient(uri);
	await client.connect();
	const books =await mongodb.findAllBooks(client);
	const users =await mongodb.findAllUsers(client);

	if(users.length > 0){
		console.log(`app Found all listing in the collection`);
		users.forEach((result, i) => {
			
			console.log();
			console.log(`${i + 1}. username: ${result.username}`);
	
		});
		const app = express()
		// --------------------------------------------------------------------------


		// ----------------------------------------------------------------------------
		app.set('view engine', 'ejs')

		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({
			extended: true
		}))

		app.get("/", function (req, res) {
			res.render("login_singup",{data:books})
		})

		app.post("/view-search-history", function (req, res) {
			
			const inputUserId = req.body.user
			
			var result = []
			result.push({
				bookname: "-",
				link: "-"
			})
			console.log("inside history route")
			users.forEach(user =>{
				if(user._id==inputUserId){
					result = user.search_history
				}
			})
			
			
			// inputUser.search_history.forEach(history =>{
			// 	result.push({
			// 		bookname: history.BookName,
			// 		link: history.pdf
			// 	})
			// })

			res.render("searchHistory", {
				data: result})
			
		})



		app.post("/log-in", function (req, res) {

			const inputUsername = req.body.username;
			const inputPassword = req.body.password;
			
			var validUser = {
				_id: "",
				username: "",
				password: "",
				search_history: ""
			}
			
			if(users.length>0){
				let flag=0
				users.forEach(user => {
					
					if (user.username == inputUsername && user.password == inputPassword  ) {
						flag=1
						validUser = {
							_id: user._id,
							username: user.username,
							password: user.password,
							search_history: user.search_history
						}
						
					}
				})
				if(flag==0){
					alert("Invalid Log in!")
				}
				else{
					console.log("validUser:")
					console.log(validUser)
					res.render("home", {
						data_one: books,
						data_two: validUser
						})
				}
		}
		
		})

		app.post("/sign-up", function (req, res) {

			const inputUsername = req.body.username;
			const inputPassword = req.body.password;
			let flag= 0
			users.forEach(user => {
			if (user.username == inputUsername) {
				alert('A user with this email already exists!')
				flag = 1
			}

			})
			if(!validator.validate(inputUsername)){
				alert("Invaid mail address!")
				flag=1
			}
			if(flag==0 ){
				const newUser = {
					username : inputUsername,
					password : inputPassword,
					search_history : []
				}
				mongodb.createListingUsers(client,newUser).then(insertedId => {
					alert("sign up successful!")
					users.push({
						_id : insertedId,
						username: inputUsername,
						password: inputPassword,
						search_history : []
					})
		
					res.render("home", {
						data_one: books,
						data_two: {
							_id : insertedId,
							username: inputUsername,
							password: inputPassword,
							search_history : []

						}
					})
				});
				
			}
		})

		app.post('/search-by-name', (req, res) => {
			var requestedBookName = req.body.BookName;
			let inputUserid = req.body.userid;

			
			
			console.log(`requested bookname : ${requestedBookName}`);
			const books_search = [{
				
				_id: "-",
				BookName: "-",
				Author: "-",
				Genre: "-",
				pdf: ""
			}
		]
		const fuse = new Fuse(books, {
			keys: ['BookName']
		})
		
		// Search
		const result = fuse.search(requestedBookName)
		
		result.forEach(row => {
			console.log(row.item)
			books_search.push({
				_id: row.item._id,
				BookName: row.item.BookName,
				Author: row.item.Author,
				Genre: row.item.Genre,
				pdf: row.item.pdf
			})
		})

		users.forEach(user => {
			if (user._id == inputUserid) {
				if(user.search_history.length <= 15){
					user.search_history.push(books_search[1])
				}
				else{
					user.search_history.shift()
					user.search_history.push(books_search[1])
				}
				mongodb.updateUserListingbyID(client,inputUserid,{
					_id: user._id,
					username: user.username,
					password: user.password,
					search_history: user.search_history})
			}

			})

			res.render("searchResult", {
				data: books_search
				
			})
			
		})

		app.post('/search-by-author', (req, res) => {
			var requestedBookAuthor = req.body.Author;
			let inputUserid = req.body.userid;

			const books_search = [{
				
				_id: "-",
				BookName: "-",
				Author: "-",
				Genre: "-",
				pdf: ""
			}
		]
		const fuse = new Fuse(books, {
			keys: ['Author']
		})
		
		// Search
		const result = fuse.search(requestedBookAuthor)
		
		result.forEach(row => {
			console.log(row.item)
			books_search.push({
				_id: row.item._id,
				BookName: row.item.BookName,
				Author: row.item.Author,
				Genre: row.item.Genre,
				pdf: row.item.pdf
			})
		})

		users.forEach(user => {
			if (user._id == inputUserid) {
				if(user.search_history.length <= 15){
					user.search_history.push(books_search[1])
				}
				else{
					user.search_history.shift()
					user.search_history.push(books_search[1])
				}
				mongodb.updateUserListingbyID(client,inputUserid,{
					_id: user._id,
					username: user.username,
					password: user.password,
					search_history: user.search_history})
			}

			})

			res.render("searchResult", {
				data: books_search
				
			})
			
		})

		app.post('/search-by-genre', (req, res) => {
			var requestedBookGenre = req.body.Genre;
			let inputUserid = req.body.userid;
			const books_search = [{
				
				_id: "-",
				BookName: "-",
				Author: "-",
				Genre: "-",
				pdf: ""
			}
		]

		const fuse = new Fuse(books, {
			keys: ['Genre']
		})
		
		// Search
		const result = fuse.search(requestedBookGenre)
		
		result.forEach(row => {
			console.log(row.item)
			books_search.push({
				_id: row.item._id,
				BookName: row.item.BookName,
				Author: row.item.Author,
				Genre: row.item.Genre,
				pdf: row.item.pdf
			})
		})
		
			// books.forEach(book => {
			// 	if (book.Genre.toLowerCase().includes(requestedBookGenre.toLowerCase())) {
			// 		books_search.push({
			// 			_id: book._id,
			// 			BookName: book.BookName,
			// 			Author: book.Author,
			// 			Genre: book.Genre
			// 		})
					
			// 	}
			// })
			users.forEach(user => {
				if (user._id == inputUserid) {
					if(user.search_history.length <= 15){
						user.search_history.push(books_search[1])
					}
					else{
						user.search_history.shift()
						user.search_history.push(books_search[1])
					}
					mongodb.updateUserListingbyID(client,inputUserid,{
						_id: user._id,
						username: user.username,
						password: user.password,
						search_history: user.search_history})
				}
	
				})

			res.render("searchResult", {
				data: books_search
				
			})
			
		})




		app.listen(3000, (req, res) => {
			console.log("App is running on port 3000")
		})

	}


}

main()

// const app = express()
// // --------------------------------------------------------------------------


// // ----------------------------------------------------------------------------
// app.set('view engine', 'ejs')

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
// 	extended: true
// }))

// app.get("/", function (req, res) {
// 	res.render("home", {
// 		data: books
// 	})
// })


// app.post('/search-by-name', (req, res) => {
// 	var requestedBookName = req.body.bookName;
// 	const books_search = [{
		
// 		bookID: "BOOK ID",
// 		bookName: "BOOK NAME",
// 		bookAuthor: "BOOK AUTHOR",
// 		bookGenre: "GENRE"
// 	}
// ]
// 	books.forEach(book => {
// 		if (book.bookName.toLowerCase().includes(requestedBookName)) {
// 			books_search.push({
// 				bookID: book.bookID,
// 				bookName: book.bookName,
// 				bookAuthor: book.bookAuthor,
// 				bookGenre: book.bookGenre
// 			})
			
// 		}
// 	})

// 	res.render("searchResult", {
// 		data: books_search
		
// 	})
	
// })

// app.post('/search-by-author', (req, res) => {
// 	var requestedBookAuthor = req.body.bookAuthor;
// 	const books_search = [{
		
// 		bookID: "end of result",
// 		bookName: "end of result",
// 		bookAuthor: "end of result",
// 		bookGenre: "end of result"
// 	}
// ]
// 	books.forEach(book => {
// 		if (book.bookAuthor.toLowerCase().includes(requestedBookAuthor)) {
// 			books_search.push({
// 				bookID: book.bookID,
// 				bookName: book.bookName,
// 				bookAuthor: book.bookAuthor,
// 				bookGenre: book.bookGenre
// 			})
			
// 		}
// 	})

// 	res.render("searchResult", {
// 		data: books_search
		
// 	})
	
// })

// app.post('/search-by-genre', (req, res) => {
// 	var requestedBookGenre = req.body.bookGenre;
// 	const books_search = [{
		
// 		bookID: "BOOK ID",
// 		bookName: "BOOK NAME",
// 		bookAuthor: "BOOK AUTHOR",
// 		bookGenre: "GENRE"
// 	}
// ]
// 	books.forEach(book => {
// 		if (book.bookGenre.toLowerCase().includes(requestedBookGenre)) {
// 			books_search.push({
// 				bookID: book.bookID,
// 				bookName: book.bookName,
// 				bookAuthor: book.bookAuthor,
// 				bookGenre: book.bookGenre
// 			})
			
// 		}
// 	})

// 	res.render("searchResult", {
// 		data: books_search
		
// 	})
	
// })



// // app.post('/return', (req, res) => {
// // 	var requestedBookName = req.body.bookName;
// // 	books.forEach(book => {
// // 		if (book.bookName == requestedBookName) {
// // 			book.bookState = "Available";
// // 		}
// // 	})
// // 	res.render("home", {
// // 		data: books
// // 	})
// // })



// app.listen(3000, (req, res) => {
// 	console.log("App is running on port 3000")
// })
