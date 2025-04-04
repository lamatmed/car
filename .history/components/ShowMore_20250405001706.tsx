export async function getServerSideProps(context) {
  const params = {
    manufacturer: context.query.manufacturer || 'toyota',
    year: Number(context.query.year) || 2022,
    fuel: context.query.fuel || 'gas',
    limit: Number(context.query.limit) || 10,
    model: context.query.model || 'corolla',
  };

  const allCars = await fetchCars(params);

  return {
    props: { cars: allCars || [] }, // Return the fetched cars to be passed to the page
  };
}

export default function Home({ cars }) {
  // Render the fetched cars here
  return (
    <main>
      {/* Render your cars and other components here */}
    </main>
  );
}
