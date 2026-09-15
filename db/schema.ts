import { sqliteTable, text, integer, primaryKey, index } from 'drizzle-orm/sqlite-core';
export const votes = sqliteTable('votes', {
 poll: text('poll').notNull(), voter: text('voter').notNull(), player: text('player').notNull(), created: integer('created').notNull()
}, t => [primaryKey({columns:[t.poll,t.voter]}), index('votes_poll_player').on(t.poll,t.player)]);
export const groups = sqliteTable('groups', {
 id: text('id').primaryKey(), name: text('name').notNull(), region: text('region').notNull(), category: text('category').notNull(), url: text('url').notNull(), description: text('description').notNull(), status: text('status').notNull().default('pending'), created: integer('created').notNull()
}, t => [index('groups_status_created').on(t.status,t.created), index('groups_status_category_created').on(t.status,t.category,t.created)]);
export const matchPredictions = sqliteTable('match_predictions', {
 match: text('match').notNull(), voter: text('voter').notNull(), choice: text('choice').notNull(), homeScore: integer('home_score'), awayScore: integer('away_score'), created: integer('created').notNull()
}, t => [primaryKey({columns:[t.match,t.voter]}), index('match_predictions_match_choice').on(t.match,t.choice)]);
export const playerRatings = sqliteTable('player_ratings', {
 match: text('match').notNull(), voter: text('voter').notNull(), player: text('player').notNull(), rating: integer('rating').notNull(), created: integer('created').notNull()
}, t => [primaryKey({columns:[t.match,t.voter,t.player]}), index('player_ratings_match_player').on(t.match,t.player)]);

export const fanOpinions = sqliteTable('fan_opinions', {
 id: text('id').primaryKey(), kind: text('kind').notNull(), voter: text('voter').notNull(), nickname: text('nickname').notNull(), body: text('body').notNull(), player: text('player'), status: text('status').notNull().default('visible'), created: integer('created').notNull()
}, t => [index('fan_opinions_kind_status_created').on(t.kind,t.status,t.created), index('fan_opinions_voter_created').on(t.voter,t.created)]);

export const fanOpinionVotes = sqliteTable('fan_opinion_votes', {
 opinion: text('opinion').notNull(), voter: text('voter').notNull(), choice: text('choice').notNull(), created: integer('created').notNull()
}, t => [primaryKey({columns:[t.opinion,t.voter]}), index('fan_opinion_votes_opinion_choice').on(t.opinion,t.choice)]);

export const fanChatMessages = sqliteTable('fan_chat_messages', {
 id: text('id').primaryKey(), voter: text('voter').notNull(), nickname: text('nickname').notNull(), body: text('body').notNull(), status: text('status').notNull().default('visible'), created: integer('created').notNull()
}, t => [index('fan_chat_status_created').on(t.status,t.created), index('fan_chat_voter_created').on(t.voter,t.created)]);

export const fanReports = sqliteTable('fan_reports', {
 kind: text('kind').notNull(), content: text('content').notNull(), voter: text('voter').notNull(), created: integer('created').notNull()
}, t => [primaryKey({columns:[t.kind,t.content,t.voter]}), index('fan_reports_kind_content').on(t.kind,t.content)]);
