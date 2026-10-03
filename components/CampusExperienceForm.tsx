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

type CampusExperienceFormProps = {
  control: Control<ResumeValues>;
};

const textAreaClassName =
  "flex min-h-[96px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background " +
  "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
  "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export function CampusExperienceForm({ control }: CampusExperienceFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "campusExperience",
  });
  const atLimit = fields.length >= ARRAY_LIMITS.campusExperience;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">校园经历 / 学生工作</h2>
          <p className="mt-1 text-sm text-gray-500">
            包含社团、学生会、班委等经历与成果。
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={atLimit}
          onClick={() =>
            append({
              organization: "",
              role: "",
              time: "",
              responsibilities: "",
              outcomes: "",
            })
          }
        >
          {atLimit
            ? `已达上限（${ARRAY_LIMITS.campusExperience} 条）`
            : "新增校园经历"}
        </Button>
      </div>

      <div className="mt-6 space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border border-gray-200 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                校园经历 {index + 1}
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
                name={`campusExperience.${index}.organization` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>社团 / 学生会 / 班委</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：学院学生会" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`campusExperience.${index}.role` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>职务</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：学习部部长" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`campusExperience.${index}.time` as const}
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>时间</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：2021.09 - 2023.06" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`campusExperience.${index}.responsibilities` as const}
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>负责工作</FormLabel>
                    <FormControl>
                      <textarea
                        className={textAreaClassName}
                        placeholder="描述你的工作职责。"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`campusExperience.${index}.outcomes` as const}
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>活动成果</FormLabel>
                    <FormControl>
                      <textarea
                        className={textAreaClassName}
                        placeholder="例如：组织活动 10+ 场，参与人数 500+。"
                        {...field}
                      />
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
