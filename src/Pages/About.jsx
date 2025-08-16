import React from "react";

const About = () => {
  return (
    <section className="bg-base-100 text-text py-16 max-w-11/12 min-w-sm mx-auto">
      {/* Heading */}
      <h1 className="text-5xl font-extrabold text-center mb-10">
        About PlateShare
      </h1>

      {/* Intro */}
      <p className="text-lg text-center max-w-3xl mx-auto mb-12 leading-relaxed">
        PlateShare is a community-driven platform built to fight food waste and
        hunger. We connect restaurants with surplus food to local charities and
        organizations that can share it with people in need. By bridging the gap
        between excess and necessity, we aim to create a sustainable cycle of
        sharing, compassion, and impact.
      </p>

      {/* Info Grid */}
      <section className="grid md:grid-cols-3 gap-8 text-center">
        <article className="bg-white shadow-md p-6 rounded-2xl hover:shadow-xl transition">
          <h2 className="text-xl font-bold mb-3 text-blue-600">Our Mission</h2>
          <p className="text-gray-600">
            To reduce food waste and support communities by redistributing
            surplus food to people who need it most. Every plate shared is a
            step toward a more caring world.
          </p>
        </article>

        <article className="bg-white shadow-md p-6 rounded-2xl hover:shadow-xl transition">
          <h2 className="text-xl font-bold mb-3 text-green-600">How It Works</h2>
          <p className="text-gray-600">
            Restaurants and food providers list donations on PlateShare. Charities
            can request these donations, and our platform ensures fair
            distribution so no food goes to waste.
          </p>
        </article>

        <article className="bg-white shadow-md p-6 rounded-2xl hover:shadow-xl transition">
          <h2 className="text-xl font-bold mb-3 text-orange-600">Our Values</h2>
          <p className="text-gray-600">
            Sustainability, community, and compassion guide everything we do.
            PlateShare isn't just a platform—it's a movement to inspire positive
            change in society.
          </p>
        </article>
      </section>

      {/* Call to Action */}
      <section className="text-center mt-16">
        <h3 className="text-2xl font-bold mb-4">Join the Movement</h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Whether you're a restaurant, charity, or an individual supporter,
          there's a role for you at PlateShare. Together, we can make a
          difference—one plate at a time.
        </p>
        <a
          href="/dashboard"
          className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/70 transition"
        >
          Get Involved
        </a>
      </section>
    </section>
  );
};

export default About;
