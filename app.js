const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const morgan = require('morgan');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(morgan); //Use morgan for logging

app.get("/", (req, res) => res.render("index"));

app.get('/searchForm', (req, res)=>{
	res.render('searchForm');
});
app.get("/searchQuery", (req,res) => {
	// get data from the search query which has name movieName
	var movieName = req.query.movieName;
	var searchOption = req.query.searchOption;

	var url = "";
	if(searchOption === 'title')
		url = 'https://www.omdbapi.com/?apikey=f28b2a6c&t=' + movieName;
	else if(searchOption === 'imdb')
		url = 'https://www.omdbapi.com/?apikey=f28b2a6c&i=' + movieName;
	else if(searchOption === undefined)
		url = 'https://www.omdbapi.com/?apikey=f28b2a6c&s=' + movieName;
	

	request(url, (error,response,body) =>{
		if(!error && response.statusCode == 200) {
			var data = JSON.parse(body);
			if(data.Response == 'True') {
				console.log(data);
				res.render("moviePage", {data,searchOption});
			} else
				res.render("error");
		}


	});

});

app.listen(process.env.PORT|| 4000,() => console.log("App Started"));
