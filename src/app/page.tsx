import React from "react";
import { getGroceryItemsGroupedByCategory } from "@/repository/inventory";
import Category from "./Category";

export default async function InStockItems() {
  let items = await getGroceryItemsGroupedByCategory();
  return (
    <div>
        <Category groceries={items} />
    </div>
  );
}
