import React from "react";
import { getGroceryItemsGroupedByCategory } from "@/repository/inventory";
import Category from "./Category";
import { getCompletion } from "@/lib/llm";

export default async function InStockItems() {
  let items = await getGroceryItemsGroupedByCategory();
  return (
    <div>
        <Category groceries={items} mealIdeaGenerator={getCompletion} />
    </div>
  );
}
