import { getDeals } from "../../lib/deal-mismatch/getDeals";
import Dashboard from "./Dashboard";

export const revalidate = 300; // re-check the Sheet every 5 minutes

export default async function Page() {
  const data = await getDeals();
  return <Dashboard initialDeals={data.deals} initialUnscored={data.unscored} source={data.source} fetchedAt={data.fetchedAt} fetchError={data.fetchError} />;
}
