import BlogCard from "./BlogCard";

export default function Blog() {
  const blogs = [
    {
      title:
        "Learning Guitar Online? Make Sure Your Lessons are World Class | Guest Post",
      description:
        "Are you keen to learn a new skill in your spare time? Has the idea of playing the guitar always appealed to you? Have you thought about learning guitar online? If so, we're sure you'll want to get the most out of your online classes from the offset. Fortunately, learning remotely has never been easier for beginners – and we're here to help you maximize your chances of success with this instrument.",
      image:
        "https://cdn.shopify.com/s/files/1/0557/0556/7432/articles/musical_instruments_mix_2_1200x.jpg",
      author: "Maria",
      date: "Jul 03, 2020",
    },
    {
      title: "What is the Best Instrument to Learn? | Normans Blog",
      description:
        "This is arguably the most important. If you're quite a shy character, the drums may not be the best instrument to learn. However, if you love to be centre of attention, then go for it! Learn something that interests you and that you've always wished you could play, not matter how hard it is. For example, if you have always watched someone growing up and always dreamed that you could play the electric guitar like them but think it's too hard, try it anyway! They will all be hard to start off with (otherwise everyone would do it), but it will be worth it in the end when you can play finally Eruption by Van Halen. Careless whisper?",
      image:
        "https://cdn.shopify.com/s/files/1/0557/0556/7432/articles/trumpet-facts_88be0d82-b6a7-4ffb-ace0-01c85aa3a7c7_600x.jpg?v=1620939545",
      author: "Nick Walker",
      date: "Aug 26, 2020",
    },
    {
      title: "Cornet vs Trumpet - What's the Difference? | Normans Blog",
      description:
        "Before we look at the difference, let’s first cover the basic elements of their design that are identical. Firstly, and most obviously, they are both made of the same material, Brass, have 3 valves and the sound is produced on both by ‘buzzing’ your lips. The tubing is also of an identical length (4 1/2 ft approx without valves depressed), although it is wound much tighter on a Cornet giving the initial appearance that it is shorter. As they are both the same length they therefore also play at the same pitch which is Bb on standard models.",
      image:
        "https://cdn.shopify.com/s/files/1/0557/0556/7432/articles/VIOLIN-FAQS-FEATURE_5e7b4b0c-6418-434f-94d5-3dca42c62047_600x.jpg?v=1620399722",
      author: "Maria",
      date: "Oct 24, 2020",
    },
  ];
  return (
    <div className="container py-4">
      <h2 className="text-center text-3xl font-semibold border-t border-b py-2 my-5">
        Blog
      </h2>
      <div className="grid grid-cols-12 gap-6">
        {blogs.map((blog) => (
          <BlogCard key={blog.title} blog={blog} />
        ))}
      </div>
    </div>
  );
}
