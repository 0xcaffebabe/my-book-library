import IndexService from "../services/IndexService";

async function main() {
  await IndexService.newInstance().index()
}

main()
