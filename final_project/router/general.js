const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password =req.body.password

  if(username && password)
  {
    if(!isValid(username)){
      let user = {username:username,password:password}
      users.push(user)
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    }else{
      return res.status(404).json({message:"Error User Name Already Exist"})
    }
  }else{
    return res.status(404).json({message:"Error Missing body parameters"})
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

  promise = new Promise((resolve,reject)=>{
    resolve(JSON.stringify(books,null,4));
  })
  promise.then((data)=>{res.send(data)})
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  isbn = req.params.isbn;

  promise = new Promise((resolve,reject)=>{
    resolve(books[isbn]);
  })

  promise.then((data)=>{res.send(data)})
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author
  promise = new Promise((resolve,reject)=>{
    newBooks = []

  for (k in books){
    if(books[k].author == author)
    {
      newBooks.push(books[k])
    }
    
  }
  resolve(newBooks)
  })
  

  promise.then((data)=>res.send(data))


});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title

  promise = new Promise((resolve,reject)=>{
    newBooks = []

  for (k in books){
    if(books[k].title == title)
    {
      newBooks.push(books[k])
    }
    
  }
  resolve(newBooks)
  })
  

  promise.then((data)=>res.send(data))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  isbn = req.params.isbn;
  res.send(books[isbn].reviews)
});



module.exports.general = public_users;
