"use client";

import Image from "next/image";
import { ChangeEvent } from "react";
import { Control } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ResumeValues } from "@/lib/schema";

type PersonalInfoFormProps = {
  control: Control<ResumeValues>;
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("读取图片失败"));
      }
    };
    reader.onerror = () => reject(new Error("读取图片失败"));
    reader.readAsDataURL(file);
  });
}

export function PersonalInfoForm({ control }: PersonalInfoFormProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900">基本信息</h2>
      <p className="mt-1 text-sm text-gray-500">
        可填写基础档案、政治面貌和头像，主题颜色可自由调整。
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="personalInfo.fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>姓名</FormLabel>
              <FormControl>
                <Input placeholder="例如：张三" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="personalInfo.gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>性别</FormLabel>
              <FormControl>
                <Input placeholder="例如：男" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="personalInfo.birthDateAge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>出生年月 / 年龄</FormLabel>
              <FormControl>
                <Input placeholder="例如：2001.06 / 23岁" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="personalInfo.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>手机号码</FormLabel>
              <FormControl>
                <Input placeholder="例如：13800138000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="personalInfo.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>电子邮箱</FormLabel>
              <FormControl>
                <Input placeholder="例如：name@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="personalInfo.city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>现居城市</FormLabel>
              <FormControl>
                <Input placeholder="例如：上海" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="personalInfo.jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>求职意向（岗位）</FormLabel>
              <FormControl>
                <Input placeholder="例如：测试工程师" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="personalInfo.politicalStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>政治面貌</FormLabel>
              <FormControl>
                <Input placeholder="例如：群众 / 团员 / 党员" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="personalInfo.nativePlace"
          render={({ field }) => (
            <FormItem>
              <FormLabel>籍贯（可选）</FormLabel>
              <FormControl>
                <Input placeholder="例如：江苏盐城" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="personalInfo.github"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Github / 作品链接（可选）</FormLabel>
              <FormControl>
                <Input placeholder="例如：https://github.com/your-name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="personalInfo.avatar"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>照片（可选）</FormLabel>
              <FormControl>
                <Input
                  name={field.name}
                  ref={field.ref}
                  type="file"
                  accept="image/*"
                  onBlur={field.onBlur}
                  onChange={async (event: ChangeEvent<HTMLInputElement>) => {
                    const selectedFile = event.target.files?.[0];
                    if (!selectedFile) {
                      return;
                    }
                    try {
                      const dataUrl = await readFileAsDataUrl(selectedFile);
                      field.onChange(dataUrl);
                    } catch {
                      field.onChange("");
                    }
                  }}
                />
              </FormControl>
              {field.value ? (
                <div className="mt-3 flex items-center gap-4 rounded-md border border-gray-200 bg-gray-50 p-3">
                  <Image
                    src={field.value}
                    alt="头像预览"
                    width={72}
                    height={96}
                    unoptimized
                    className="h-24 w-[72px] rounded object-cover"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => field.onChange("")}
                  >
                    移除照片
                  </Button>
                </div>
              ) : null}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="personalInfo.sidebarColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>侧栏颜色</FormLabel>
              <FormControl>
                <div className="flex items-center gap-3">
                  <Input
                    type="color"
                    className="h-10 w-14 cursor-pointer p-1"
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <Input {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="personalInfo.accentColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>标题强调色</FormLabel>
              <FormControl>
                <div className="flex items-center gap-3">
                  <Input
                    type="color"
                    className="h-10 w-14 cursor-pointer p-1"
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <Input {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="personalInfo.sidebarSpacing"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <div className="flex items-center justify-between">
                <FormLabel>左侧模块间距</FormLabel>
                <span className="text-sm text-gray-500">{field.value}px</span>
              </div>
              <FormControl>
                <input
                  type="range"
                  min={6}
                  max={20}
                  step={1}
                  value={field.value}
                  onChange={(event) => field.onChange(Number(event.target.value))}
                  className="mt-2 h-2 w-full cursor-pointer accent-[#0f6db6]"
                />
              </FormControl>
              <p className="text-xs text-gray-500">
                仅调节左侧栏的模块留白、卡片高度和内部间距。
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="personalInfo.contentSpacing"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <div className="flex items-center justify-between">
                <FormLabel>右侧模块间距</FormLabel>
                <span className="text-sm text-gray-500">{field.value}px</span>
              </div>
              <FormControl>
                <input
                  type="range"
                  min={0}
                  max={24}
                  step={1}
                  value={field.value}
                  onChange={(event) => field.onChange(Number(event.target.value))}
                  className="mt-2 h-2 w-full cursor-pointer accent-[#0f6db6]"
                />
              </FormControl>
              <p className="text-xs text-gray-500">
                仅调节右侧栏各模块之间的间距与模块内部留白。
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
