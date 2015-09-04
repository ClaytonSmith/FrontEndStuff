
/*
 * GET home page.
 */

exports.index = function(req, res){
  console.log('Hello');
  res.render('index');
};

exports.partials = function (req, res) {
  var name = req.params.name;
  console.log(name, name, name, name);
  res.render('partials/' + name);
};
