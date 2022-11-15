
import com.aspose.pdf.Document;
import com.aspose.pdf.Page;
import com.aspose.pdf.devices.JpegDevice;
import com.aspose.pdf.devices.Resolution;
import com.aspose.words.License;
import java.io.*;

public class PDFUtils {

  private static String xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n" +
      "<License>\n" +
      "    <Data>\n" +
      "        <Products>\n" +
      "            <Product>Aspose.Total for Java</Product>\n" +
      "            <Product>Aspose.Words for Java</Product>\n" +
      "        </Products>\n" +
      "        <EditionType>Enterprise</EditionType>\n" +
      "        <SubscriptionExpiry>20991231</SubscriptionExpiry>\n" +
      "        <LicenseExpiry>20991231</LicenseExpiry>\n" +
      "        <SerialNumber>8bfe198c-7f0c-4ef8-8ff0-acc3237bf0d7</SerialNumber>\n" +
      "    </Data>\n" +
      "    <Signature>sNLLKGMUdF0r8O1kKilWAGdgfs2BvJb/2Xp8p5iuDVfZXmhppo+d0Ran1P9TKdjV4ABwAgKXxJ3jcQTqE/2IRfqwnPf8itN8aFZlV3TJPYeD3yWE7IT55Gz6EijUpC7aKeoohTb4w2fpox58wWoF3SNp6sK6jDfiAUGEHYJ9pjU=</Signature>\n"
      +
      "</License>";

  public static void main(String[] arg) throws Exception {
    String pdfFile = arg[0];
    String targetFile = arg[1];
    System.out.println(pdfFile + targetFile);
    ByteArrayInputStream is = new ByteArrayInputStream(xml.getBytes());
    License aposeLic = new License();
    aposeLic.setLicense(is);
    createPDFThumbnail(pdfFile, targetFile);
  }

  private static void createPDFThumbnail(String pdf, String img) throws FileNotFoundException {
    // 加载 PDF 文档
    Document doc = new Document(pdf);

    int pageIndex = 1;

    // 获取页面
    Page page = doc.getPages().get_Item(pageIndex);

    // 为图像创建文件流
    FileOutputStream imageStream = new FileOutputStream(img);

    // 创建分辨率对象
    Resolution resolution = new Resolution(300);

    // 创建一个 JpegDevice 实例并设置高度、宽度、分辨率和
    // 图像质量
    JpegDevice jpegDevice = new JpegDevice(200, 320, resolution, 100);

    // 转换页面并将图像保存到流
    jpegDevice.process(page, imageStream);

    // 关闭流
    try {
      imageStream.close();
    } catch (IOException e) {
      e.printStackTrace();
    } finally {
    }
  }
}
