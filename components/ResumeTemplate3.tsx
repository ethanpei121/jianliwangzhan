import Image from "next/image";

import {
  type ProcessedResumeData,
  defaultSidebarColor,
  defaultAccentColor,
  safeHexColor,
  withOpacity,
  mixWithBlack,
  getContrastTextColor,
  hasValue,
  formatRange,
  clampNumber,
} from "@/lib/resume-templates";

type Props = { processed: ProcessedResumeData };

export function ResumeTemplate3({ processed }: Props) {
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

  const accent = safeHexColor(personalInfo.accentColor, defaultAccentColor);
  const sidebarBg = safeHexColor(personalInfo.sidebarColor, defaultSidebarColor);
  const sidebarText = getContrastTextColor(sidebarBg);
  const spacing = clampNumber(personalInfo.contentSpacing ?? 6, 0, 24);
  const sectionGap = Math.max(4, spacing);

  const personalFields = [
    { label: "性别", value: personalInfo.gender },
    { label: "年龄", value: personalInfo.birthDateAge },
    { label: "电话", value: personalInfo.phone },
    { label: "邮箱", value: personalInfo.email },
    { label: "城市", value: personalInfo.city },
    { label: "政治面貌", value: personalInfo.politicalStatus },
    { label: "籍贯", value: personalInfo.nativePlace },
  ].filter((f) => hasValue(f.value));

  return (
    <div
      data-resume-preview="true"
      className="h-full min-h-full bg-white text-slate-800 [font-family:var(--font-geist-sans)]"
    >
      <div className="grid h-full min-h-full grid-cols-[30%_70%]">
        {/* ── Left column ── */}
        <aside
          className="relative flex flex-col gap-4 overflow-hidden"
          style={{
            padding: "18px 14px",
            backgroundColor: sidebarBg,
          }}
        >
          {/* Avatar + Name */}
          <div className="flex flex-col items-center text-center">
            <div
              className="h-[72px] w-[72px] overflow-hidden rounded-full border-[3px] bg-white/10 shadow-md"
              style={{ borderColor: withOpacity(sidebarText, 0.3) }}
            >
              {hasValue(personalInfo.avatar) ? (
                <Image
                  src={personalInfo.avatar}
                  alt="简历头像"
                  width={96}
                  height={96}
                  unoptimized
                  priority
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className="flex h-full items-center justify-center text-[10px]"
                  style={{ color: withOpacity(sidebarText, 0.65) }}
                >
                  照片
                </div>
              )}
            </div>
            <h1
              className="mt-2 text-[16px] font-bold tracking-wide"
              style={{ color: sidebarText }}
            >
              {hasValue(personalInfo.fullName) ? personalInfo.fullName : "你的姓名"}
            </h1>
            <p
              className="mt-0.5 text-[11px] font-medium"
              style={{ color: withOpacity(sidebarText, 0.78) }}
            >
              {hasValue(personalInfo.jobTitle) ? personalInfo.jobTitle : "求职意向"}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px" style={{ backgroundColor: withOpacity(sidebarText, 0.2) }} />

          {/* Personal info */}
          <div>
            <SidebarHeading text="个人信息" color={sidebarText} />
            <div className="mt-1.5 space-y-1.5">
              {personalFields.map((f) => (
                <div key={f.label} className="text-[10px] leading-[1.5]">
                  <span style={{ color: withOpacity(sidebarText, 0.6) }}>{f.label}</span>
                  <p className="font-medium" style={{ color: withOpacity(sidebarText, 0.92) }}>
                    {f.value}
                  </p>
                </div>
              ))}
              {hasValue(personalInfo.github) && (
                <div className="text-[10px] leading-[1.5]">
                  <span style={{ color: withOpacity(sidebarText, 0.6) }}>链接</span>
                  <p className="break-all font-medium" style={{ color: withOpacity(sidebarText, 0.92) }}>
                    {personalInfo.github}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Certificates on sidebar */}
          {certificateList.length > 0 && (
            <>
              <div className="h-px" style={{ backgroundColor: withOpacity(sidebarText, 0.2) }} />
              <div>
                <SidebarHeading text="技能证书" color={sidebarText} />
                <div className="mt-1.5 space-y-1">
                  {certificateList.map((item) => (
                    <div key={item.label} className="text-[10px] leading-[1.5]">
                      <span style={{ color: withOpacity(sidebarText, 0.6) }}>{item.label}</span>
                      <p className="font-medium" style={{ color: withOpacity(sidebarText, 0.92) }}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Self evaluation on sidebar */}
          {selfEvaluationList.length > 0 && (
            <>
              <div className="h-px" style={{ backgroundColor: withOpacity(sidebarText, 0.2) }} />
              <div>
                <SidebarHeading text="自我评价" color={sidebarText} />
                <div className="mt-1.5 space-y-1.5">
                  {selfEvaluationList.map((item) => (
                    <div key={item.label} className="text-[10px] leading-[1.5]">
                      <span style={{ color: withOpacity(sidebarText, 0.6) }}>{item.label}</span>
                      <p style={{ color: withOpacity(sidebarText, 0.88) }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </aside>

        {/* ── Right column / timeline ── */}
        <section
          className="overflow-hidden"
          style={{
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            gap: `${sectionGap}px`,
          }}
        >
          {/* Education */}
          {education.length > 0 && (
            <TimelineSection title="教育背景" accent={accent}>
              {education.map((item, i) => (
                <TimelineItem key={i} accent={accent} last={i === education.length - 1}>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-800">
                      {[item.school, item.degree, item.major].filter(hasValue).join(" · ")}
                    </span>
                    <TimeDate>{formatRange(item.startDate, item.endDate)}</TimeDate>
                  </div>
                  <div className="mt-0.5 space-y-0.5 text-[10px] leading-[1.6] text-slate-600">
                    {hasValue(item.courses) && <p>主修课程：{item.courses}</p>}
                    {hasValue(item.gpaRank) && <p>GPA/排名：{item.gpaRank}</p>}
                    {hasValue(item.honors) && <p>在校荣誉：{item.honors}</p>}
                  </div>
                </TimelineItem>
              ))}
            </TimelineSection>
          )}

          {/* Work Experience */}
          {workExperience.length > 0 && (
            <TimelineSection title="工作经历" accent={accent}>
              {workExperience.map((item, i) => (
                <TimelineItem key={i} accent={accent} last={i === workExperience.length - 1}>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-800">
                      {[item.company, item.position].filter(hasValue).join(" · ")}
                    </span>
                    <TimeDate>{formatRange(item.startDate, item.endDate)}</TimeDate>
                  </div>
                  <div className="mt-0.5 space-y-0.5 text-[10px] leading-[1.6] text-slate-600">
                    {hasValue(item.content) && <p>工作内容：{item.content}</p>}
                    {hasValue(item.achievements) && <p>业绩成果：{item.achievements}</p>}
                    {hasValue(item.management) && <p>管理经验：{item.management}</p>}
                  </div>
                </TimelineItem>
              ))}
            </TimelineSection>
          )}

          {/* Internships */}
          {internships.length > 0 && (
            <TimelineSection title="实习经历" accent={accent}>
              {internships.map((item, i) => (
                <TimelineItem key={i} accent={accent} last={i === internships.length - 1}>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-800">
                      {[item.company, item.position].filter(hasValue).join(" · ")}
                    </span>
                    <TimeDate>{formatRange(item.startDate, item.endDate)}</TimeDate>
                  </div>
                  <div className="mt-0.5 space-y-0.5 text-[10px] leading-[1.6] text-slate-600">
                    {hasValue(item.content) && <p>工作内容：{item.content}</p>}
                    {hasValue(item.achievements) && <p>工作成果：{item.achievements}</p>}
                    {hasValue(item.modules) && <p>负责模块：{item.modules}</p>}
                  </div>
                </TimelineItem>
              ))}
            </TimelineSection>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <TimelineSection title="项目经历" accent={accent}>
              {projects.map((item, i) => (
                <TimelineItem key={i} accent={accent} last={i === projects.length - 1}>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-800">
                      {[item.name, item.role].filter(hasValue).join(" · ")}
                    </span>
                    <TimeDate>{formatRange(item.startDate, item.endDate)}</TimeDate>
                  </div>
                  <div className="mt-0.5 space-y-0.5 text-[10px] leading-[1.6] text-slate-600">
                    {hasValue(item.description) && <p>项目描述：{item.description}</p>}
                    {hasValue(item.responsibilities) && <p>个人职责：{item.responsibilities}</p>}
                    {hasValue(item.techStack) && <p>技术栈：{item.techStack}</p>}
                    {hasValue(item.outcomes) && <p>项目成果：{item.outcomes}</p>}
                  </div>
                </TimelineItem>
              ))}
            </TimelineSection>
          )}

          {/* Campus Experience */}
          {campusExperience.length > 0 && (
            <TimelineSection title="校园经历" accent={accent}>
              {campusExperience.map((item, i) => (
                <TimelineItem key={i} accent={accent} last={i === campusExperience.length - 1}>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-800">
                      {[item.organization, item.role].filter(hasValue).join(" · ")}
                    </span>
                    <TimeDate>{hasValue(item.time) ? item.time : ""}</TimeDate>
                  </div>
                  <div className="mt-0.5 space-y-0.5 text-[10px] leading-[1.6] text-slate-600">
                    {hasValue(item.responsibilities) && <p>负责工作：{item.responsibilities}</p>}
                    {hasValue(item.outcomes) && <p>活动成果：{item.outcomes}</p>}
                  </div>
                </TimelineItem>
              ))}
            </TimelineSection>
          )}

          {/* Awards */}
          {awards.length > 0 && (
            <TimelineSection title="获奖情况" accent={accent}>
              {awards.map((item, i) => (
                <TimelineItem key={i} accent={accent} last={i === awards.length - 1}>
                  <p className="text-[11px] leading-[1.6] text-slate-700">
                    {[item.date, item.name, item.level, item.issuer].filter(hasValue).join(" · ")}
                  </p>
                </TimelineItem>
              ))}
            </TimelineSection>
          )}

          {/* Optional modules */}
          {optionalList.length > 0 && (
            <TimelineSection title="附加信息" accent={accent}>
              {optionalList.map((item, i) => (
                <TimelineItem key={item.label} accent={accent} last={i === optionalList.length - 1}>
                  <p className="text-[10px] leading-[1.6] text-slate-700">
                    <span className="font-semibold text-slate-800">{item.label}：</span>
                    {item.value}
                  </p>
                </TimelineItem>
              ))}
            </TimelineSection>
          )}
        </section>
      </div>
    </div>
  );
}

/* ─── Sidebar heading ─── */
function SidebarHeading({ text, color }: { text: string; color: string }) {
  return (
    <h3
      className="text-[11px] font-bold tracking-[0.15em] uppercase"
      style={{ color: withOpacity(color, 0.88) }}
    >
      {text}
    </h3>
  );
}

/* ─── Timeline section ─── */
function TimelineSection({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2
        className="mb-1.5 border-b-2 pb-1 text-[12px] font-bold tracking-[0.1em]"
        style={{
          color: mixWithBlack(accent, 0.15),
          borderColor: accent,
        }}
      >
        {title}
      </h2>
      <div>{children}</div>
    </div>
  );
}

/* ─── Timeline item (dot + vertical line) ─── */
function TimelineItem({
  accent,
  last,
  children,
}: {
  accent: string;
  last: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative pl-4">
      {/* dot */}
      <span
        className="absolute left-0 top-[5px] h-[7px] w-[7px] rounded-full border-2"
        style={{ borderColor: accent, backgroundColor: "white" }}
      />
      {/* line */}
      {!last && (
        <span
          className="absolute left-[3px] top-[14px] w-px"
          style={{ backgroundColor: withOpacity(accent, 0.3), bottom: "-4px" }}
        />
      )}
      <div className="pb-2">{children}</div>
    </div>
  );
}

/* ─── Time date badge ─── */
function TimeDate({ children }: { children: React.ReactNode }) {
  return (
    <span className="shrink-0 text-[9px] font-medium text-slate-400">
      {children}
    </span>
  );
}
