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

type ProjectExperienceFormProps = {
  control: Control<ResumeValues>;
};

const textAreaClassName =
  "flex min-h-[96px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background " +
  "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
  "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export function ProjectExperienceForm({ control }: ProjectExperienceFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">项目经历</h2>
          <p className="mt-1 text-sm text-gray-500">
            填写项目职责、技术栈与成果数据。
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              name: "",
              startDate: "",
              endDate: "",
              role: "",
              description: "",
              responsibilities: "",
              techStack: "",
              outcomes: "",
            })
          }
        >
          新增项目
        </Button>
      </div>

      <div className="mt-6 space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border border-gray-200 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">项目 {index + 1}</h3>
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
                name={`projects.${index}.name` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>项目名称</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：IUV 通信设计大赛平台" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`projects.${index}.role` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>项目角色</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：小组组长" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`projects.${index}.startDate` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>开始时间</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：2023.05" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`projects.${index}.endDate` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>结束时间</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：2023.10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`projects.${index}.description` as const}
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>项目描述</FormLabel>
                    <FormControl>
                      <textarea
                        className={textAreaClassName}
                        placeholder="描述项目背景、目标和整体方案。"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`projects.${index}.responsibilities` as const}
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>个人职责</FormLabel>
                    <FormControl>
                      <textarea
                        className={textAreaClassName}
                        placeholder="描述你负责的核心任务。"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`projects.${index}.techStack` as const}
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>技术栈 / 工具</FormLabel>
                    <FormControl>
                      <textarea
                        className={textAreaClassName}
                        placeholder="例如：React、Next.js、Python、CAD。"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`projects.${index}.outcomes` as const}
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>项目成果 / 数据</FormLabel>
                    <FormControl>
                      <textarea
                        className={textAreaClassName}
                        placeholder="例如：完成原型落地，评审得分 95+。"
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
