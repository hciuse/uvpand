CREATE TABLE IF NOT EXISTS "user_interaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"start_time" varchar NOT NULL,
	"end_time" varchar NOT NULL,
	"user_id" text NOT NULL,
	"uv_type" varchar NOT NULL,
	"szenario_id" integer NOT NULL,
	"protective_measure" varchar NOT NULL,
	"slider_start_index" integer NOT NULL,
	"slider_end_index" integer NOT NULL,
	"hop_animation_used" boolean NOT NULL,
	"highest_hop_animation_frame" integer NOT NULL,
	"number_of_protective_measures_changed" integer NOT NULL,
	"time_created" timestamp DEFAULT now() NOT NULL
);
