import axios from 'axios';
import { Drug } from '../models/Drug';
import { DrugReaction } from '../models/DrugReaction';

interface FDAResponse {
  results: {
    term: string;
    count: number;
  }[];
}

const getAdverseReactions = async (drugName: string, limit: number = 200): Promise<Drug> => {
  const baseURL = process.env.FDA_API_URL;
  const query = `count=patient.reaction.reactionmeddrapt.exact&search=patient.drug.openfda.brand_name:"${drugName}"+patient.drug.openfda.generic_name:"${drugName}"`;
  const url = `${baseURL}${query}&limit=${limit}`;

  const response = await axios.get<FDAResponse>(url);
  const results = response.data.results;

  const result: Drug = {
    drugName: drugName,
    reactions: results.map((item) => ({
      reactionName: item.term,
      total: item.count,
    }))
  }; 

  return result;
};

export default {
  getAdverseReactions,
};
