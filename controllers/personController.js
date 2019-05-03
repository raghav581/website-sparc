var Person = require("../models/person");

//Show all Persons
exports.person_list = function(req, res) {
  Person.find({}).exec(function(err, list_Person) {
    if (err) {
      throw err;
    }
    res.send(list_Person);
  });
  //res.send('NOT IMPLEMENTED: Enquiry list');
};

//
exports.person_create = function(req, res) {
  var person = new Person({
    name: req.body.name,
    comments: req.body.comments,
    position: req.body.position,
    education: req.body.education
  });

  
  person.save(function(err) {
    if (err) {
      throw err;
    }
    res.render('edit-about',{
        status: true
    });
  });

  //res.send('NOT IMPLEMENTED: Enquiry create POST');
};
