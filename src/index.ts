import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

app.get("/", async (request, response) => {
  await axios
    .get("https://search.hpb.com/search/suggest", {
      params: { query: "christopher moore" },
    })
    .then((res) => {
      console.log(res);
      response.send(res.data);
    });
});

app.listen(6060, () => console.log("Running"));
