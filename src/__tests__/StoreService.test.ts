import { DataType } from "../enums/DataType";
import StoreService from "../services/StoreService";

async function main() {
  StoreService.newInstance().saveData(DataType.BOOK_LIST, "test")
}

main()
