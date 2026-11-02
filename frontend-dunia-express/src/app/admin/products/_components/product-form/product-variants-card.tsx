import * as React from "react";
import { AdminCard } from "@/components/common/admin-card";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface VariantOptionItem {
  id: string;
  name: string;
  values: string[];
}

export function ProductVariantsCard() {
  const [hasVariants, setHasVariants] = React.useState(false);
  const [options, setOptions] = React.useState<VariantOptionItem[]>([
    { id: "1", name: "Size", values: ["Small", "Medium", "Large"] },
  ]);
  const [newValueInput, setNewValueInput] = React.useState("");

  function addOption() {
    setOptions((prev) => [
      ...prev,
      { id: Date.now().toString(), name: "Color", values: [] },
    ]);
  }

  function removeOption(id: string) {
    setOptions((prev) => prev.filter((o) => o.id !== id));
  }

  return (
    <AdminCard title="Variants">
      {!hasVariants ? (
        <button
          type="button"
          onClick={() => setHasVariants(true)}
          className="flex items-center gap-1.5 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add options like size or color
        </button>
      ) : (
        <div className="space-y-4">
          {options.map((opt) => (
            <div
              key={opt.id}
              className="rounded-lg border border-neutral-200 p-3 bg-neutral-50/50 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <Input
                  value={opt.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setOptions((prev) =>
                      prev.map((o) => (o.id === opt.id ? { ...o, name: val } : o))
                    );
                  }}
                  className="h-8 max-w-[200px] bg-white border-neutral-300 font-medium"
                />
                <button
                  type="button"
                  onClick={() => removeOption(opt.id)}
                  className="text-neutral-400 hover:text-rose-600 transition-colors p-1"
                  aria-label="Remove option"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {opt.values.map((v, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700"
                  >
                    {v}
                  </span>
                ))}
                <div className="flex items-center gap-1.5">
                  <Input
                    placeholder="Add value"
                    value={newValueInput}
                    onChange={(e) => setNewValueInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newValueInput.trim()) {
                        e.preventDefault();
                        setOptions((prev) =>
                          prev.map((o) =>
                            o.id === opt.id
                              ? { ...o, values: [...o.values, newValueInput.trim()] }
                              : o
                          )
                        );
                        setNewValueInput("");
                      }
                    }}
                    className="h-7 w-28 text-xs bg-white border-neutral-300"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      if (newValueInput.trim()) {
                        setOptions((prev) =>
                          prev.map((o) =>
                            o.id === opt.id
                              ? { ...o, values: [...o.values, newValueInput.trim()] }
                              : o
                          )
                        );
                        setNewValueInput("");
                      }
                    }}
                    className="h-7 text-xs border-neutral-300"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={addOption}
              className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
            >
              <Plus className="h-3.5 w-3.5" />
              Add another option
            </button>
            <button
              type="button"
              onClick={() => setHasVariants(false)}
              className="text-xs text-neutral-500 hover:text-neutral-800"
            >
              Cancel variants
            </button>
          </div>
        </div>
      )}
    </AdminCard>
  );
}
