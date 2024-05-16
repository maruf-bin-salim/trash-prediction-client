// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getLatestTrashData } from "@/backend/functions";

let classes = ["cardboard", "glass", "metal", "paper", "plastic", "trash"];

// export default function handler(req, res) {
//   res.status(200).json({ name: "John Doe" });
// }

export default async function handler(req, res) {

  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    let data = await getLatestTrashData();

    if (!data) {
      res.status(200).json(null);
      return;
    }

    res.status(200).json({
      class: data.prediction.name,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding data" });
  }
}