CREATE TABLE `fan_chat_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`voter` text NOT NULL,
	`nickname` text NOT NULL,
	`body` text NOT NULL,
	`status` text DEFAULT 'visible' NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `fan_chat_status_created` ON `fan_chat_messages` (`status`,`created`);--> statement-breakpoint
CREATE INDEX `fan_chat_voter_created` ON `fan_chat_messages` (`voter`,`created`);--> statement-breakpoint
CREATE TABLE `fan_opinion_votes` (
	`opinion` text NOT NULL,
	`voter` text NOT NULL,
	`choice` text NOT NULL,
	`created` integer NOT NULL,
	PRIMARY KEY(`opinion`, `voter`)
);
--> statement-breakpoint
CREATE INDEX `fan_opinion_votes_opinion_choice` ON `fan_opinion_votes` (`opinion`,`choice`);--> statement-breakpoint
CREATE TABLE `fan_opinions` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`voter` text NOT NULL,
	`nickname` text NOT NULL,
	`body` text NOT NULL,
	`player` text,
	`status` text DEFAULT 'visible' NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `fan_opinions_kind_status_created` ON `fan_opinions` (`kind`,`status`,`created`);--> statement-breakpoint
CREATE INDEX `fan_opinions_voter_created` ON `fan_opinions` (`voter`,`created`);--> statement-breakpoint
CREATE TABLE `fan_reports` (
	`kind` text NOT NULL,
	`content` text NOT NULL,
	`voter` text NOT NULL,
	`created` integer NOT NULL,
	PRIMARY KEY(`kind`, `content`, `voter`)
);
--> statement-breakpoint
CREATE INDEX `fan_reports_kind_content` ON `fan_reports` (`kind`,`content`);