import Cors from "micro-cors";
import { NextApiRequest, NextApiResponse } from "next";
import stripeInit from "stripe";
import verifyStripe from "@webdeveducation/next-verify-stripe";
import clientPromise from "../../../lib/mongodb";

const cors = Cors({ allowMethod: ["POST", "HEAD"] });

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new stripeInit(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    let event: { type: any; data: { object: any } };
    try {
      event = await verifyStripe({
        req,
        stripe,
        endpointSecret,
      });
    } catch (e) {
      console.log("Error: ", e);
    }
    switch (event.type) {
      case "payment_intent.succeeded": {
        const client = await clientPromise;

        const db = client.db("JinyBlog");

        const paymentIntent = event.data.object;
        const auth0Id = paymentIntent.metadata.sub;

        await db.collection("users").updateOne(
          {
            auth0Id,
          },
          {
            $inc: {
              availableTokens: 10,
            },
            $setOnInsert: {
              auth0Id,
            },
          },
          {
            upsert: true,
          }
        );
      }
      default:
        console.log("UNHANDLED EVENT: ", event.type);
    }
    res.status(200).json({ received: true });
  }
};

export default cors(handler);
