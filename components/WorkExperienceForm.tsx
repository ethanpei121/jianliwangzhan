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

type WorkExperienceFormProps = {
  control: Control<ResumeValues>;
};

const textAreaClassName =
  "flex min-h-[96px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background " +
  "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
  "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export function WorkExperienceForm({ control }: WorkExperienceFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "workExperience",
  });

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">工作经历（正式）</h2>
          <p className="mt-1 text-sm text-gray-500">
            用量化结果突出业务价值，管理经验可选填写。
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              company: "",
              position: "",
              startDate: "",
              endDate: "",
              content: "",
              achievements: "",
              management: "",
            })
          }
        >
          新增工作经历
        </Button>
      </div>

      <div className="mt-6 space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border border-gray-200 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                工作经历 {index + 1}
              </h3>
              <Button
                type="button"
                variant="ghost"
                disabled={fields.length <= 1}
                onClick={() => remove(index)}
              >
                删除
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={control}
                name={`workExperience.${index}.company` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>公司名称</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：某科技有限公司" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`workExperience.${index}.position` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>职位</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：高级前端工程师" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`workExperience.${index}.startDate` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>入职时间</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：2023.07" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`workExperience.${index}.endDate` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>离职时间</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：至今" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`workExperience.${index}.content` as const}
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>主要工作内容</FormLabel>
                    <FormControl>
                      <textarea
                        className={textAreaClassName}
                        placeholder="描述你的核心职责。"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`workExperience.${index}.achievements` as const}
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>业绩 / 成果</FormLabel>
                    <FormControl>
                      <textarea
                        className={textAreaClassName}
                        placeholder="例如：效率提升 30%，成本下降 15%。"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`workExperience.${index}.management` as const}
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>管理经验（可选）</FormLabel>
                    <FormControl>
                      <textarea
                        className={textAreaClassName}
                        placeholder="例如：带领 5 人团队推进版本交付。"
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
