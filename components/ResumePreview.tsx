import Image from "next/image";
import { memo, type ReactNode } from "react";
import {
  BriefcaseBusiness,
  FolderKanban,
  GraduationCap,
  IdCard,
  Languages,
  Medal,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

import { ResumeValues } from "@/lib/schema";
import {
  type ProcessedResumeData,
  type TemplateId,
  clampNumber,
  defaultAccentColor,
  defaultSidebarColor,
  formatRange,
  getContrastTextColor,
  hasValue,
  mixWithBlack,
  processResumeData,
  safeHexColor,
  withOpacity,
} from "@/lib/resume-templates";
import { ResumeTemplate2 } from "./ResumeTemplate2";
import { ResumeTemplate3 } from "./ResumeTemplate3";

type ResumePreviewProps = {
  data: ResumeValues;
  template?: TemplateId;
};

type SectionTitleProps = {
  title: string;
  color: string;
  icon: LucideIcon;
};

type SidebarField = {
  label: string;
  value: string;
  optional?: boolean;
  wide?: boolean;
};

const SectionTitle = memo(function SectionTitle({
  title,
  color,
  icon: Icon,
}: SectionTitleProps) {
  const titleColor = mixWithBlack(color, 0.28);
  return (
    <div className="mb-2 flex items-center gap-1.5">
      <span
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border shadow-sm"
        style={{
          backgroundColor: withOpacity(color, 0.12),
          borderColor: withOpacity(color, 0.25),
          color,
        }}
      >
        <Icon size={13} />
      </span>
      <h2
        className="text-[11px] font-bold tracking-[0.18em]"
        style={{ color: titleColor }}
      >
        {title}
      </h2>
      <span
        className="h-px flex-1"
        style={{
          background: `linear-gradient(90deg, ${withOpacity(color, 0.45)}, rgba(148, 163, 184, 0.08))`,
        }}
      />
    </div>
  );
});

const SidebarInfoItem = memo(function SidebarInfoItem({
  label,
  value,
  textColor,
  wide,
  spacing,
}: {
  label: string;
  value: string;
  textColor: string;
  wide?: boolean;
  spacing: number;
}) {
  return (
    <div
      className={`flex flex-col justify-center rounded-lg border ${
        wide ? "col-span-2" : ""
      }`}
      style={{
        minHeight: `${42 + spacing}px`,
        padding: `${Math.max(7, spacing - 1)}px ${Math.max(10, spacing)}px`,
        borderColor: withOpacity(textColor, 0.2),
        backgroundColor: withOpacity("#ffffff", 0.08),
      }}
    >
      <p
        className="leading-none text-[10px] font-medium"
        style={{ color: withOpacity(textColor, 0.78) }}
      >
        {label}
      </p>
      <p
        className="mt-1 text-[11px] leading-[1.25]"
        style={{ color: withOpacity(textColor, 0.95) }}
      >
        {hasValue(value) ? value : "待填写"}
      </p>
    </div>
  );
});

const MetaBadge = memo(function MetaBadge({
  value,
  accentColor,
  subtle = false,
}: {
  value: string;
  accentColor: string;
  subtle?: boolean;
}) {
  const textColor = subtle
    ? withOpacity(mixWithBlack(accentColor, 0.42), 0.78)
    : withOpacity(mixWithBlack(accentColor, 0.34), 0.9);
  const dividerColor = subtle
    ? withOpacity(accentColor, 0.24)
    : withOpacity(accentColor, 0.34);

  return (
    <span
      className="inline-flex max-w-[52%] shrink-0 items-start justify-end pl-2 text-right text-[10px] font-semibold leading-[1.25] tracking-[0.02em] break-all"
      style={{
        color: textColor,
        borderLeft: `2px solid ${dividerColor}`,
      }}
    >
      {value}
    </span>
  );
});

function ContentCard({
  children,
  accentColor,
  spacing,
}: {
  children: ReactNode;
  accentColor: string;
  spacing: number;
}) {
  return (
    <section
      className="rounded-xl border shadow-sm"
      style={{
        padding: `${Math.max(4, spacing + 2)}px`,
        borderColor: withOpacity(accentColor, 0.22),
        backgroundColor: withOpacity(accentColor, 0.055),
      }}
    >
      {children}
    </section>
  );
}

function ResumeTemplate1({ processed }: { processed: ProcessedResumeData }) {
  const {
    personalInfo,
    education,
    internships,
    projects,
    workExperience,
    campusExperience,
    awards,
    certificateList,
    selfEvaluationList,
    optionalList,
  } = processed;

  const sidebarColor = safeHexColor(personalInfo.sidebarColor, defaultSidebarColor);
  const accentColor = safeHexColor(personalInfo.accentColor, defaultAccentColor);
  const sidebarTextColor = getContrastTextColor(sidebarColor);
  const sidebarSpacing = clampNumber(personalInfo.sidebarSpacing ?? 10, 6, 20);
  const contentSpacing = clampNumber(personalInfo.contentSpacing ?? 6, 0, 24);
  const contentBlockGap = Math.max(2, contentSpacing);
  const contentItemGap = Math.max(1, contentSpacing - 1);
  const contentBoxPaddingY = Math.max(3, contentSpacing);
  const contentBoxPaddingX = Math.max(5, contentSpacing + 1);

  const leftInfo: SidebarField[] = [
    { label: "性别", value: personalInfo.gender },
    { label: "出生年月 / 年龄", value: personalInfo.birthDateAge },
    { label: "政治面貌", value: personalInfo.politicalStatus },
    { label: "现居城市", value: personalInfo.city },
    { label: "籍贯", value: personalInfo.nativePlace },
    { label: "手机", value: personalInfo.phone, wide: true },
    { label: "邮箱", value: personalInfo.email, wide: true },
    { label: "作品链接（可选）", value: personalInfo.github, optional: true, wide: true },
  ];
  const visibleLeftInfo = leftInfo.filter(
    (item) => !item.optional || hasValue(item.value),
  );

  const sidebarBottomColor = mixWithBlack(sidebarColor, 0.35);

  return (
    <div
      data-resume-preview="true"
      className="h-full min-h-full bg-white text-slate-800 [font-family:var(--font-geist-sans)]"
    >
      <div className="grid h-full min-h-full grid-cols-[32%_68%]">
        <aside
          className="relative h-full overflow-hidden"
          style={{
            padding: `${sidebarSpacing + 4}px ${Math.max(12, sidebarSpacing + 2)}px`,
            background: `linear-gradient(180deg, ${withOpacity(sidebarColor, 0.98)} 0%, ${withOpacity(
              sidebarColor,
              0.88,
            )} 45%, ${withOpacity(sidebarBottomColor, 0.98)} 100%)`,
          }}
        >
          <div
            className="pointer-events-none absolute -left-8 -top-10 h-32 w-32 rounded-full blur-2xl"
            style={{ backgroundColor: withOpacity("#ffffff", 0.18) }}
          />
          <div
            className="pointer-events-none absolute -bottom-10 -right-8 h-36 w-36 rounded-full blur-2xl"
            style={{ backgroundColor: withOpacity(accentColor, 0.28) }}
          />

          <div
            className="relative grid grid-cols-[72px_1fr] items-center"
            style={{ gap: `${sidebarSpacing}px` }}
          >
            <div className="h-24 w-[72px] overflow-hidden rounded-lg border-2 border-white/45 bg-white/10 shadow-lg">
              {hasValue(personalInfo.avatar) ? (
                <Image
                  src={personalInfo.avatar}
                  alt="简历头像"
                  width={96}
                  height={128}
                  unoptimized
                  priority
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className="flex h-full items-center justify-center text-[11px]"
                  style={{ color: withOpacity(sidebarTextColor, 0.84) }}
                >
                  上传照片
                </div>
              )}
            </div>

            <div
              className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-[1px]"
              style={{ padding: `${Math.max(8, sidebarSpacing - 1)}px ${Math.max(10, sidebarSpacing)}px` }}
            >
              <p
                className="text-[9px] tracking-[0.2em]"
                style={{ color: withOpacity(sidebarTextColor, 0.72) }}
              >
                PROFILE
              </p>
              <p className="mt-1 text-[15px] font-semibold" style={{ color: sidebarTextColor }}>
                {hasValue(personalInfo.fullName) ? personalInfo.fullName : "你的姓名"}
              </p>
              <p
                className="mt-1 text-[11px] leading-[1.3]"
                style={{ color: withOpacity(sidebarTextColor, 0.86) }}
              >
                {hasValue(personalInfo.jobTitle) ? personalInfo.jobTitle : "求职意向 / 岗位"}
              </p>
            </div>
          </div>

          <div
            className="relative grid grid-cols-2"
            style={{
              marginTop: `${sidebarSpacing}px`,
              gap: `${Math.max(8, sidebarSpacing - 1)}px`,
            }}
          >
            {visibleLeftInfo.map((item) => (
              <SidebarInfoItem
                key={item.label}
                label={item.label}
                value={item.value}
                textColor={sidebarTextColor}
                wide={item.wide}
                spacing={sidebarSpacing}
              />
            ))}
          </div>
        </aside>

        <section
          className="relative flex h-full flex-col"
          style={{
            gap: `${contentBlockGap}px`,
            padding: `${Math.max(3, contentSpacing + 4)}px ${Math.max(6, contentSpacing + 7)}px`,
            background: `linear-gradient(180deg, ${withOpacity(accentColor, 0.12)} 0%, ${withOpacity(
              accentColor,
              0.08,
            )} 38%, ${withOpacity(accentColor, 0.09)} 100%)`,
          }}
        >
          <ContentCard accentColor={accentColor} spacing={contentSpacing}>
            <SectionTitle title="教育背景" color={accentColor} icon={GraduationCap} />
            {education.length > 0 ? (
              <div
                className="flex flex-col text-[11px] leading-5 text-slate-700"
                style={{ gap: `${contentItemGap}px` }}
              >
                {education.map((item, index) => (
                  <div
                    key={`${item.school}-${index}`}
                    className="rounded-lg border border-slate-200/80"
                    style={{
                      padding: `${contentBoxPaddingY}px ${contentBoxPaddingX}px`,
                      backgroundColor: withOpacity(accentColor, 0.04),
                    }}
                  >
                    <div className="flex min-w-0 items-start justify-between gap-2">
                      <span className="min-w-0 break-words font-semibold text-slate-800">
                        {[item.school, item.major, item.degree]
                          .filter(hasValue)
                          .join(" ｜ ")}
                      </span>
                      <MetaBadge
                        value={formatRange(item.startDate, item.endDate) || "时间待补充"}
                        accentColor={accentColor}
                      />
                    </div>
                    <div className="mt-1.5 space-y-1">
                      {hasValue(item.courses) ? <p>主修课程：{item.courses}</p> : null}
                      {hasValue(item.gpaRank) ? <p>GPA/排名：{item.gpaRank}</p> : null}
                      {hasValue(item.honors) ? <p>在校荣誉：{item.honors}</p> : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-300">请补充教育背景。</p>
            )}
          </ContentCard>

          {internships.length > 0 ? (
            <ContentCard accentColor={accentColor} spacing={contentSpacing}>
              <SectionTitle title="实习经历" color={accentColor} icon={BriefcaseBusiness} />
              <div
                className="flex flex-col text-[11px] leading-5 text-slate-700"
                style={{ gap: `${contentItemGap}px` }}
              >
                {internships.map((item, index) => (
                  <div
                    key={`${item.company}-${index}`}
                    className="rounded-lg border border-slate-200/80"
                    style={{
                      padding: `${contentBoxPaddingY}px ${contentBoxPaddingX}px`,
                      backgroundColor: withOpacity(accentColor, 0.04),
                    }}
                  >
                    <div className="flex min-w-0 items-start justify-between gap-2">
                      <span className="min-w-0 break-words font-semibold text-slate-800">
                        {[item.company, item.position].filter(hasValue).join(" ｜ ")}
                      </span>
                      <MetaBadge
                        value={formatRange(item.startDate, item.endDate) || "时间待补充"}
                        accentColor={accentColor}
                        subtle
                      />
                    </div>
                    <div className="mt-1.5 space-y-1">
                      {hasValue(item.content) ? <p>工作内容：{item.content}</p> : null}
                      {hasValue(item.achievements) ? <p>工作成果：{item.achievements}</p> : null}
                      {hasValue(item.modules) ? <p>负责模块：{item.modules}</p> : null}
                    </div>
                  </div>
                ))}
              </div>
            </ContentCard>
          ) : null}

          {projects.length > 0 ? (
            <ContentCard accentColor={accentColor} spacing={contentSpacing}>
              <SectionTitle title="项目经历" color={accentColor} icon={FolderKanban} />
              <div
                className="flex flex-col text-[11px] leading-5 text-slate-700"
                style={{ gap: `${contentItemGap}px` }}
              >
                {projects.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="rounded-lg border border-slate-200/80"
                    style={{
                      padding: `${contentBoxPaddingY}px ${contentBoxPaddingX}px`,
                      backgroundColor: withOpacity(accentColor, 0.04),
                    }}
                  >
                    <div className="flex min-w-0 items-start justify-between gap-2">
                      <span className="min-w-0 break-words font-semibold text-slate-800">
                        {[item.name, item.role].filter(hasValue).join(" ｜ ")}
                      </span>
                      <MetaBadge
                        value={formatRange(item.startDate, item.endDate) || "时间待补充"}
                        accentColor={accentColor}
                        subtle
                      />
                    </div>
                    <div className="mt-1.5 space-y-1">
                      {hasValue(item.description) ? <p>项目描述：{item.description}</p> : null}
                      {hasValue(item.responsibilities) ? <p>个人职责：{item.responsibilities}</p> : null}
                      {hasValue(item.techStack) ? <p>技术栈：{item.techStack}</p> : null}
                      {hasValue(item.outcomes) ? <p>项目成果：{item.outcomes}</p> : null}
                    </div>
                  </div>
                ))}
              </div>
            </ContentCard>
          ) : null}

          {workExperience.length > 0 ? (
            <ContentCard accentColor={accentColor} spacing={contentSpacing}>
              <SectionTitle title="工作经历" color={accentColor} icon={BriefcaseBusiness} />
              <div
                className="flex flex-col text-[11px] leading-5 text-slate-700"
                style={{ gap: `${contentItemGap}px` }}
              >
                {workExperience.map((item, index) => (
                  <div
                    key={`${item.company}-${index}`}
                    className="rounded-lg border border-slate-200/80"
                    style={{
                      padding: `${contentBoxPaddingY}px ${contentBoxPaddingX}px`,
                      backgroundColor: withOpacity(accentColor, 0.04),
                    }}
                  >
                    <div className="flex min-w-0 items-start justify-between gap-2">
                      <span className="min-w-0 break-words font-semibold text-slate-800">
                        {[item.company, item.position].filter(hasValue).join(" ｜ ")}
                      </span>
                      <MetaBadge
                        value={formatRange(item.startDate, item.endDate) || "时间待补充"}
                        accentColor={accentColor}
                        subtle
                      />
                    </div>
                    <div className="mt-1.5 space-y-1">
                      {hasValue(item.content) ? <p>工作内容：{item.content}</p> : null}
                      {hasValue(item.achievements) ? <p>业绩成果：{item.achievements}</p> : null}
                      {hasValue(item.management) ? <p>管理经验：{item.management}</p> : null}
                    </div>
                  </div>
                ))}
              </div>
            </ContentCard>
          ) : null}

          {campusExperience.length > 0 ? (
            <ContentCard accentColor={accentColor} spacing={contentSpacing}>
              <SectionTitle title="校园经历" color={accentColor} icon={Users} />
              <div
                className="flex flex-col text-[11px] leading-5 text-slate-700"
                style={{ gap: `${contentItemGap}px` }}
              >
                {campusExperience.map((item, index) => (
                  <div
                    key={`${item.organization}-${index}`}
                    className="rounded-lg border border-slate-200/80"
                    style={{
                      padding: `${contentBoxPaddingY}px ${contentBoxPaddingX}px`,
                      backgroundColor: withOpacity(accentColor, 0.04),
                    }}
                  >
                    <div className="flex min-w-0 items-start justify-between gap-2">
                      <span className="min-w-0 break-words font-semibold text-slate-800">
                        {[item.organization, item.role].filter(hasValue).join(" ｜ ")}
                      </span>
                      <MetaBadge
                        value={hasValue(item.time) ? item.time : "时间待补充"}
                        accentColor={accentColor}
                        subtle
                      />
                    </div>
                    <div className="mt-1.5 space-y-1">
                      {hasValue(item.responsibilities) ? <p>负责工作：{item.responsibilities}</p> : null}
                      {hasValue(item.outcomes) ? <p>活动成果：{item.outcomes}</p> : null}
                    </div>
                  </div>
                ))}
              </div>
            </ContentCard>
          ) : null}

          {certificateList.length > 0 ? (
            <ContentCard accentColor={accentColor} spacing={contentSpacing}>
              <SectionTitle title="技能证书" color={accentColor} icon={Languages} />
              <div
                className="flex flex-wrap text-[11px]"
                style={{ gap: `${contentItemGap}px` }}
              >
                {certificateList.map((item) => (
                  <span
                    key={item.label}
                    className="rounded-full border border-slate-200 px-2 py-0.5 text-slate-700"
                    style={{ backgroundColor: withOpacity(accentColor, 0.05) }}
                  >
                    {item.label}：{item.value}
                  </span>
                ))}
              </div>
            </ContentCard>
          ) : null}

          {awards.length > 0 ? (
            <ContentCard accentColor={accentColor} spacing={contentSpacing}>
              <SectionTitle title="获奖情况" color={accentColor} icon={Medal} />
              <ul
                className="flex flex-col text-[11px] leading-5 text-slate-700"
                style={{ gap: `${contentItemGap}px` }}
              >
                {awards.map((item, index) => (
                  <li
                    key={`${item.name}-${index}`}
                    className="rounded-lg border border-slate-200/80"
                    style={{
                      padding: `${contentBoxPaddingY}px ${contentBoxPaddingX}px`,
                      backgroundColor: withOpacity(accentColor, 0.04),
                    }}
                  >
                    {[item.date, item.name, item.level, item.issuer]
                      .filter(hasValue)
                      .join(" ｜ ")}
                  </li>
                ))}
              </ul>
            </ContentCard>
          ) : null}

          {selfEvaluationList.length > 0 ? (
            <ContentCard accentColor={accentColor} spacing={contentSpacing}>
              <SectionTitle title="自我评价" color={accentColor} icon={Sparkles} />
              <ul
                className="flex flex-col text-[11px] leading-5 text-slate-700"
                style={{ gap: `${contentItemGap}px` }}
              >
                {selfEvaluationList.map((item) => (
                  <li
                    key={item.label}
                    className="rounded-lg border border-slate-200/80"
                    style={{
                      padding: `${contentBoxPaddingY}px ${contentBoxPaddingX}px`,
                      backgroundColor: withOpacity(accentColor, 0.04),
                    }}
                  >
                    <span className="min-w-0 break-words font-semibold text-slate-800">{item.label}：</span>
                    {item.value}
                  </li>
                ))}
              </ul>
            </ContentCard>
          ) : null}

          {optionalList.length > 0 ? (
            <ContentCard accentColor={accentColor} spacing={contentSpacing}>
              <SectionTitle title="附加模块" color={accentColor} icon={IdCard} />
              <ul
                className="flex flex-col text-[11px] leading-5 text-slate-700"
                style={{ gap: `${contentItemGap}px` }}
              >
                {optionalList.map((item) => (
                  <li
                    key={item.label}
                    className="rounded-lg border border-slate-200/80"
                    style={{
                      padding: `${contentBoxPaddingY}px ${contentBoxPaddingX}px`,
                      backgroundColor: withOpacity(accentColor, 0.04),
                    }}
                  >
                    <span className="min-w-0 break-words font-semibold text-slate-800">{item.label}：</span>
                    {item.value}
                  </li>
                ))}
              </ul>
            </ContentCard>
          ) : null}
        </section>
      </div>
    </div>
  );
}

export const ResumePreview = memo(function ResumePreview({
  data,
  template = "template1",
}: ResumePreviewProps) {
  const processed = processResumeData(data);

  if (template === "template2") return <ResumeTemplate2 processed={processed} />;
  if (template === "template3") return <ResumeTemplate3 processed={processed} />;

  return <ResumeTemplate1 processed={processed} />;
});
