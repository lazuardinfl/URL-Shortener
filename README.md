# URL Shortener
As one of the most useful tool, URL Shortener will create a short numbered URL that will redirect to specific website. The program implements full stack JavaScript integrated with MongoDB. Just submit a web address in the form to get a generated alias URL that will be used to redirect to the original URL.

## Usage
Try the demo [here](https://url-shortener.lazuardi.repl.co/).
- Submit URL in the form to shorten it
- base_url/api/shorturl/number will redirect to the original URL

Note: If you want to create the program yourself, you need to add .env file with var MONGO_URI. The key will be your MongoDB cluster. MongoDB is needed as a database to list all shorten URL. Go [here](https://docs.atlas.mongodb.com/getting-started/) to create one if you dont have.
