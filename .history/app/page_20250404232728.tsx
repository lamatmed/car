'use client';

import { useSearchParams } from 'next/navigation';
import { fetchCars } from '@utils';
import { useEffect, useState } from 'react';
import { fuels, yearsOfProduction } from '@constants';
import { CarCard, ShowMore, SearchBar, CustomFilter, Hero } from '@components';

export default  function Home() {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const params = {
      manufacturer: searchParams.get('manufacturer') || '',
      year: Number(searchParams.get('year')) || 2022,
      fuel: searchParams.get('fuel') || '',
      limit: Number(searchParams.get('limit')) || 10,
      model: searchParams.get('model') || '',
    };
    console.log('Fetching cars with params:', params);
    const allCars = await fetchCars(params);
    setCars(allCars);
    setLoading(false);
  };
  

  useEffect(() => {
    fetchData();
  }, [searchParams.toString()]);

  const isDataEmpty = !Array.isArray(cars) || cars.length < 1 || !cars;

  return (
    <main className="overflow-hidden">
      <Hero />
      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Car Catalogue</h1>
          <p>Explore our cars you might like</p>
        </div>

        <div className="home__filters">
          <SearchBar />
          <div className="home__filter-container">
            <CustomFilter title="fuel" options={fuels} />
            <CustomFilter title="year" options={yearsOfProduction} />
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : !isDataEmpty ? (
          <section>
            <div className="home__cars-wrapper">
              {cars.map((car, index) => (
                <CarCard key={index} car={car} />
              ))}
            </div>
            <ShowMore
              pageNumber={(Number(searchParams.get('limit')) || 10) / 10}
              isNext={(Number(searchParams.get('limit')) || 10) > cars.length}
            />
          </section>
        ) : (
          <div className="home__error-container">
            <h2 className="text-black text-xl font-bold">Oops, no results</h2>
            <p>{(cars as any)?.message}</p>
          </div>
        )}
      </div>
    </main>
  );
}
