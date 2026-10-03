"use client";

import { Control } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ResumeValues } from "@/lib/schema";

type SelfEvaluationFormProps = {
  control: Control<ResumeValues>;
};

const textAreaClassName =
  "flex min-h-[110px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background " +
  "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
  "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export function SelfEvaluationForm({ control }: SelfEvaluationFormProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900">自我评价</h2>
      <p className="mt-1 text-sm text-gray-500">
        建议简明、真实、可量化，避免空泛描述。
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4">
        <FormField
          control={control}
          name="selfEvaluation.strengths"
          render={({ field }) => (
            <FormItem>
              <FormLabel>个人优势</FormLabel>
              <FormControl>
                <textarea
                  className={textAreaClassName}
                  placeholder="描述你的核心优势和亮点。"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="selfEvaluation.professionalAbility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>专业能力</FormLabel>
              <FormControl>
                <textarea
                  className={textAreaClassName}
                  placeholder="描述专业能力与工具掌握程度。"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="selfEvaluation.jobAttitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>求职态度</FormLabel>
              <FormControl>
                <textarea
                  className={textAreaClassName}
                  placeholder="描述你的执行力、责任心、协作方式。"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="selfEvaluation.careerPlan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>职业规划（简短）</FormLabel>
              <FormControl>
                <textarea
                  className={textAreaClassName}
                  placeholder="描述你未来 1-3 年的目标方向。"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
