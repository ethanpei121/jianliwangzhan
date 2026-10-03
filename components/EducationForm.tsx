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

type EducationFormProps = {
  control: Control<ResumeValues>;
};

const textAreaClassName =
  "flex min-h-[96px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background " +
  "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
  "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export function EducationForm({ control }: EducationFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });
  const atLimit = fields.length >= ARRAY_LIMITS.education;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">教育背景</h2>
          <p className="mt-1 text-sm text-gray-500">
            支持主修课程、GPA、在校荣誉等补充信息。
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={atLimit}
          onClick={() =>
            append({
              school: "",
              degree: "",
              major: "",
              startDate: "",
              endDate: "",
              courses: "",
              gpaRank: "",
              honors: "",
            })
          }
        >
          {atLimit
            ? `已达上限（${ARRAY_LIMITS.education} 条）`
            : "新增教育背景"}
        </Button>
      </div>

      <div className="mt-6 space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border border-gray-200 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                教育经历 {index + 1}
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
                name={`education.${index}.school` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>学校名称</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：盐城师范学院" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`education.${index}.degree` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>学历</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：本科" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`education.${index}.major` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>专业</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：电子信息工程" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`education.${index}.startDate` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>入学时间</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：2020.09" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`education.${index}.endDate` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>毕业时间</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：2024.06" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`education.${index}.gpaRank` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GPA / 成绩排名（可选）</FormLabel>
                    <FormControl>
                      <Input placeholder="例如：3.8/4.0（前 10%）" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`education.${index}.courses` as const}
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>主修课程（可选）</FormLabel>
                    <FormControl>
                      <textarea
                        className={textAreaClassName}
                        placeholder="例如：模拟电路、信号与系统、数字信号处理等。"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`education.${index}.honors` as const}
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>在校荣誉</FormLabel>
                    <FormControl>
                      <textarea
                        className={textAreaClassName}
                        placeholder="例如：国家奖学金、三好学生、学科竞赛一等奖。"
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
