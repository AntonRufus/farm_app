const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const port = process.env.PORT || 8080;

const replaceTemplate = require("./modules/replaceTemplate.js");

/*| \ \*/
//FILES

/*
/!*
// Blocking, synchronous way
const text = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(text);

const textOut = `About the avocado: ${text}. Today is ${Date.now()}.`
fs.writeFileSync('./txt/output.txt', textOut);
console.log('__ is done __');
console.log('------------------------------------------------------------------------------------', '\n');
*!/


// Non-blocking, asynchronous way
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
        console.log(data2);
        if (err) return console.log('Error!');
        fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
            console.log(data3);
            fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
                console.log('final is done.');
                fs.readFile(`./txt/final.txt`, 'utf-8', (err, data4) => {
                    console.log('__________________final:___________________');
                    console.log(data4);
                    fs.readFile(`./txt/final2.txt`, 'utf-8', (err, data5) => {
                        console.log(data5);
                        if (err) return console.log('Error!');
                    });
                });
            });
        });
    });
});
console.log('Async message');
*/

/////////////////////////////////////////////////////////////////////////////////////////////////

//SERVER
//Top level code
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
//We can use SYNC version, coz we executed these files once at the beginning of load up.

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    // Product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    //Not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<b>Error 404.</b> <br/> <h1>Page not found.</h1>");
  }
});

server.listen(port, () => {
  console.log(`Listening to request on port ${port}`);
});
