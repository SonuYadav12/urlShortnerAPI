import express from "express";
import { urlModel } from "../models/shortUrl";

export const createUrl = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    console.log("The fullUrl is ", req.body.fullUrl);
    const { fullUrl } = req.body;
    const urlFound = await urlModel.find({ fullUrl });
    if (urlFound.length > 0) {
      res.status(409).send(urlFound);
    } else {
      const shortUrl = await urlModel.create({ fullUrl });
      res.status(201).send(shortUrl);
    }
  } catch (error) {
    console.error("Error creating URL:", error);
    res.status(500).send({ message: "Something went wrong!" });
  }
};

export const getAllUrl = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const shortUrls = await urlModel.find().sort({ createdAt: -1 });
    if (shortUrls.length === 0) {
      res.status(404).send({ message: "Short URLs not found!" });
    } else {
      res.status(200).send(shortUrls);
    }
  } catch (error) {
    console.error("Error getting all URLs:", error);
    res.status(500).send({ message: "Something went wrong!" });
  }
};

export const getUrl = async (req: express.Request, res: express.Response) => {
  try {
    const shortUrl = await urlModel.findOne({ shortUrl: req.params.id });
    if (!shortUrl) {
      res.status(404).send({ message: "Full URL not found!" });
    } else {
      shortUrl.clicks++;
      await shortUrl.save();
      res.redirect(`${shortUrl.fullUrl}`);
    }
  } catch (error) {
    console.error("Error getting URL:", error);
    res.status(500).send({ message: "Something went wrong!" });
  }
};

export const deleteUrl = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const shortUrl = await urlModel.findByIdAndDelete({ _id: req.params.id });
    if (shortUrl) {
      res.status(200).send({ message: "Requested URL successfully deleted!" });
    } else {
      res.status(404).send({ message: "URL not found!" });
    }
  } catch (error) {
    console.error("Error deleting URL:", error);
    res.status(500).send({ message: "Something went wrong!" });
  }
};
