import { getPlaces } from "./actions";
import ExploreClient from "./ExploreClient";

export default async function ExplorePage(props: { searchParams: Promise<{ type?: string }> }) {
    const searchParams = await props.searchParams;
    const currentType = searchParams.type || "all";
    const { data: places, error } = await getPlaces(currentType);

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--vy-neutral-900)]">Explorar Zonas Pet-Friendly 📍</h1>
                    <p className="mt-1 text-[var(--vy-neutral-500)] text-lg">Descubre los mejores lugares para ir con tu mejor amigo.</p>
                </div>
            </div>

            <ExploreClient initialPlaces={places || []} currentType={currentType} />
        </div>
    );
}
