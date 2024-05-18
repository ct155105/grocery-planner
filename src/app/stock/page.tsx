
import React from 'react'
import { getGroceryItemsGroupedByCategory } from '@/repository/inventory'
import Category from './Category'

export default async function InStockItems() {
    let items = await getGroceryItemsGroupedByCategory();
  return (
    <div>
      <h1 className="text-2xl font-bold">In Stock Items</h1>
      {Object.entries(items).map(([category, categoryItems]) => (
        <Category key={category} category={category} categoryItems={categoryItems} />
        ))}
    </div>
  )
}
