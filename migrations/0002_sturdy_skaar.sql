PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_blog_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`excerpt` text NOT NULL,
	`content` text NOT NULL,
	`author` text DEFAULT 'Last Minute Lessons Team' NOT NULL,
	`tags` text,
	`published` integer DEFAULT false,
	`featured` integer DEFAULT false,
	`meta_title` text,
	`meta_description` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
INSERT INTO `__new_blog_posts`("id", "slug", "title", "excerpt", "content", "author", "tags", "published", "featured", "meta_title", "meta_description", "created_at", "updated_at") SELECT "id", "slug", "title", "excerpt", "content", "author", "tags", "published", "featured", "meta_title", "meta_description", "created_at", "updated_at" FROM `blog_posts`;--> statement-breakpoint
DROP TABLE `blog_posts`;--> statement-breakpoint
ALTER TABLE `__new_blog_posts` RENAME TO `blog_posts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_slug_unique` ON `blog_posts` (`slug`);--> statement-breakpoint
ALTER TABLE `packages` ADD `duration` text;--> statement-breakpoint
ALTER TABLE `packages` ADD `objectives` text;--> statement-breakpoint
ALTER TABLE `payments` ADD `duration` text;--> statement-breakpoint
ALTER TABLE `payments` ADD `objectives` text;