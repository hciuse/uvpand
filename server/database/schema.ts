import { boolean, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";

export const user_interaction = pgTable("user_interaction", {
  id: serial("id").primaryKey(),
  startTime: varchar("start_time").notNull(),
  endTime: varchar("end_time").notNull(),
  userId: text("user_id").notNull(),
  uvType: varchar("uv_type").notNull(),
  szenarioId: integer("szenario_id").notNull(),
  protectiveMeasure: varchar("protective_measure").notNull(),
  sliderStartIndex: integer("slider_start_index").notNull(),
  sliderEndIndex: integer("slider_end_index").notNull(),
  hopAnimationUsed: boolean("hop_animation_used").notNull(),
  highestHopAnimationFrame: integer("highest_hop_animation_frame").notNull(),
  numberOfProtectiveMeasuresChanged: integer("number_of_protective_measures_changed").notNull(),
  timeCreated: timestamp("time_created", {
    mode: "string",
  })
    .notNull()
    .defaultNow(),
});

export const CreateUserInteraction = z.object({
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  userId: z.string().min(1),
  uvType: z.string().min(1),
  szenarioId: z.number(),
  protectiveMeasure: z.string().min(1),
  sliderStartIndex: z.number(),
  sliderEndIndex: z.number(),
  hopAnimationUsed: z.boolean(),
  highestHopAnimationFrame: z.number(),
  numberOfProtectiveMeasuresChanged: z.number(),
});

export type CreateUserInteraction = z.infer<typeof CreateUserInteraction>;
