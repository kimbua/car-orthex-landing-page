import { fetchCars } from '@/lib/api';
import ShowroomExperience from '@/components/ShowroomExperience';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let cars: Awaited<ReturnType<typeof fetchCars>> = [];
  let carsError = false;
  try {
    cars = await fetchCars();
  } catch {
    carsError = true;
  }

  return <ShowroomExperience cars={cars} carsError={carsError} />;
}
