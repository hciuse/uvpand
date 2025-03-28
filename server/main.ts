import bodyParser from "body-parser";
import cors from "cors";
import { stringify } from "csv/sync";
import express from "express";
import helmet from "helmet";

import { db } from "./database/drizzle";
import { CreateUserInteraction, user_interaction } from "./database/schema";

const app = express();

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/favicon.ico", (req, res) => {
  res.sendStatus(204);
});

app.get("/admin/data", async (req, res) => {
  const userId = req.headers["x-user-id"];
  if (!userId || userId !== "not-admin") {
    res.status(403).send("Forbidden");
    return;
  }
  const data = await db.select().from(user_interaction).execute();
  res.status(200).json(data);
});

app.post("/", async (req, res) => {
  const { body } = req;
  try {
    const userInteraction = CreateUserInteraction.parse(body);
    await db.insert(user_interaction).values(userInteraction).execute();
    res.status(200).json({
      message: "Entry added successfully",
    });
  } catch (e) {
    // Catch zod errors
    if (e instanceof Error) {
      console.log("The request body was invalid");
      console.error(e)
      res.status(400).json({
        message: "Invalid input",
        errors: e.message,
      });
      return;
    }
    console.error("An error occurred", e);
    res.status(400).json({
      message: "An error occurred",
    });
    return;
  }
});

app.post("/export", async (req, res) => {
  const userId = req.headers["x-user-id"];
  if (!userId || userId !== "not-admin") {
    res.status(403).send("Forbidden");
    return;
  }
  const data = await db.select().from(user_interaction).execute();
  const results = [];

  for (const entry of data) {
    results.push({
      id: entry.id,
      startTime: entry.startTime,
      endTime: entry.endTime,
      userId: entry.userId,
      uvType: entry.uvType,
      szenarioId: entry.szenarioId,
      protectiveMeasure: entry.protectiveMeasure,
      sliderStartIndex: entry.sliderStartIndex,
      sliderEndIndex: entry.sliderEndIndex,
      hopAnimationUsed: entry.hopAnimationUsed,
      highestHopAnimationFrame: entry.highestHopAnimationFrame,
      numberOfProtectiveMeasuresChanged: entry.numberOfProtectiveMeasuresChanged,
      timeCreated: new Date(entry.timeCreated).toISOString(),
    });
  }
  const csv = stringify(results, { header: true, quoted_string: true });
  // Send the csv file to the client
  res.header("Content-Type", "text/csv");
  res.header("Content-Disposition", "attachment; filename=data.csv");
  return res.send(csv);
});

app.listen(8000, () => {
  console.log(`Server listening on port 8000`);
});
