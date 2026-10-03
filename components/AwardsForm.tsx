"use client";

import { Control, useFieldArray } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResumeValues } from "@/lib/schema";
import { ARRAY_LIMITS } from "@/lib/resume-defaults";

type AwardsFormProps = {
  control: Control<ResumeValues>;
};

export function AwardsForm({ control }: AwardsFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "awards",
  });
  const atLimit = fields.length >= ARRAY_LIMITS.awards;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">获奖情况</h2>
          <p className="mt-1 text-sm text-gray-500">填写奖项名称、级别和获奖时间。</p>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={atLimit}
          onClick={() =>
            append({
              name: "",
              issuer: "",
              date: "",
              level: "",
            })
          }
        >
          {atLimit
            ? `已达上限（${ARRAY_LIMITS.awards} 条）`
            : "新增奖项"}
        </Button>
      </div>

      <div className="mt-6 space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border border-gray-200 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                奖项 {index + 1}
              </h3>
              <Button
                type="button"
                variant="ghost"
                disabled={fields.length <= 1}
                onClick={() => remove(index)}
                aria-label={`删除第 ${index + 1} 条`}
              >
                删除
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={control}
                name={`awards.${index}.name` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>奖项名称</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：全国大学生电子设计竞赛二等奖" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`awards.${index}.issuer` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>颁发单位</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：教育部高教司" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`awards.${index}.date` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>获奖时间</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：2023.11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`awards.${index}.level` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>奖项级别</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：国家级 / 省级 / 校级" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
