import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  CategoryTable,
  PostCategoryTable,
  PostTable,
  UsersTable,
  UserPreferencesTable,
  UserTableRelations,
  UserPreferencesTableRelations,
  PostTableRelations,
  PostCategoryTableRelations,
  CategoryTableRelations,
} from "./db/schema";

// Create schema object with all tables and relations
const schema = {
  UsersTable,
  UserPreferencesTable,
  PostTable,
  CategoryTable,
  PostCategoryTable,
  UserTableRelations,
  UserPreferencesTableRelations,
  PostTableRelations,
  PostCategoryTableRelations,
  CategoryTableRelations,
};

// Pass schema to drizzle
const db = drizzle(process.env.DATABASE_URL!, { schema });

async function main() {
  const user = await db
    .insert(UsersTable)
    .values({
      name: "aman",
      age: 22,
      email: "aman@example.com",
      role: "USER",
    })
    .returning({ id: UsersTable.id })
    .onConflictDoUpdate({
      target: UsersTable.email,
      set: {
        name: "aman",
        age: 22,
        role: "USER",
      },
    });
  const posts = await db
    .insert(PostTable)
    .values([
      {
        title: "TypeScript Fundamentals",
        averageRating: 5,
        userId: user[0].id, // Associate with user
      },
      {
        title: "JavaScript Fundamentals",
        averageRating: 4,
        userId: user[0].id, // Associate with user
      },
    ])
    .returning({ id: PostTable.id });

  const users = await db.query.UsersTable.findMany({
    columns: { name: true, id: true },
    with: {
      posts: true, // Include user's posts
      preferences: true, // Include user preferences
    },
  });
  console.log(JSON.stringify(users));
  // await db.delete(UsersTable);
  // const user: typeof UsersTable.$inferInsert = {
  //   name: "aman",
  //   age: 22,
  //   email: "aman@example.com",
  //   role: "USER",
  // };

  // const userId = await db
  //   .insert(UsersTable)
  //   .values(user)
  //   .returning({
  //     id: UsersTable.id,
  //   })
  //   .onConflictDoUpdate({
  //     target: UsersTable.email,
  //     set: {
  //       name: user.name,
  //       age: 23,
  //       role: user.role,
  //     },
  //   });
  // console.log(userId);

  // const posts = await db
  //   .insert(PostTable)
  //   .values([
  //     {
  //       title: "TypeScript Fundamentals",
  //       averageRating: 5,
  //     },
  //     {
  //       title: "JavaScript Fundamentals",
  //       averageRating: 4,
  //     },
  //   ])
  //   .returning({
  //     id: PostTable.id,
  //   });
  // const categories = await db
  //   .insert(CategoryTable)
  //   .values([
  //     {
  //       name: "development",
  //     },
  //     {
  //       name: "coding",
  //     },
  //   ])
  //   .returning({
  //     id: CategoryTable.id,
  //   });
  // await db.insert(PostCategoryTable).values([
  //   {
  //     postId: posts[0].id, // TypeScript Fundamentals
  //     categoryId: categories[0].id, // development
  //   },
  //   {
  //     postId: posts[0].id, // TypeScript Fundamentals
  //     categoryId: categories[1].id, // coding
  //   },
  //   {
  //     postId: posts[1].id, // JavaScript Fundamentals
  //     categoryId: categories[1].id, // coding
  //   },
  // ]);
}
main();
