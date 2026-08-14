import { getDeals } from "../../../lib/deal-mismatch/getDeals";

export async function GET() {
  const data = await getDeals();
  return Response.json(data);
}
