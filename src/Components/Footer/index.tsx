import { BASE_URL } from "@/utils/constants";

export default function Footer() {
  return (
    <footer className=" w-full gap-10 text-center">
      <section>
        <h1 className="font-extrabold leading-normal text-gray-700 ">
          Made with <span className="text-purple-300">❤️ By </span>{" "}
          <a href="https://github.com/robokishan">
            <span className="underline">Kishan Joshi</span>
          </a>
        </h1>
      </section>
      <section className="mt-5">
        <a href={`${BASE_URL}/privacy`} className="underline">
          Privacy Policy
        </a>
        {` - `}
        <a href={`${BASE_URL}/terms`} className="underline">
          Terms and condition
        </a>
      </section>
    </footer>
  );
}
