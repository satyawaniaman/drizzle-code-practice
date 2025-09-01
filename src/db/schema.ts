import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
export const UserRole = pgEnum("user_role", ["ADMIN", "USER"]);
export const UsersTable = pgTable(
  "users",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    age: integer().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    role: UserRole("user_role").default("USER").notNull(),
  },
  (table) => {
    return {
      emailIndex: index("email_index").on(table.email),
    };
  }
);
export const UserPreferencesTable = pgTable("user_preferences", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  emailUpdates: boolean("emailUpdates").notNull().default(false),
  userId: integer("user_id").references(() => UsersTable.id),
});

export const PostTable = pgTable("posts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  averageRating: real("average_rating").default(0),
  userId: integer("user_id").references(() => UsersTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const CategoryTable = pgTable("categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
});
export const PostCategoryTable = pgTable(
  "post_categories",
  {
    postId: integer("post_id")
      .references(() => PostTable.id)
      .notNull(),
    categoryId: integer("category_id")
      .references(() => CategoryTable.id)
      .notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.postId, table.categoryId],
      }),
    };
  }
);

// RELATIONS
export const UserTableRelations = relations(UsersTable, ({ one, many }) => ({
  preferences: one(UserPreferencesTable),
  posts: many(PostTable),
}));
export const UserPreferencesTableRelations = relations(
  UserPreferencesTable,
  ({ one }) => ({
    user: one(UsersTable, {
      fields: [UserPreferencesTable.userId],
      references: [UsersTable.id],
    }),
  })
);
export const PostTableRelations = relations(PostTable, ({ one, many }) => ({
  user: one(UsersTable, {
    fields: [PostTable.userId],
    references: [UsersTable.id],
  }),
  categories: many(PostCategoryTable),
}));
export const PostCategoryTableRelations = relations(
  PostCategoryTable,
  ({ one }) => ({
    post: one(PostTable, {
      fields: [PostCategoryTable.postId],
      references: [PostTable.id],
    }),
    category: one(CategoryTable, {
      fields: [PostCategoryTable.categoryId],
      references: [CategoryTable.id],
    }),
  })
);
export const CategoryTableRelations = relations(CategoryTable, ({ many }) => ({
  posts: many(PostCategoryTable),
  users: many(UsersTable),
}));
