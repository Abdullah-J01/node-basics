const fs = require("fs");

const requestHandler = (req, res) => {
    const url = req.url;
  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter a Message</title></head>");
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message" /><input type="submit" value="Send" /></form></body>'
    );
    res.write("</html>");
    return res.end();
  }

  if (url === "/message" && req.method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });

    return req.on("end", () => {
      // using return here to execute this before executing next line (like default async behaviour of node would do)
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      //   fs.writeFileSync("message.txt", message); // this is synchronous, so it pauses all the execution
      fs.writeFile("message.txt", message, (err) => {
        // using node js callback approach to stay performant and not block code
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>Node JS server</title></head>");
  res.write("<body><h1>Hello from Node JS server</h1></body>");
  res.write("</html>");
  res.end();
};

module.exports = requestHandler;
