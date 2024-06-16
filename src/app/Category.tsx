"use client";

import React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { useState } from "react";
import { GroceryItem } from "@/types";
import AccordionTrigger from "./components/AccordionTrigger";
import GorceryItem from "./components/Item";
import * as Checkbox from "@radix-ui/react-checkbox";
import {
  CheckIcon,
  ListBulletIcon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import {
  updateGroceryItem as updateGroceryItemInInventory,
  deleteGroceryItem as deleteGroceryItemInInventory,
} from "@/repository/inventory";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import { list } from "postcss";

type Groceries = Record<string, GroceryItem[]>;

type CategoryProps = {
  groceries: Groceries;
};

const ItemActions = ({
  item,
  updateGroceryItem,
  deleteGroceryItem,
  deleteView,
}: {
  item: GroceryItem;
  updateGroceryItem: (item: GroceryItem) => void;
  deleteGroceryItem: (item: GroceryItem) => void;
  deleteView?: boolean;
}) => {
  return (
    <div className="flex items-center">
      {!deleteView && (
        <>
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
        </>
      )}
      {deleteView && (
        <button className="bg-red-500 text-white flex h-[40px] w-[40px] items-center justify-center rounded-[4px] border border-blue-900 shadow-lg">
          <TrashIcon
            width="30"
            height="30"
            onClick={() => {
              deleteGroceryItem(item);
            }}
          />
        </button>
      )}
    </div>
  );
};

const FilterButton = ({
  onClick,
  active,
  activeColor,
  inactiveColor,
  Icon,
}: {
  onClick: () => void;
  active: boolean;
  activeColor: string;
  inactiveColor: string;
  Icon: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;
}) => (
  <button
    onClick={onClick}
    className={`flex h-[40px] w-[40px] items-center justify-center rounded-[4px] border border-blue-900 shadow-lg mx-1 ${
      active ? activeColor : inactiveColor
    }`}
  >
    <Icon width="30" height="30" />
  </button>
);

export default function CategoryItems({ groceries }: CategoryProps) {
  const [items, setItems] = useState<Groceries>(groceries);
  const [listView, setListView] = useState(false);
  const [inStockView, setInStockView] = useState(false);
  const [deleteView, setDeleteView] = useState(false);
  const [newItem, setNewItem] = useState("");

  const addGroceryItem = (updatedItem: GroceryItem) => {
    const updatedItems = { ...items } as Groceries;
    updatedItems[updatedItem.category].push(updatedItem);
    setItems(updatedItems);
    setNewItem("");
    updateGroceryItemInInventory(updatedItem);
  };

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

  const deleteGroceryItem = (item: GroceryItem) => {
    const updatedItems = { ...items } as Groceries;
    updatedItems[item.category] = updatedItems[item.category].filter(
      (i) => i.name !== item.name
    );
    setItems(updatedItems);
    deleteGroceryItemInInventory(item);
  };

  type SingleAccordionProps = {
    type: "single";
    collapsible: true;
  }  

  type MultipleAccordionProps = {
    type: "multiple";
    defaultValue: string[];
  }
  
  const getAccordionProps = (listView: boolean, items: Record<string, any[]>): SingleAccordionProps | MultipleAccordionProps => {
    if (listView) {
      return {
        type: "multiple",
        defaultValue: Object.keys(items),
      };
    } else {
      return {
        type: "single",
        collapsible: true,
      };
    }
  };

  return (
    <div>
      <Accordion.Root className="w-full bg-blue-50" {...getAccordionProps(listView, items)} >
        {Object.entries(items).map(([category, categoryItems]) => (
          <Accordion.Item value={category} key={category} className="w-full">
            <AccordionTrigger label={category} />
            <Accordion.Content className="border-blue-400 border-2">
              <ul>
                {categoryItems.map((item) => (
                  <li key={item.name} className="w-full">
                    {(!listView || (listView && item.onList)) &&
                      (!inStockView || (inStockView && item.inStock)) && (
                        <GorceryItem label={item.name}>
                          <ItemActions
                            item={item}
                            updateGroceryItem={updateGroceryItem}
                            deleteGroceryItem={deleteGroceryItem}
                            deleteView={deleteView}
                          />
                        </GorceryItem>
                      )}
                  </li>
                ))}
              </ul>
              {!listView && (
                <div className="flex bg-gradient-to-tr from-white from-50% to-blue-500 text-slate-950 items-center p-5">
                  <input
                    type="text"
                    placeholder="Add new item"
                    className="flex-grow border border-blue-900 rounded-[4px] p-2 mr-14"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                  />
                  <button className="ml-auto bg-blue-500 text-white flex h-[40px] w-[40px] items-center justify-center rounded-[4px] border border-blue-900 shadow-lg">
                    <PlusIcon
                      width="30"
                      height="30"
                      onClick={() => {
                        addGroceryItem({
                          name: newItem,
                          category: category,
                          inStock: false,
                          onList: false,
                        });
                      }}
                    />
                  </button>
                </div>
              )}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
      <div className="fixed bottom-0 bg-gradient-to-tr from-blue-950 to-blue-900 items-center justify-center p-5 w-full flex">
        <FilterButton
          onClick={() => setListView(!listView)}
          active={listView}
          activeColor="bg-blue-500 text-white"
          inactiveColor="bg-white text-blue-500"
          Icon={ListBulletIcon}
        />
        <FilterButton
          onClick={() => setInStockView(!inStockView)}
          active={inStockView}
          activeColor="bg-blue-500 text-white"
          inactiveColor="bg-white text-blue-500"
          Icon={CheckIcon}
        />
        <FilterButton
          onClick={() => setDeleteView(!deleteView)}
          active={deleteView}
          activeColor="bg-red-500 text-white"
          inactiveColor="bg-white text-blue-500"
          Icon={TrashIcon}
        />
      </div>
    </div>
  );
}
