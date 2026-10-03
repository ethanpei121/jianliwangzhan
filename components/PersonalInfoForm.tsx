"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
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

/** 原图上限 2MB；base64 约膨胀 1.33 倍，转换后仍在 schema 的 600 万字符以内。 */
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

const DEFAULT_SIDEBAR_COLOR = "#0f6db6";
const DEFAULT_ACCENT_COLOR = "#0f6db6";

function isHexColor(value: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(value ?? "");
}

/**
 * 返回读取 Promise 与 abort 句柄。
 * 组件卸载或用户改选时必须 abort，否则会对已废弃的表单实例写入。
 */
function readFileAsDataUrl(file: File) {
  const reader = new FileReader();
  const promise = new Promise<string>((resolve, reject) => {
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("读取图片失败"));
      }
    };
    reader.onerror = () => reject(new Error("读取图片失败"));
    reader.onabort = () => reject(new Error("读取已取消"));
    reader.readAsDataURL(file);
  });
  return { promise, abort: () => reader.abort() };
}

export function PersonalInfoForm({ control }: PersonalInfoFormProps) {
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const activeReader = useRef<{ abort: () => void } | null>(null);

  useEffect(() => {
    return () => {
      activeReader.current?.abort();
    };
  }, []);

  const handleAvatarFile = async (
    event: ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void,
  ) => {
    const input = event.target;
    const selectedFile = input.files?.[0];
    if (!selectedFile) {
      return;
    }

    setAvatarError(null);

    // 先做体积校验：否则超大图片会先被完整读成几百万字符的 dataURL
    // 塞进表单，再被 schema 判错，期间还会被自动保存完整写进数据库。
    if (selectedFile.size > MAX_AVATAR_BYTES) {
      input.value = "";
      setAvatarError("图片不能超过 2MB，请压缩后再上传");
      return;
    }

    const { promise, abort } = readFileAsDataUrl(selectedFile);
    activeReader.current = { abort };

    try {
      onChange(await promise);
    } catch {
      input.value = "";
      setAvatarError("图片读取失败，请换一张图片重试");
    } finally {
      activeReader.current = null;
    }
  };

  const clearAvatar = (onChange: (value: string) => void) => {
    activeReader.current?.abort();
    activeReader.current = null;
    onChange("");
    setAvatarError(null);
    // 清空原生 input 的值，否则再选同一个文件不会触发 change 事件。
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
              <FormLabel>GitHub / 作品链接（可选）</FormLabel>
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
                  ref={(element) => {
                    fileInputRef.current = element;
                    field.ref(element);
                  }}
                  type="file"
                  accept="image/*"
                  onBlur={field.onBlur}
                  onChange={(event) => {
                    void handleAvatarFile(event, field.onChange);
                  }}
                />
              </FormControl>
              {avatarError ? (
                <p className="mt-1 text-xs text-red-600">{avatarError}</p>
              ) : null}
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
                    onClick={() => clearAvatar(field.onChange)}
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
              <div className="flex items-center gap-3">
                <Input
                  type="color"
                  className="h-10 w-14 cursor-pointer p-1"
                  // 文本框里的值非法时（如 "red"），<input type="color"> 会静默回退成
                  // #000000，色块与文本框对不上。回退到默认色而不是黑色。
                  value={isHexColor(field.value) ? field.value : DEFAULT_SIDEBAR_COLOR}
                  onChange={field.onChange}
                  aria-label="侧栏颜色取色器"
                />
                {/* FormControl 必须直接包住真正的 input，否则 id / aria-invalid
                    会落到外层 div 上，label 关联与读屏都失效。 */}
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </div>
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
              <div className="flex items-center gap-3">
                <Input
                  type="color"
                  className="h-10 w-14 cursor-pointer p-1"
                  value={isHexColor(field.value) ? field.value : DEFAULT_ACCENT_COLOR}
                  onChange={field.onChange}
                  aria-label="标题强调色取色器"
                />
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </div>
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
