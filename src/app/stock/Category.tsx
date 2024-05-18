'use client';

import React from "react";
import { addGroceryItemToShoppingList } from "@/repository/inventory";

type CategoryProps = {
  category: string;
  categoryItems: groceryItem[];
};

type groceryItem = {
  name: string;
  category: string;
  inStock: boolean;
};

export default function CategoryItems({
  category,
  categoryItems,
}: CategoryProps) {
  return (
    <>
      <h2 className="text-lg font-semibold">{category}</h2>
      <ul>
        {categoryItems.map((item) => (
          <li key={item.name}>
            {item.name} -{" "}
            <input type="checkbox" checked={item.inStock} disabled />
            <button
              onClick={() => addGroceryItemToShoppingList(item)}
              className="p-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900"
            >Add to Shopping List</button>
          </li>
        ))}
      </ul>
    </>
  );
}
