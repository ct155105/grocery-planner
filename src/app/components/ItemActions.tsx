import * as Checkbox from "@radix-ui/react-checkbox";
import { GroceryItem } from "@/types";
import { CheckIcon, ListBulletIcon, TrashIcon } from "@radix-ui/react-icons";

export default function ItemActions({
  item,
  updateGroceryItem,
  deleteGroceryItem,
  deleteView,
}: {
  item: GroceryItem;
  updateGroceryItem: (item: GroceryItem) => void;
  deleteGroceryItem: (item: GroceryItem) => void;
  deleteView?: boolean;
}) {
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
}
