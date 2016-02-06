var express = require("express");
var app = express();

var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/message_board');
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded());

var path = require("path");
app.use(express.static(__dirname + "/static"));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
var Schema = mongoose.Schema;


var MessageSchema = new mongoose.Schema({
    message : String,
    name: String,
    created_at : {type: Date, default: new Date},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
});
mongoose.model('Message', MessageSchema);
var Message = mongoose.model('Message');



var server = app.listen(8000, function() {
  console.log("listening on port 8000");
})





var CommentSchema = new mongoose.Schema({
    _message: {type: Schema.Types.ObjectId, ref: 'Message'},
    comment: String,
    name: String,
    created_at: {type: Date, default: new Date}
});
mongoose.model('Comment', CommentSchema);
var Comment = mongoose.model('Comment');


app.get('/', function(req, res) {
  Message.find({}, function(err, messages) {
        }).populate('comments')
          .exec(function(err, messages) {
            res.render('index', {messages: messages});
          })
})









app.post('/message', function(req, res) {
  var message = new Message({message: req.body.message, name: req.body.name});
  console.log(message);
  message.save(function(err) {
    if(err) {
      console.log("something went wrong");
    } else {
      res.redirect('/');
    }
  })
})



app.post('/message/:id', function(req, res) {
  Message.findOne({_id: req.params.id}, function(err, message) {
    var comment = new Comment({comment: req.body.comment, name : req.body.name});
    console.log(comment.comment);

    comment._message = message._id;
    message.comments.push(comment);
    console.log(message);

    comment.save(function(err) {
      message.save(function(err) {
        if(err) {
          console.log("error!");
        } else {
          res.redirect('/');
        }
      });
    });
  });
});



app.post('/delete_message/:id', function(req, res) {
  Message.remove({_id : req.params.id}, function() {
    res.redirect('/');
  })
})







