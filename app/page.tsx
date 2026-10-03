import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-gray-100 px-6">
      <SignedIn>
        <div className="absolute right-6 top-6">
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>

      <section className="w-full max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          10分钟打造你的专业简历
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          面向求职者的一站式简历工作台，快速编辑、实时预览、随时导出。
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="inline-flex items-center justify-center rounded-full bg-gray-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-gray-700">
                登录
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-8 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50">
                注册账户
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link
              href="/builder"
              className="inline-flex items-center justify-center rounded-full bg-gray-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-gray-700"
            >
              进入工作台
            </Link>
          </SignedIn>
        </div>
      </section>
    </main>
  );
}
