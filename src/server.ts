import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  app.get( "/filteredimage", async ( req: Request, res: Response ) => {
    const image_url: string = req.query.image_url;
    // validate the image_url query
    if (!image_url) {
      return res.status(400).send({ message: "Image url is required or malformed" });
    }
    // call filterImageFromURL(image_url) to filter the image
    try {
      const photo: string = await filterImageFromURL(image_url);
      if(!photo) {
        return res.status(500).send({ message: "Can\'t load photo"});
      }
      // send the resulting file in the response
      res.status(200).sendFile(photo);
    } catch(e) {
      res.status(422).send({ message: "Check if the image url points to a valid file." });
    }

  } );
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: Request, res: Response ) => {
    res.send("Deployed! try GET /filteredimage?image_url={{}}")
  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();