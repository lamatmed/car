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

  // Récupérer les paramètres
  const manufacturer = searchParams.get('manufacturer') || '';
  const year = Number(searchParams.get('year')) || 2022;
  const fuel = searchParams.get('fuel') || '';
  const limit = Number(searchParams.get('limit')) || 10;
  const model = searchParams.get('model') || '';

  // Créer un objet avec les paramètres filtrés
  const params = new URLSearchParams();

  if (manufacturer) params.append('make', manufacturer);  // Ajoute 'make' si non vide
  if (year) params.append('year', year.toString());
  if (fuel) params.append('fuel_type', fuel);  // Ajoute 'fuel_type' si non vide
  if (limit) params.append('limit', limit.toString());
  if (model) params.append('model', model);  // Ajoute 'model' si non vide

  // Créer l'URL avec les paramètres dynamiques
  const url = `https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?${params.toString()}`;

  try {
    const allCars = await fetchCars(url);
    setCars(allCars);
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
  } finally {
    setLoading(false);
  }
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
