// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
  switch (req.method) {
    case "POST": {
      console.log("got a POST request!");
      res.statusCode = 200;
      res.send("got it");
    }
  }
}
