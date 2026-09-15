CREATE TABLE `match_predictions` (
	`match` text NOT NULL,
	`voter` text NOT NULL,
	`choice` text NOT NULL,
	`created` integer NOT NULL,
	PRIMARY KEY(`match`, `voter`)
);
--> statement-breakpoint
CREATE INDEX `match_predictions_match_choice` ON `match_predictions` (`match`,`choice`);--> statement-breakpoint
CREATE TABLE `player_ratings` (
	`match` text NOT NULL,
	`voter` text NOT NULL,
	`player` text NOT NULL,
	`rating` integer NOT NULL,
	`created` integer NOT NULL,
	PRIMARY KEY(`match`, `voter`, `player`)
);
--> statement-breakpoint
CREATE INDEX `player_ratings_match_player` ON `player_ratings` (`match`,`player`);