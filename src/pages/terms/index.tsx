import Footer from "../../Components/Footer";
import Header from "../../Components/Header";

export default function Terms() {
  return (
    <main className="container mx-auto p-4  text-lg text-gray-700">
      <Header />
      <h2 className=" gap-5 text-center text-4xl font-extrabold leading-normal ">
        <span>
          Terms
          <span className="text-purple-300">
            {` `}And{` `}
          </span>
          Condition
        </span>
        <hr className="my-3 h-px border-0 bg-gray-200 " />
      </h2>
      <section className="mt-5 pb-5">
        <p className="my-5">Last updated: January 05, 2023</p>
        <p>
          As a single developer this is just a hobby project. Use this at your
          own risk. I am not responsible for any loss. you can do whatever you
          want with this app.
        </p>
      </section>
      <Footer />
    </main>
  );
}
