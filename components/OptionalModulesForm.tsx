"use client";

import { Control, useWatch } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ResumeValues } from "@/lib/schema";

type OptionalModulesFormProps = {
  control: Control<ResumeValues>;
};

const textAreaClassName =
  "flex min-h-[96px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background " +
  "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
  "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

function OptionalSwitch({
  control,
  name,
  label,
}: {
  control: Control<ResumeValues>;
  name:
    | "optionalModules.enabled.portfolio"
    | "optionalModules.enabled.training"
    | "optionalModules.enabled.papersPatents"
    | "optionalModules.enabled.socialPractice"
    | "optionalModules.enabled.hobbies";
  label: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="rounded-md border border-gray-200 px-3 py-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FormControl>
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={field.value}
                onChange={(event) => field.onChange(event.target.checked)}
              />
            </FormControl>
            {label}
          </label>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function OptionalModulesForm({ control }: OptionalModulesFormProps) {
  const enabled = useWatch({
    control,
    name: "optionalModules.enabled",
  });

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900">附加模块（可选）</h2>
      <p className="mt-1 text-sm text-gray-500">
        高级模块默认非必填，可按岗位要求勾选启用。
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        <OptionalSwitch
          control={control}
          name="optionalModules.enabled.portfolio"
          label="作品集链接"
        />
        <OptionalSwitch
          control={control}
          name="optionalModules.enabled.training"
          label="培训经历"
        />
        <OptionalSwitch
          control={control}
          name="optionalModules.enabled.papersPatents"
          label="论文 / 专利"
        />
        <OptionalSwitch
          control={control}
          name="optionalModules.enabled.socialPractice"
          label="社会实践 / 志愿者经历"
        />
        <OptionalSwitch
          control={control}
          name="optionalModules.enabled.hobbies"
          label="兴趣爱好（精简）"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4">
        {enabled?.portfolio ? (
          <FormField
            control={control}
            name="optionalModules.portfolioLinks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>作品集链接</FormLabel>
                <FormControl>
                  <textarea
                    className={textAreaClassName}
                    placeholder="例如：GitHub、博客、设计作品链接。"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        {enabled?.training ? (
          <FormField
            control={control}
            name="optionalModules.trainingExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>培训经历</FormLabel>
                <FormControl>
                  <textarea
                    className={textAreaClassName}
                    placeholder="描述培训时间、机构、重点内容。"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        {enabled?.papersPatents ? (
          <FormField
            control={control}
            name="optionalModules.papersPatents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>发表论文 / 专利</FormLabel>
                <FormControl>
                  <textarea
                    className={textAreaClassName}
                    placeholder="填写论文题目、刊物或专利信息。"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        {enabled?.socialPractice ? (
          <FormField
            control={control}
            name="optionalModules.socialPractice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>社会实践 / 志愿者经历</FormLabel>
                <FormControl>
                  <textarea
                    className={textAreaClassName}
                    placeholder="描述项目、职责与成果。"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        {enabled?.hobbies ? (
          <FormField
            control={control}
            name="optionalModules.hobbies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>兴趣爱好（精简）</FormLabel>
                <FormControl>
                  <textarea
                    className={textAreaClassName}
                    placeholder="简短填写 1-3 项即可。"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}
      </div>
    </div>
  );
}
