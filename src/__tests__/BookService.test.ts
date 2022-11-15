import BookService from "services/BookService";

async function test() {
  BookService.newInstance().generateThumbnail("C:/Users/Lenovo/Downloads/spring微服务实战.epub")
}

test()
