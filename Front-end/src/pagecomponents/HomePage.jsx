import Navbar from "@/components/Navbar";

function HomePage() {
  return (
    <div className="bg-black">
      <nav>
        <Navbar />
      </nav>
      <main className="flex w-full justify-around flex-row">
        <div>hey</div>
        <div>bay</div>
      </main>
    </div>
  );
}

export default HomePage;
