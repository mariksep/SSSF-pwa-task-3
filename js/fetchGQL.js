const fetchGraphql = async (query) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(query),
  };
  try {
    const response = await fetch("http://localhost:3000/graphql", options);
    const json = await response.json();
    return json.data;
  } catch (e) {
    console.log("fetchgraphql", e);
    return false;
  }
};

const getAnimals = async () => {
  const otherQuery = {
    query: `
            {
              animals  {
                id
                animalName
                species {
                  id 
                  speciesName
                  category {
                    id
                    categoryName
                  }
                }
              }
            }`,
  };
  const data = await fetchGraphql(otherQuery);
  return data.animals;
};

const addAnimal = async (animal) => {
  console.log("animal params", animal);
  const query = {
    query: `
            mutation VariableTest($animalName: String!, $species: ID!) {
              addAnimal(animalName: $animalName, species: $species){
                id
                animalName
                species {
                  id 
                  speciesName
                  category {
                    id
                    categoryName
                  }
                }
              }
            }`,
    variables: animal,
  };
  const data = await fetchGraphql(query);
  console.log("fetch data", data);
  return data.addAnimal;
};
