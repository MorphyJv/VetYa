import DashboardPageShell from "@/components/DashboardPageShell";
import { getPlaces } from "./actions";
import ExploreClient from "./ExploreClient";

export default async function ExplorePage(props: { searchParams: Promise<{ type?: string }> }) {
    const searchParams = await props.searchParams;
    const currentType = searchParams.type || "all";
    const { data: places } = await getPlaces(currentType);

    return (
        <DashboardPageShell 
            title="Explorar Zonas Pet-Friendly 📍"
            subtitle="Descubre los mejores lugares para ir con tu mejor amigo."
        >
            <ExploreClient initialPlaces={places || []} currentType={currentType} />
        </DashboardPageShell>
    );
}
