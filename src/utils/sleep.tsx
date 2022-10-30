
const sleep = async (ms: number) => {
  return await new Promise(resolve => setTimeout(resolve, ms));
}


export default sleep;