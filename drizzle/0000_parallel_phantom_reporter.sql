CREATE TABLE `journals` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`icon` text DEFAULT '' NOT NULL,
	`colour` text NOT NULL,
	`notes_sort_by` text DEFAULT 'created' NOT NULL,
	`notes_sort_direction` text DEFAULT 'asc' NOT NULL,
	`notes_group_by` text,
	`bookmarked_sort_by` text DEFAULT 'created' NOT NULL,
	`bookmarked_sort_direction` text DEFAULT 'asc' NOT NULL,
	`bookmarked_group_by` text,
	`user` text,
	`created` text NOT NULL,
	`updated` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `note_tags` (
	`note_id` text NOT NULL,
	`tag_id` text NOT NULL,
	FOREIGN KEY (`note_id`) REFERENCES `notes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `notes` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`content` text,
	`is_bookmarked` integer DEFAULT false NOT NULL,
	`journal` text,
	`user` text,
	`deleted` text,
	`created` text NOT NULL,
	`updated` text NOT NULL,
	FOREIGN KEY (`journal`) REFERENCES `journals`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tag_groups` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`journal` text,
	`user` text,
	`created` text NOT NULL,
	`updated` text NOT NULL,
	FOREIGN KEY (`journal`) REFERENCES `journals`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`colour` text NOT NULL,
	`icon` text DEFAULT '' NOT NULL,
	`description` text,
	`group_by` text,
	`sort_by` text DEFAULT 'created' NOT NULL,
	`sort_direction` text DEFAULT 'asc' NOT NULL,
	`links` text DEFAULT '[]' NOT NULL,
	`tag_group` text,
	`journal` text,
	`user` text,
	`created` text NOT NULL,
	`updated` text NOT NULL,
	FOREIGN KEY (`tag_group`) REFERENCES `tag_groups`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`journal`) REFERENCES `journals`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`link` text,
	`is_flagged` integer DEFAULT false NOT NULL,
	`note` text,
	`due_date` text,
	`completed_date` text,
	`cancelled_date` text,
	`journal` text,
	`user` text,
	`created` text NOT NULL,
	`updated` text NOT NULL,
	FOREIGN KEY (`note`) REFERENCES `notes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`journal`) REFERENCES `journals`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `update_notes` (
	`update_id` text NOT NULL,
	`note_id` text NOT NULL,
	FOREIGN KEY (`update_id`) REFERENCES `updates`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`note_id`) REFERENCES `notes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `updates` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text,
	`tint` text,
	`journal` text,
	`user` text,
	`created` text NOT NULL,
	`updated` text NOT NULL,
	FOREIGN KEY (`journal`) REFERENCES `journals`(`id`) ON UPDATE no action ON DELETE no action
);
