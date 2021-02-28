import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { standardOptions } from "./model/source-options";

const app = express();
app.use(bodyParser.json());

const url =
  "https://search.hpb.com/search/advanced?&size=10&include=hits&language=ENG&from=0&keywords=agatha+christie";

const basePageUrl = "https://search.hpb.com/search/advanced";
const include = `include=hits`;
const language = `language=ENG`;
const from = `from=0`;
const keywords = `what you're searching`;

const searchRouter = express.Router();
searchRouter.use(bodyParser.json());

searchRouter.get("/search", async (request, response) => {
  const searchTerm = request.query.search;
  let page: string;

  const source = standardOptions.join(",");

  if (request.query.page) {
    page = request.query.page as string;
  } else {
    page = "0";
  }

  if (!searchTerm) {
    response.send({ error: "Unable to search. Please try again" });
    return;
  }

  await axios
    .get("https://search.hpb.com/search/advanced", {
      params: {
        _source: source,
        size: "10",
        include: "hits",
        language: "ENG",
        from: page,
        keywords: searchTerm,
        type: "Catalog::Book",
      },
    })
    .then((res) => {
      response.send(res.data);
    });
});

searchRouter.get("/top-results", async (request, response) => {
  const searchTerm = request.query.search;
  const byAuthor = request.query.by; // in the format of [lastname, firstname] have to get from live-search.
  let page: string;

  const source = standardOptions.join(",");

  if (request.query.page) {
    page = request.query.page as string;
  } else {
    page = "0";
  }

  if (!searchTerm) {
    response.send({ error: "Unable to search. Please try again" });
    return;
  }

  await axios
    .get("https://search.hpb.com/search/advanced", {
      params: {
        _source: source,
        size: "10",
        include: "hits",
        language: "ENG",
        from: page,
        keywords: searchTerm,
        inHpbStock: "true",
        sort: "salesRankHpbWeb:desc",
        type: "Catalog::Book",
        author: "Moore, Christopher",
      },
    })
    .then((res) => {
      response.send(res.data);
    });
});

searchRouter.get("/live-search", async (request, response) => {
  const searchTerm = request.query.search;

  if (!searchTerm) {
    response.send({ error: "Unable to search. Please try again" });
    return;
  }

  await axios
    .get("https://search.hpb.com/search/suggest", {
      params: { query: searchTerm },
    })
    .then((res) => {
      response.send(res.data);
    });
});

app.get("/product", async (request, response) => {
  const slug = request.query.slug;
  const source = standardOptions.join(",");

  if (!slug) {
    response.send({ error: "Unable to find product" });
    return;
  }

  await axios
    .get(`https://search.hpb.com/product/slug/${slug}`, {
      params: {
        _source: source,
      },
    })
    .then((res) => {
      response.send(res.data);
    });
});

app.use("/search", searchRouter);

app.listen(6060, () => console.log("Running"));
