import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-display text-6xl text-zari">४०४</p>
      <h1 className="mt-4 font-display text-2xl text-plum">हे पान सापडले नाही · Page not found</h1>
      <Link href="/" className="mt-8 inline-block rounded-full bg-plum px-6 py-3 font-semibold text-white">
        मुख्यपृष्ठ · Home
      </Link>
    </section>
  );
}
