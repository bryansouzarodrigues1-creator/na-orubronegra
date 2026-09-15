CREATE TABLE `votes` (
	`poll` text NOT NULL,
	`voter` text NOT NULL,
	`player` text NOT NULL,
	`created` integer NOT NULL,
	PRIMARY KEY(`poll`, `voter`)
);
--> statement-breakpoint
CREATE INDEX `votes_poll_player` ON `votes` (`poll`,`player`);