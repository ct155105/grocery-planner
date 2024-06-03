"use client";

import React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { useState } from "react";
import { GroceryItem } from "@/types";
import AccordionTrigger from "./components/AccordionTrigger";
import GorceryItem from "./components/Item";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon, ListBulletIcon, EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import { updateGroceryItem as updateGroceryItemInInventory } from "@/repository/inventory";

type Groceries = Record<string, GroceryItem[]>;

type CategoryProps = {
  groceries: Groceries;
};

const ItemActions = ({
  item,
  updateGroceryItem,
}: {
  item: GroceryItem;
  updateGroceryItem: (item: GroceryItem) => void;
}) => {
  return (
    <div className="flex items-center">
      <Checkbox.Root
        className="flex h-[40px] w-[40px] items-center justify-center rounded-[4px] border border-blue-900 data-[state=checked]:bg-blue-500 shadow-lg"
        defaultChecked={item.inStock}
        onCheckedChange={() => {
          const updatedItem = {
            ...item,
            inStock: !item.inStock,
          };
          updateGroceryItem(updatedItem);
        }}
      >
        <Checkbox.Indicator className="text-white bg-blue-500">
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <Checkbox.Root
        className="flex h-[40px] w-[40px] items-center justify-center rounded-[4px] border border-blue-900 data-[state=checked]:bg-blue-500 shadow-lg ml-2"
        defaultChecked={item.onList}
        onCheckedChange={() => {
          const updatedItem = {
            ...item,
            onList: !item.onList,
          };
          updateGroceryItem(updatedItem);
        }}
      >
        <Checkbox.Indicator className="text-white bg-blue-500">
          <ListBulletIcon width="30" height="30" />
        </Checkbox.Indicator>
      </Checkbox.Root>
    </div>
  );
};

export default function CategoryItems({ groceries }: CategoryProps) {
  const [items, setItems] = useState<Groceries>(groceries);
  const [listView, setListView] = useState(false);

  const updateGroceryItem = (updatedItem: GroceryItem) => {
    const updatedItems = { ...items } as Groceries;
    updatedItems[updatedItem.category] = updatedItems[updatedItem.category].map(
      (item) => {
        if (item.name === updatedItem.name) {
          updateGroceryItemInInventory(updatedItem);
          return updatedItem;
        }
        return item;
      }
    );
    setItems(updatedItems);
  };

  return (
    <div>
      <Accordion.Root className="w-full bg-blue-50" type="single" collapsible>
        {Object.entries(items).map(([category, categoryItems]) => (
          <Accordion.Item value={category} key={category} className="w-full">
            <AccordionTrigger label={category} />
            <Accordion.Content className="border-blue-400 border-2">
              <ul>
                <Accordion.Root type="single" collapsible>
                  {categoryItems.map((item) => (
                    <li key={item.name} className="w-full">
                      {(!listView || (listView && item.onList)) && (
                        <GorceryItem label={item.name}>
                          <ItemActions
                            item={item}
                            updateGroceryItem={updateGroceryItem}
                          />
                        </GorceryItem>
                      )}
                    </li>
                  ))}
                </Accordion.Root>
              </ul>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
      {listView && (
         <button
         onClick={() => setListView(!listView)}
         className="flex fixed bottom-0 items-center justify-center p-5 w-full text-blue-500 bg-white"
       >
         <EyeClosedIcon width="40" height="40" />
       </button>
      )}
      {!listView && (
         <button
         onClick={() => setListView(!listView)}
         className="flex fixed bottom-0 items-center justify-center p-5 w-full text-blue-500 bg-white"
       >
         <EyeOpenIcon width="40" height="40" />
       </button>
      )}
    </div>
  );
}
