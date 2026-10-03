"use client";

import { Control } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResumeValues } from "@/lib/schema";

type CertificatesFormProps = {
  control: Control<ResumeValues>;
};

export function CertificatesForm({ control }: CertificatesFormProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900">技能证书</h2>
      <p className="mt-1 text-sm text-gray-500">
        填写证书与语言能力，面向岗位精准展示。
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="certificates.english"
          render={({ field }) => (
            <FormItem>
              <FormLabel>英语等级</FormLabel>
              <FormControl>
                <Input placeholder="例如：CET-6 520分" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="certificates.computer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>计算机证书</FormLabel>
              <FormControl>
                <Input placeholder="例如：计算机二级（Python）" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="certificates.professional"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>专业证书</FormLabel>
              <FormControl>
                <Input placeholder="例如：软考中级、教师资格证" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="certificates.software"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>软件技能</FormLabel>
              <FormControl>
                <Input placeholder="例如：Office、PS、Python、Java、CAD" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="certificates.language"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>语言能力</FormLabel>
              <FormControl>
                <Input placeholder="例如：普通话二甲、英语可工作交流" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
