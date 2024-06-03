"use server";

import { Firestore } from "@google-cloud/firestore";
import { GroceryItem } from "@/types";

type listItem = {
  name: string;
  category: string;
};

const db = new Firestore({
  projectId: process.env.PROJECT_ID,
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY,
  },
});

export async function createCategories() {
  console.log("Creating categories");

  const categories = [
    "Produce",
    "Bakery",
    "Pantry",
    "Meat",
    "Personal Care",
    "Household",
    "Frozen",
    "Dairy",
  ];

  const batch = db.batch();

  categories.forEach((category, index) => {
    const docRef = db.collection("categories").doc(category);
    batch.set(docRef, { name: category, order: index });
  });

  await batch.commit();
  console.log("Categories created");
}

export async function getCategories() {
  console.log("Getting categories");

  const snapshot = await db.collection("categories").get();
  const categories = snapshot.docs.map((doc) => doc.data());
  console.log("Categories: ", categories);
  return categories;
}

export async function createGroceryItems() {
  console.log("Creating grocery items");

  const groceryItems = [
    { name: "Apples", category: "Produce", inStock: false },
    { name: "Bananas", category: "Produce", inStock: false },
    { name: "Oranges", category: "Produce", inStock: false },
    { name: "Bread", category: "Bakery", inStock: false },
    { name: "Pasta", category: "Pantry", inStock: false },
    { name: "Rice", category: "Pantry", inStock: false },
    { name: "Chicken", category: "Meat", inStock: false },
    { name: "Beef", category: "Meat", inStock: false },
    { name: "fish", category: "Meat", inStock: false },
    { name: "Shampoo", category: "Personal Care", inStock: false },
    { name: "Toothpaste", category: "Personal Care", inStock: false },
    { name: "Toilet Paper", category: "Household", inStock: false },
    { name: "Paper Towels", category: "Household", inStock: false },
    { name: "Ice Cream", category: "Frozen", inStock: false },
    { name: "Pizza", category: "Frozen", inStock: false },
    { name: "Milk", category: "Dairy", inStock: false },
    { name: "Cheese", category: "Dairy", inStock: false },
    { name: "Whipped Cream", category: "Dairy", inStock: false },
    { name: "Butter", category: "Dairy", inStock: false },
  ];

  for (const item of groceryItems) {
    const docRef = await db.collection("groceryItems").doc(item.name);
    await docRef.set(item);
  }
}

export async function getGroceryItems(): Promise<GroceryItem[]> {
  console.log("Getting grocery items ");

  const snapshot = await db.collection("groceryItems").get();
  const items = snapshot.docs.map((doc) => doc.data());
  console.log("Grocery items: ", items);
  return items as GroceryItem[];
}

export async function getGroceryItemsGroupedByCategory(): Promise<
  Record<string, GroceryItem[]>
> {
  const groupedItems: Record<string, GroceryItem[]> = {};

  const groceryItems = await getGroceryItems();
  for (const item of groceryItems) {
    if (!groupedItems[item.category]) {
      groupedItems[item.category] = [];
    }
    groupedItems[item.category].push(item);
  }

  return groupedItems;
}

export async function updateGroceryItem(item: GroceryItem) {
    console.log(`Updating grocery item ${item.name}`);
    
    const docRef = db.collection("groceryItems").doc(item.name);
    await docRef.set(item);
    console.log(`Grocery item ${item.name} updated`);
}

export async function addGroceryItemToShoppingList(item: listItem) {
  console.log(`Adding grocery item ${item} to shopping list`);

  const docRef = db.collection("shoppingList").doc(item.name);
  await docRef.set(item);
  console.log(`Grocery item ${item.name} added to shopping list`);
}

export async function getShoppingList() {
  console.log("Getting shopping list");

  const snapshot = await db.collection("shoppingList").get();
  const items = snapshot.docs.map((doc) => doc.data());
  console.log("Shopping list: ", items);
  return items;
}
