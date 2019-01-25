const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', 'views');

const watsonRoutes = require('./routes/watson');

app.use(watsonRoutes);

app.use(function (request, response) {
  response.status(404).render("404");
});

app.listen(port, () => {
  console.log('Express app started on port ' + port);
})