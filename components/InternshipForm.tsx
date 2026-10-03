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

type InternshipFormProps = {
  control: Control<ResumeValues>;
};

const textAreaClassName =
  "flex min-h-[96px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background " +
  "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
  "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export function InternshipForm({ control }: InternshipFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "internships",
  });
  const atLimit = fields.length >= ARRAY_LIMITS.internships;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">实习经历</h2>
          <p className="mt-1 text-sm text-gray-500">
            填写工作内容、成果和负责模块，突出实践产出。
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={atLimit}
          onClick={() =>
            append({
              company: "",
              position: "",
              startDate: "",
              endDate: "",
              content: "",
              achievements: "",
              modules: "",
            })
          }
        >
          {atLimit
            ? `已达上限（${ARRAY_LIMITS.internships} 条）`
            : "新增实习经历"}
        </Button>
      </div>

      <div className="mt-6 space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border border-gray-200 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                实习经历 {index + 1}
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
                name={`internships.${index}.company` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>公司名称</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：欧姆龙自动化（中国）" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`internships.${index}.position` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>实习岗位</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：设备测试工程师" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`internships.${index}.startDate` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>开始时间</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：2024.04" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`internships.${index}.endDate` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>结束时间</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：2024.09" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`internships.${index}.content` as const}
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>工作内容</FormLabel>
                    <FormControl>
                      <textarea
                        className={textAreaClassName}
                        placeholder="描述日常工作内容与职责范围。"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`internships.${index}.achievements` as const}
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>工作成果</FormLabel>
                    <FormControl>
                      <textarea
                        className={textAreaClassName}
                        placeholder="例如：效率提升、故障率下降、流程优化等量化成果。"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`internships.${index}.modules` as const}
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>负责模块</FormLabel>
                    <FormControl>
                      <textarea
                        className={textAreaClassName}
                        placeholder="例如：设备调试模块、自动化测试模块。"
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
