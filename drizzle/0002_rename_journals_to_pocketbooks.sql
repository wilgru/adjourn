ALTER TABLE `journals` RENAME TO `pocketbooks`;
--> statement-breakpoint
ALTER TABLE `notes` RENAME COLUMN `journal` TO `pocketbook`;
--> statement-breakpoint
ALTER TABLE `tag_groups` RENAME COLUMN `journal` TO `pocketbook`;
--> statement-breakpoint
ALTER TABLE `tags` RENAME COLUMN `journal` TO `pocketbook`;
--> statement-breakpoint
ALTER TABLE `tasks` RENAME COLUMN `journal` TO `pocketbook`;
--> statement-breakpoint
ALTER TABLE `updates` RENAME COLUMN `journal` TO `pocketbook`;
