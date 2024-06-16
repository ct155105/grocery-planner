"use client";

import React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { GroceryItem } from "@/types";
import AccordionTrigger from "./components/AccordionTrigger";
import GorceryItem from "./components/Item";
import ItemActions from "./components/ItemActions";
import {
  CheckIcon,
  ListBulletIcon,
  PlusIcon,
  TrashIcon,
  MagicWandIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  updateGroceryItem as updateGroceryItemInInventory,
  deleteGroceryItem as deleteGroceryItemInInventory,
  getInStockItems,
} from "@/repository/inventory";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import { getCompletion } from "@/lib/llm";

type Groceries = Record<string, GroceryItem[]>;

type CategoryProps = {
  groceries: Groceries;
  mealIdeaGenerator: (prompt: string) => Promise<string | null>;
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

export default function CategoryItems({
  groceries,
  mealIdeaGenerator,
}: CategoryProps) {
  const [items, setItems] = useState<Groceries>(groceries);
  const [listView, setListView] = useState(false);
  const [inStockView, setInStockView] = useState(false);
  const [deleteView, setDeleteView] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [gettingMealIdea, setGettingMealIdea] = useState(false);
  const [mealIdea, setMealIdea] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const generateMealIdea = async () => {
    setGettingMealIdea(true);
    const inStockItems = await getInStockItems();
    const completion = await getCompletion(
      inStockItems.map((item) => item.name).join(", ")
    );
    setMealIdea(completion ?? "No meal idea found");
    setDialogOpen(true);
    setGettingMealIdea(false);
    return completion;
  };

  type SingleAccordionProps = {
    type: "single";
    collapsible: true;
  };

  type MultipleAccordionProps = {
    type: "multiple";
    defaultValue: string[];
  };

  const getAccordionProps = (
    listView: boolean,
    items: Record<string, any[]>
  ): SingleAccordionProps | MultipleAccordionProps => {
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
      <Accordion.Root
        className="w-full bg-blue-50"
        {...getAccordionProps(listView, items)}
      >
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
        <FilterButton
          onClick={generateMealIdea}
          active={false}
          activeColor="bg-red-500 text-white"
          inactiveColor="bg-white text-blue-500"
          Icon={gettingMealIdea ? DotsHorizontalIcon : MagicWandIcon}
        />
      </div>
      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed top-0 bottom-0 left-0 right-0 overflow-y-auto">
            <Dialog.Content className="rounded-[6px] bg-white p-[25px]">
              <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
                Meal Ideas
              </Dialog.Title>
              <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
                Here are some meal ideas based on the items we have in stock:
              </Dialog.Description>
              <div>
                {mealIdea.split(/\d+\./).map((recipe) => (
                  <div key={recipe} className="p-3">{recipe}</div>
                ))}
              </div>

              <div className="mt-[25px] flex justify-end">
                <Dialog.Close asChild>
                  <button className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
                    Close
                  </button>
                </Dialog.Close>
              </div>
              <Dialog.Close asChild>
                <button
                  className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                  aria-label="Close"
                >
                  X
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
