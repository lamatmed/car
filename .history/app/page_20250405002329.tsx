'use client';

import { useSearchParams } from 'next/navigation';
import { fetchCars } from '@utils';
import { useEffect, useState } from 'react';
import { fuels, yearsOfProduction } from '@constants';
import { CarCard, ShowMore, SearchBar, CustomFilter, Hero } from '@components';

export default function Home() {
  const [isClient, setIsClient] = useState(false); // pour vérifier si nous sommes côté client
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true); // Une fois le composant monté, on est côté client
  }, []);

  const fetchData = async (searchParams: URLSearchParams) => {
    setLoading(true);
    const params = {
      manufacturer: searchParams.get('manufacturer') || 'toyota',
      year: Number(searchParams.get('year')) || 2022,
      fuel: searchParams.get('fuel') || 'gas',
      limit: Number(searchParams.get('limit')) || 10,
      model: searchParams.get('model') || 'corolla',
    };

    console.log('Fetching cars with params:', params);

    try {
      const allCars = await fetchCars(params);
      setCars(allCars);
    } catch (error) {
      console.error('Failed to fetch cars:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) {
    return null; // Ne pas rendre le composant tant qu'il n'est pas côté client
  }

  const searchParams = useSearchParams();
  useEffect(() => {
    fetchData(searchParams);
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
