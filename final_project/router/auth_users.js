const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  matchedUsers = users.filter((user)=> user.username == username)

  if(matchedUsers.length >0)
  {
    return true;
  }
  else{
    return false;
  }
}

const authenticatedUser = (username,password)=>{ 
  authnticatedList = users.filter((user)=> (user.username==username&&user.password==password))
  if(authnticatedList.length>0)
  {
    return true;
  }
  else{
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  username = req.body.username
  password = req.body.password
  if(!username || !password)
  {
    return res.status(404).json({message:"Error Missing Body Parameters"})
  }
    if(authenticatedUser(username,password))
    {

      let accessToken = jwt.sign({data:password},"Can I Have It",{expiresIn:60*60})

      req.session.authorization ={
        accessToken,username
      }
      return res.status(200).send("User successfully logged in");

    }else{
      return res.status(404).json({message:"Invalid Login Check Username And Password"})
    }
 


});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  isbn = req.params.isbn
  user = req.session.authorization['username']
  review = req.query.review

  book = books[isbn]
  if(!book){
    return res.status(404).json({message:"Book Not Found"})
  }
  book.reviews[user] = review
  books[isbn] = book
  

  res.send("Review Added Successfully")
  

});


// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  isbn = req.params.isbn
  user = req.session.authorization['username']

  book = books[isbn]
  if(!book){
    return res.status(404).json({message:"Book Not Found"})
  }
  delete(book.reviews[user])
  

  res.send("Review Deleted Successfully")
  

});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
