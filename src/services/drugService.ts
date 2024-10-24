import axios from 'axios';
import { Drug, Reaction } from '../models/drugModel';

interface FDAResponse {
  results: Reaction[];
}

const getAdverseReactions = async (drugName: string, limit: number = 100): Promise<Drug> => {
  const baseURL = process.env.FDA_API_URL;
  const query = `count=patient.reaction.reactionmeddrapt.exact&search=patient.drug.openfda.brand_name:"${drugName}"+patient.drug.openfda.generic_name:"${drugName}"`;
  const url = `${baseURL}${query}&limit=${limit}`;

  const response = await axios.get<FDAResponse>(url);
  const results: Reaction[] = response.data.results;

  return {
    name: drugName,
    reactions: results,
  };
};

export default {
  getAdverseReactions,
};
