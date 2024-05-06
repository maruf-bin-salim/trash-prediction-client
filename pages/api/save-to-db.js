// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { addTrashData } from "@/backend/functions";

// export default function handler(req, res) {
//   res.status(200).json({ name: "John Doe" });
// }

export default async function handler(req, res) {

  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }
  let data = req.body;
  data = {
    ...data,
    timestamp: Date.now(),
  }
  try {
    await addTrashData(data);
    res.status(200).json({ message: "Data added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding data" });
  }
}