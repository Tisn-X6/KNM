// File: script.js (Cập nhật 7 - Dùng tên model CHÍNH XÁC)

// Bước 1: Import thư viện GỐC
import { GoogleGenerativeAI } from "https://cdn.jsdelivr.net/npm/@google/generative-ai/+esm";

// #########################################################
// 1. Dán chuỗi mã hóa bạn vừa copy ở Bước 1 vào đây
const ENCODED_KEY = "QUl6YVN5Q1BPRV83SmtIaVU3bk41eXNDSDVFQ0VWVGw5N2ZOTmFN";

// 2. Dùng hàm atob() để giải mã nó thành key thật khi web chạy
const API_KEY = atob(ENCODED_KEY);
// PHẦN "TRAINING"
const SYSTEM_PROMPT = `
Bạn là museBOT. Bạn là một chuyên gia lịch sử Đà Nẵng, phục vụ cho bảo tàng
Đà Nẵng, chuyên tim kiểm thông tin từ các tài liệu nội bộ. Bạn hoạt dộng như một
hướng dẫn viên về lịch sử, dặc biệt là lịch sử thành phố Đà Nẵng, có khả năng
trả lời các câu hỏi phức tạp, cung cấp bối cảnh lịch sử đầy đủ và giải thích
các sự kiện quan trọng một cách chỉ tiết và dễ hiểu.

**GIỌNG ĐIỆU CHUNG:**
* Sử dụng ngôn ngữ chuyên nghiệp, lịch sự, nhưng vẫn thân thiện và tự nhiên.
* Hãy hành động như một chuyên gia đã biết sẵn thông tin. TUYỆT ĐỐI KHÔNG được nhắc đến các từ như "tài liệu nội bộ".
* **QUY TẮC TỰ NHIÊN 1 (CÂU DẪN):** Để làm cho cuộc trò chuyện tự nhiên, hãy bắt đầu câu trả lời bằng một câu dẫn dắt ngắn gọn, thân thiện.
* **QUY TẮC TỰ NHIÊN 2 (CHỐNG LẶP):** Bạn ** BẮT BUỘC PHẢI** thay đổi (vary) câu dẫn dắt. **TUYỆT ĐỐI KHÔNG** được dùng 1 câu dẫn dắt giống hệt nhau 2 lần liên tiếp.
* **VÍ DỤ VỀ CÁC CÂU DẪN TỐT:**
    * "Dạ vâng,"
    * "Dạ'"
    * "À, về [chủ đề] thì..."
    * "Tất nhiên rồi ạ,"
    * "Vâng, thông tin về [chủ đề] là..."
    * "Chắc chắn rồi ạ,"
    * "À, tôi hiểu ý bạn rồi. Về [chủ đề],..."
    * "Thông tin về [chủ đề] của bạn đây:"
    * (Hoặc đôi khi, chỉ cần trả lời thẳng nếu câu hỏi đơn giản)
* **KHÔNG** lặp lại lời chào ("Kính chào quý khách...") hoặc giới thiệu lại bản thân ở mỗi câu trả lời.

---

**QUY TRÌNH XỬ LÝ (NGHIÊM NGẶT NHẤT):**
**BƯỚC 0: XỬ LÝ XÃ GIAO (ƯU TIÊN CAO NHẤT)**
* **NẾU** người dùng nói những câu xã giao đơn giản (ví dụ: "chào bạn", "hello", "cảm ơn bạn", "tạm biệt"), hãy trả lời một cách lịch sự, tự nhiên VÀ **DỪNG LẠI**. **KHÔNG** thực hiện các bước 1, 2, 3.
* **VÍ DỤ XỬ LÝ:**
    * User: "chào bạn" -> Bot: "MuseBOT xin nghe ạ."
    * User: "cảm ơn bạn" -> Bot: "Dạ không có gì ạ! Quý khách có cần tôi hỗ trợ thêm gì không?"
    * User: "tạm biệt" hoặc "không" -> Bot: "Vâng ạ, hẹn gặp lại quý khách."

---

**(CHỈ THỰC HIỆN NẾU KHÔNG PHẢI LÀ CÂU XÃ GIAO)**

Tài liệu nội bộ [TÀI LIỆU NỘI BỘ] được chia thành 4 phần RÕ RỆT:
* [A. BẢO TÀNG ĐÀ NẴNG] (Gồm địa chỉ, giờ mở cửa, lịch sử tòa nhà, nội dung trưng bày, vị trí và ý nghĩa)
* [B. VĂN HÓA SA HUỲNH] (Gồm tổng quát, các hiện vật cụ thể như Rìu đá, Cuốc đá, Khuyên tai hai đầu thú văn hóa Sa Huỳnh, Mộ chum)
* [C. LỊCH SỬ ĐÀ NẴNG] (Gồm lịch sử hình thành, tên gọi, vai trò thương cảng và giới thiệu chung)
* [D. TÓM TẮT] (Chứa nội dung CÔ ĐỌNG, NGẮN GỌN của các phần trên)

**BƯỚC 1: PHÂN LOẠI CÂU HỎI (QUAN TRỌNG)**
* Bạn phải kiểm tra xem câu hỏi có chứa các từ khóa yêu cầu sự ngắn gọn như: **"tóm tắt", "ngắn gọn", "sơ lược", "tổng kết", "ý chính"** hay không.

**BƯỚC 2: TÌM KIẾM TRONG ĐÚNG PHẦN**
* **TRƯỜNG HỢP 1 (CÓ từ khóa tóm tắt):** Bạn PHẢI tìm kiếm thông tin trong **[D. TÓM TẮT]**.
    * Ví dụ: "Tóm tắt về mộ chum" -> Tìm mục D.3 trong [D].
    * Ví dụ: "Nói ngắn gọn về văn hóa Sa Huỳnh" -> Tìm mục Tổng quát trong [D].
* **TRƯỜNG HỢP 2 (KHÔNG CÓ từ khóa tóm tắt - Hỏi chi tiết):** Bạn **CHỈ** tìm kiếm trong các phần **[A], [B], hoặc [C]** tương ứng.
    * VÍ DỤ 1:** Nếu người dùng hỏi "Rìu đá là gì?" (hoặc "B.1"), bạn phải phân loại đây là [B. VĂN HÓA SA HUỲNH] và CHỈ tìm trong [PHẦN B].
    * VÍ DỤ 2:** Nếu người dùng hỏi "địa chỉ bảo tàng?", bạn phải phân loại đây là [A. BẢO TÀNG ĐÀ NẴNG] và CHỈ tìm trong [PHẦN A].
    * VÍ DỤ 3:** Nếu người dùng hỏi "Tên gọi Tourane có từ đâu?", bạn phải phân loại đây là [C. LỊCH SỬ ĐÀ NẴNG] và CHỈ tìm trong [PHẦN C].
* **TUYỆT ĐỐI KHÔNG** được lấy thông tin từ phần khác.

**BƯỚC 3: TRẢ LỜI**
* **NẾU TÌM THẤY** thông tin trong đúng phần, hãy trả lời câu hỏi đó một cách trực tiếp.
* **NẾU KHÔNG TÌM THẤY** (ví dụ: người dùng hỏi "khách sạn" hoặc một hiện vật không có trong [PHẦN B]), bạn **BẮT BUỘC** phải trả lời chính xác bằng câu sau: "Tôi không tìm thấy dữ liệu, tôi sẽ kết nối tới người thật."
* **TUYỆT ĐỐI KHÔNG** được dùng kiến thức chung của bản thân để trả lời. Mọi câu trả lời phải dựa trên [TÀI LIỆU NỘI BỘ].)
...
`;

    // Danh sách câu trả lời sẵn cho các nút gợi ý
const fastResponses = {
    "lịch sử tên gọi đà nẵng": "Dạ, tên gọi Đà Nẵng xuất phát từ tiếng Chăm cổ, có nghĩa là 'Sông lớn' hay 'Cửa sông lớn' đó bạn. Thời Pháp thuộc, thành phố còn có tên gọi là Tourane.",
    "tóm tắt văn hóa sa huỳnh": "Văn hóa Sa Huỳnh là một trong ba cái nôi văn minh thời đồ sắt tại Việt Nam. Cư dân ở đây có nền kinh tế đa dạng và đặc biệt nổi tiếng với nghề chế tác trang sức tinh xảo.",
    "thời gian tồn tại của văn hóa sa huỳnh?": "Dạ, văn hóa Sa Huỳnh được các nhà khoa học xác định tồn tại trong khoảng thời gian từ khoảng năm 1000 TCN đến cuối thế kỷ thứ 2 ạ.",
    "thông tin về khuyên tai hai đầu thú?": "Đây là loại trang sức vô cùng độc đáo với hai đầu thú chạm đối xứng. Nó không chỉ dùng làm đẹp mà còn là biểu tượng tín ngưỡng linh thiêng của cư dân Sa Huỳnh.",
    "giới thiệu về mộ chum": "Mộ chum là đặc trưng nổi bật nhất của văn hóa Sa Huỳnh. Người chết được táng trong các chum gốm lớn với nhiều hình dáng như hình trụ, hình trứng hay hình cầu."

};

// PHẦN "KIẾN THỨC NỘI BỘ"
const KNOWLEDGE_BASE = `
[A. BẢO TÀNG ĐÀ NẪNG]
-Địa chỉ: tọa lạc tại 42-44 Bạch Đằng và 31 Trần Phú
-Giờ mở cửa: 8h-17h hàng ngày
-Lịch sử Tòa nhà 42 Bạch Đằng
  Tòa nhà được coi là một "hiện vật lịch sử", được Pháp thiết kế theo phong cách tân cổ điển và khánh thành năm 1900.
  Ban đầu, đây là Tòa Đốc lý Tourane (nơi làm việc của Đốc lý Pháp).
  Trong suốt thế kỷ 20, tòa nhà liên tục thay đổi chức năng qua các biến động lịch sử:
  1945: Nơi làm việc của Thị trưởng (Chính phủ Trần Trọng Kim), sau đó là trụ sở Ủy ban nhân dân cách mạng.
  1947: Trở lại làm Tòa Đốc lý khi Pháp tái chiếm.
  1950: Chính thức trở thành Tòa Thị chính Đà Nẵng.
  1975: Trở thành Trung tâm hành chính của chính quyền cách mạng.
  Cuối năm 2016, tòa nhà được quyết định chuyển đổi công năng thành Bảo tàng Đà Nẵng.
-Nội dung Trưng bày của Bảo tàng
  Bảo tàng trưng bày gần 3.000 tài liệu, hiện vật được chọn lọc từ tổng số 27.000.
  Việc trưng bày kết hợp giữa phong cách truyền thống và công nghệ hiện đại (như phim 3D Mapping, phim 3D) để tăng tính tương tác.
  Nội dung được chia thành 9 chủ đề lớn, bao gồm: Thiên nhiên và con người Đà Nẵng, Lịch sử Đô thị, Cuộc đấu tranh bảo vệ độc lập, Chứng tích chiến tranh, Hội nhập phát triển, Đa dạng văn hóa, và lịch sử Tòa thị chính...
-Vị trí và Ý nghĩa
  Bảo tàng có vị trí giao thông thuận tiện trên ba mặt đường (Bạch Đằng, Quang Trung, Trần Phú), bên bờ sông Hàn.
  Công trình được xem là biểu tượng kết nối giữa quá khứ và hiện tại, hứa hẹn trở thành điểm nhấn kiến trúc, lịch sử – văn hóa độc đáo của thành phố.


[B. VĂN HÓA SA HUỲNH]
Tổng quát: 
  Văn hóa Sa Huỳnh là nền văn hóa được xác định ở vào khoảng năm 1000 TCN đến cuối thế kỷ thứ 2. Văn hóa Sa Huỳnh được coi là một trong ba cái nôi cổ xưa về văn minh trên lãnh thổ Việt Nam, cùng với Văn hóa Đông Sơn và Văn hóa Óc Eo tạo thành tam giác văn hóa của Việt Nam thời kỳ đồ sắt.
  Chủ nhân văn hóa Sa Huỳnh có nền kinh tế đa thành phần, gồm trồng trọt trên nương rẫy và khai thác sản phẩm rừng núi, trồng lúa ở đồng bằng, phát triển các nghề thủ công, đánh bắt cá ven biển và trao đổi buôn bán với những tộc người trong khu vực Đông Nam Á và xa hơn, với Trung Quốc và Ấn Độ Ở nền văn hóa này, 
  theo nhà nghiên cứu Lâm Thị Mỹ Dung trong “Phát hiện và nghiên cứu văn hóa Sa Huỳnh (1909 – 2019)”, thì nghề chế tác đồ trang sức bằng đá và thủy tinh là nghề thủ công quan trọng của người Sa Huỳnh. Họ “có năng khiếu, khéo tay, và mỹ cảm cao; Họ ưa thích dùng đồ trang sức (vòng, nhẫn, khuyên tai, vật đeo hình dấu phảy, hạt chuỗi…) bằng thuỷ tinh, mã não, đá quý, đá hay đất nung”.

  B.1: Rìu đá, cuốc đá
  Đây là những công cụ lao động sản xuất bằng đá được tìm thấy tại di chỉ khảo cổ học Bàu Trám, huyện Núi Thành, tỉnh Quảng Nam vào năm 1979.
  Các bằng chứng khảo cổ học tìm thấy tại di chỉ này cho thấy đây là một khu cư trú cổ đồng thời là khu mộ táng, thuộc giai đoạn trung kỳ đồng thau, cách ngày nay khoảng 3000 năm. Tại di chỉ này tìm thấy nhiều hiện vật bằng đá như rìu, cuốc, mũi khoan, bàn mài, bàn nghiền.
  Rìu đá và cuốc đá ở đây ngoài chất liệu từ cuội còn có chất liệu từ đá gốc.
  Rìu đá và cuốc đá là những công cụ lao động phổ biến của con người thời văn hóa Sa Huỳnh, được chế tác từ đá thông qua các kỹ thuật mài giũa. Những công cụ này phản ánh trình độ kỹ thuật, đời sống nông nghiệp và sự phát triển của xã hội Sa Huỳnh cách đây khoảng 3.000 năm.
  Rìu đá thường được ghè đẽo và mài nhẵn, có lưỡi sắc và thân dày, được sử dụng chủ yếu để chặt cây, phát rừng, làm nhà hoặc chế tác đồ dùng. Một số rìu có hình chữ nhật hoặc hình thang, lưỡi được mài kỹ, cho thấy trình độ kỹ thuật cao và sự khéo léo của người Sa Huỳnh trong việc chọn lựa, xử lý nguyên liệu.
  Cuốc đá có hình dáng tương tự rìu nhưng phần lưỡi rộng và hơi cong, phù hợp với động tác đào xới đất, phản ánh rõ nét hoạt động sản xuất nông nghiệp sơ khai của cư dân thời bấy giờ. Việc phát hiện cuốc đá tại Bàu Tràm cho thấy người cổ đã biết khai thác và canh tác đất đai, bước đầu hình thành nền nông nghiệp định cư. 

B.2: Khuyên tai hai đầu thú văn hoá Sa Huỳnh
  Hiện nay, Bảo tàng Đà Nẵng đang lưu giữ và trưng bày một số hiện vật của cư dân văn hóa Sa Huỳnh khai quật tại các di chỉ khảo cổ học như: Vườn Đình Khuê Bắc, Nam Thổ Sơn (Đà Nẵng) hay Tam Mỹ, Đại Lộc (Quảng Nam)… Trong đó có khuyên tai hai đầu thú – những chiếc khuyên tai dài, có móc đeo nhô cao ở giữa, hai chiếc đầu thú có sừng chạm đối xứng ở hai bên làm bằng đá hoặc thủy tinh. Theo Tạ Đức (Nguồn gốc và sự phát triển của kiến trúc, biểu tượng và ngôn ngữ Đông Sơn) tư liệu dân tộc học cho biết, một hiện tượng khá phổ biến trong văn hóa nhiều tộc người ở Việt Nam và Đông Nam Á, đó là hình tượng đầu trâu – sừng trâu thường được gắn bó hòa hợp với hình tượng con chim trong các kiến trúc hay trong những biểu tượng và quan niệm tín ngưỡng về cái chết, người chết. Con trâu là biểu tượng về sự cân bằng và hòa hợp âm dương, sức khỏe và sự dũng mãnh của đàn ông, cho sự giàu sang của người sống đồng thời là con vật có thể đưa người chết về với tổ tiên. Con chim – hay được thể hiện bằng đường xoáy ốc, là biểu tượng sự vận động của vũ trụ, liên tục và có chu kỳ, đồng thời là biểu tượng của sự phồn thực gắn với phụ nữ. Con chim còn gắn với hình tượng chiếc thuyền đưa người chết sang thế giới bên kia… Và khá nhiều ý kiến khác, cho đến nay các nhà nghiên cứu vẫn chưa nhất trí hoàn toàn với nhau đây là con thú gì, vì chưa có ý kiến nào đủ sức thuyết phục nên nó vẫn được gọi là khuyên tai “hai đầu thú”.
  Nhìn chung, dù là gì thì mọi người đều thừa nhận đây là một con vật linh thiêng, biểu tượng tín ngưỡng của chủ nhân loại trang sức này.
  Có thể nói trang sức với cư dân văn hóa Sa Huỳnh không chỉ dùng để làm đẹp mà còn thể hiện sự giàu có, thể hiện địa vị xã hội, tuân theo phong tục và tín ngưỡng. Với ý nghĩa đó họ đã kỳ công sáng tạo ra những món đồ trang sức tinh xảo và mang tính nghệ thuật cao để lại một di sản vô cùng có giá trị. Đồng thời đây còn là những bằng chứng vô cùng quan trọng để các nhà khảo cổ học, các nhà nghiên cứu khẳng định vùng đất Quảng Nam – Đà Nẵng là một trong những nơi cư trú của cư dân Sa Huỳnh cũng như trình độ chế tác khá cao của họ nhất là đồ trang sức thời bấy giờ.

B.3: Mộ chum
  Chiếc mộ chum Tam Mỹ tại Bảo tàng Đà Nẵng có kích thước lớn, hình trụ, chiều cao 80cm, đường kính miệng 59cm. Chum làm bằng đất sét pha cát hạt mịn màu đỏ nhạt, kỹ thuật chế tác khá tinh xảo được làm bằng bàn xoay, tạo cho xương gốm có độ mỏng đều. Dáng chum cân xứng và đẹp, vai hơi phình, cổ thắt, miệng loe tạo thành một đường gấp khúc từ vai-cổ-miệng. Nắp chum hình nón cụt đáy bằng đậy vừa khít miệng chum. Mộ chum được tìm thấy ở Tam Mỹ thuộc giai đoạn sớm của thời đại sắt ở nước ta, niên đại khoảng 2.300 đến 2.500 năm cách ngày nay.
  Năm 1909, nhà khảo cổ học người Pháp M. Vinet lần đầu phát hiện ở Sa Huỳnh (huyện Đức Phổ, tỉnh Quảng Ngãi) có khoảng 200 mộ chum. Di tích khảo cổ đó được gọi là Dépot à Jarres Sa Huỳnh (nghĩa là kho chum Sa Huỳnh). Qua hơn 100 năm được khai quật và nghiên cứu, mộ chum - điểm nhấn của nền văn hóa Sa Huỳnh - được các nhà khảo cổ xác định niên đại từ 2.000 đến 3.000 năm được phân bố rộng, tập trung chủ yếu ở miền Trung Việt Nam. Có thể nói, hình thức mai táng người chết bằng mộ chum là một đặc trưng của văn hóa Sa Huỳnh và mộ chum là hiện vật độc đáo nhất của nền văn hóa này.
  Mộ chum Sa Huỳnh đa dạng về kích thước và kiểu dáng như mộ chum hình trụ, chum hình trứng, chum có hình dáng trung gian giữa hình trụ và hình trứng, chum hình cầu,… Chum thường có nắp hình nón cụt đáy bằng, loại gần hình chóp nón đáy gần nhọn, loại hình cầu đáy lòng chảo. 
  Từ những nghiên cứu về mộ chum Sa Huỳnh cho thấy cư dân văn hóa Sa Huỳnh có nhiều hình thức mai táng: cải táng, hỏa táng, mộ táng trẻ em và mộ tượng trưng. Cho đến nay, gần như chưa xác định được cách mai táng duy nhất của người Sa Huỳnh. Họ có cả nguyên táng, tức là chôn người chết nguyên vẹn, có cả hỏa táng, tức là thiêu người chết rồi đưa tro hài vào chum, có cả cải táng. Đặc biệt, hình thức táng chung cho một số người mà hiện nay chưa xác định được những người được táng chung là vợ chồng, cha con và mẹ con, có thể nhận thấy điều ấy qua tuổi của các xương và tro hài khác nhau. 
  Trong chum chứa nhiều đồ tùy táng gồm các chất liệu đá, gốm, sắt, đá quý, thủy tinh rất đa dạng về loại hình: công cụ lao động, vũ khí, đồ dùng sinh hoạt, trang sức… Đặc trưng về di vật là sự phổ biến của công cụ lao động bằng sắt, đồ gốm tô màu trang trí nhiều đồ án hoa văn khắc vạch, đồ trang sức bằng đá ngọc, mã não, thủy tinh như vòng, hạt chuỗi, khuyên tai ba mấu, khuyên tai hai đầu thú…
  Như vậy, qua đồ tùy táng và cách thức mai táng cho thấy người Sa Huỳnh rõ ràng là đã có một tổ chức xã hội quy củ và có một tập tục đã xác định có tính truyền thống với tín ngưỡng hướng về thế giới bên kia. Những mộ chum được làm cẩn thận chứng tỏ thái độ kính trọng và tiếc thương với người đã khuất. Những đồ tùy táng đẹp cho thấy sự ưu ái dành cho người chết, hoặc giả đó là những của cải của người chết mà người sống vẫn chôn theo, để về thế giới bên kia họ có đồ dùng, của cải để sử dụng.
  Mộ chum Tam Mỹ đang được trưng bày tại đây là một trong những mộ chum đầu tiên được tìm thấy tại Quảng Nam - Đà Nẵng, khai quật tại di chỉ Tam Mỹ (Núi Thành, Quảng Nam) năm 1976.
  Mộ chum Tabhing được khai quật năm 1986 tại thôn Tabhing (huyện Nam Giang, tỉnh Quảng Nam).


[C. LỊCH SỬ ĐÀ NẴNG]
C.1: Lịch sử hình thành
-Nguồn gốc & tên gọi
  Đà Nẵng: Xuất phát từ tiếng Chăm, nghĩa là sông lớn.
  Hàn: Tên gọi dân gian, bắt nguồn từ “Hành cảng” (người Hoa) hoặc “Darak/Danak” (người Chăm).
  Tourane: Tên do thực dân Pháp đặt khi chiếm đóng (1860–1945).
C.2: Giới thiệu
-Đà Nẵng là một trong những thành phố hiện đại và đáng sống nhất Việt Nam, nằm ở ven biển miền Trung. Đây là một trung tâm du lịch lớn, nổi tiếng với: 
"Thành phố của những cây cầu": Biểu tượng là Cầu Rồng (phun lửa/nước cuối tuần) và Cầu Sông Hàn (cầu quay duy nhất).
-Các đểm đến đa dạng:
  Bãi biển Mỹ Khê: Một trong những bãi biển đẹp nhất hành tinh.
  Sun World Ba Na Hills: Nổi tiếng với Cầu Vàng (đôi bàn tay nâng đỡ) và khí hậu mát mẻ.
  Danh thắng Ngũ Hành Sơn: Quần thể núi đá vôi với nhiều hang động và chùa chiền.
  Bán đảo Sơn Trà: Nơi có Chùa Linh Ứng với tượng Phật Quan Âm cao nhất Việt Nam.
-Ẩm thực đặc sắc: Không thể bỏ qua Mì Quảng và Bánh tráng cuốn thịt heo.
Đà Nẵng là sự kết hợp hoàn hảo giữa nhịp sống năng động, các bãi biển đẹp, núi non hùng vĩ và các công trình kiến trúc ấn tượng.

[D. TÓM TẮT]
Tổng quát
- Văn hóa Sa Huỳnh tồn tại từ khoảng 1000 TCN đến thế kỷ 2, là một trong ba trung tâm văn minh lớn thời đồ sắt của Việt Nam cùng với Đông Sơn và Óc Eo.
- Cư dân Sa Huỳnh có kinh tế đa dạng: làm nương rẫy, trồng lúa, khai thác rừng, đánh cá ven biển, buôn bán với Đông Nam Á, Trung Quốc và Ấn Độ.
- Nghề chế tác đồ trang sức bằng đá, mã não, thủy tinh đặc biệt phát triển, thể hiện kỹ thuật và mỹ thuật rất cao.
D.1: Rìu đá – Cuốc đá
- Tìm thấy tại di chỉ Bàu Trám (Quảng Nam) – nơi cư trú kiêm mộ táng, niên đại khoảng 3000 năm.
- Công cụ làm từ cuội và đá gốc, chế tác bằng kỹ thuật mài giũa tinh xảo.
- Rìu đá: dùng chặt cây, phát rừng, làm nhà.
- Cuốc đá: lưỡi rộng, cong, dùng để đào đất → cho thấy cư dân đã có nền nông nghiệp định cư sớm.
D.2: Khuyên tai hai đầu thú
- Trưng bày tại Bảo tàng Đà Nẵng, tìm thấy ở nhiều di chỉ Sa Huỳnh (Khuê Bắc, Thổ Sơn, Tam Mỹ…).
- Khuyên tai dài, có móc đeo ở giữa, hai đầu thú chạm đối xứng, làm bằng đá hoặc thủy tinh.
- Con thú chưa xác định, nhưng được xem là biểu tượng linh thiêng.
- Trang sức Sa Huỳnh thể hiện địa vị xã hội, tín ngưỡng, đồng thời chứng minh trình độ chế tác cao và mạng lưới cư trú rộng lớn từ Quảng Nam – Đà Nẵng.
D.3: Mộ chum
- Mộ chum Tam Mỹ cao 80cm, làm bằng đất sét pha cát, kỹ thuật bàn xoay tinh xảo, niên đại 2.300 – 2.500 năm.
- Mộ chum là đặc trưng nổi bật nhất của văn hóa Sa Huỳnh, phân bố chủ yếu ở miền Trung Việt Nam, được phát hiện từ năm 1909.
- Hình dạng đa dạng: hình trụ, hình trứng, hình cầu… có nắp hình nón cụt.
- Có nhiều hình thức mai táng: nguyên táng, hỏa táng, cải táng, táng trẻ em, táng chung.
- Trong chum thường có đồ tùy táng bằng đá, gốm, sắt, thủy tinh: công cụ, vũ khí, đồ trang sức…
- Điều này thể hiện tổ chức xã hội quy củ, tín ngưỡng về thế giới bên kia và sự trân trọng với người đã khuất.
- Mộ chum Tam Mỹ (1976) và mộ chum Tabhing (1986) là những phát hiện sớm và quan trọng tại khu vực Quảng Nam – Đà Nẵng.

`;

// #########################################################
// SỬA LỖI 404 BẰNG TÊN MODEL CHÍNH XÁC
// #########################################################

// Bước 2: Khởi tạo mô hình
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite", // <-- TÊN ĐÚNG 100% TỪ HÌNH ẢNH CỦA BẠN
    // Không dùng systemInstruction ở đây
});

// Bước 3: Lấy các phần tử trên trang web (Không đổi)
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const loadingIndicator = document.getElementById("loading");

// Danh sách các mẫu câu dẫn dắt ngẫu nhiên
const prefixTemplates = [
    "Dạ, về [key] thì: ",
    "Vâng, thông tin về [key] là: ",
    "Tất nhiên rồi ạ, về [key]: ",
    "Dạ, MuseBOT xin thông tin đến bạn về [key] như sau: ",
    "À, về [key] thì nội dung là: ",
    "Chắc chắn rồi, thông tin về [key] của bạn đây ạ: "
];

const apiPriorityKeywords = ["tóm tắt", "so sánh", "ý nghĩa", "chi tiết", "phân tích", "tại sao"];

// Bước 4: Xử lý khi người dùng nhấn nút "Gửi" (Không đổi)
async function handleUserInput() {
    const userPrompt = userInput.value.trim();
    if (!userPrompt) return;

    addMessageToChatbox(userPrompt, "user-message");
    userInput.value = "";

    // Chuyển về chữ thường để so khớp chính xác với Key trong fastResponses
    const lowerPrompt = userPrompt.toLowerCase();
    
    // --- BƯỚC 1: KIỂM TRA TRÙNG KHỚP CÂU HỎI GỢI Ý ---
    if (fastResponses[lowerPrompt]) {
        console.log("%c⚡ LOCAL: Trả lời từ câu hỏi gợi ý", "color: #ffca28; font-weight: bold;");
        loadingIndicator.classList.remove("hidden");
        
        setTimeout(() => {
            // Trả lời trực tiếp nội dung đã chuẩn bị sẵn
            addMessageToChatbox(fastResponses[lowerPrompt], "bot-message");
            loadingIndicator.classList.add("hidden");
        }, 500); // Tạo độ trễ nhẹ cho tự nhiên
        
        return; // Dừng lại, không gọi API Gemini
    }

    // --- BƯỚC 2: TẤT CẢ CÁC CÂU CÒN LẠI SẼ GỌI API GEMINI ---
    console.log("%c🤖 API: Câu hỏi tự do, đang kết nối Gemini...", "color: #42a5f5; font-weight: bold;");
    loadingIndicator.classList.remove("hidden");
    
    try {
        const fullPrompt = `
            [HƯỚNG DẪN HỆ THỐNG]
            ${SYSTEM_PROMPT}
            ---
            [TÀI LIỆU NỘI BỘ]
            ${KNOWLEDGE_BASE}
            ---
            [CÂU HỎI CỦA NGƯỜI DÙNG]
            "${userPrompt}"
        `;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        addMessageToChatbox(response.text(), "bot-message");

    } catch (error) {
        console.error("Lỗi API:", error);
        addMessageToChatbox("Dạ, MuseBOT gặp chút gián đoạn, bạn vui lòng thử lại sau nhé.", "bot-message");
    } finally {
        loadingIndicator.classList.add("hidden");
    }
}

// Hàm phụ để thêm tin nhắn vào khung chat (Không đổi)
function addMessageToChatbox(message, messageClass) {
    const p = document.createElement("p");
    p.textContent = message;
    p.className = messageClass;
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Thêm sự kiện (Không đổi)
sendButton.addEventListener("click", handleUserInput);
userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        handleUserInput();
    }
});

// ... (Giữ nguyên toàn bộ code cũ ở trên) ...

// ============================================================
// TÍNH NĂNG: GỢI Ý CÂU HỎI (SUGGESTION CHIPS)
// ============================================================

// 1. Danh sách các câu hỏi mẫu
const sampleQuestions = [
    "Lịch sử tên gọi Đà Nẵng",
    "Tóm tắt văn hóa Sa Huỳnh",
    "Thời gian tồn tại của văn hóa Sa Huỳnh?",
    "Thông tin về khuyên tai hai đầu thú?",
    "Giới thiệu về Mộ chum"
];

// 2. Hàm tạo nút gợi ý
function createSuggestionChips() {
    const suggestionArea = document.getElementById('suggestion-area');
    
    // Xóa nội dung cũ (nếu có)
    suggestionArea.innerHTML = '';

    sampleQuestions.forEach(question => {
        const btn = document.createElement('button');
        btn.textContent = question;
        btn.className = 'suggestion-chip';
        
        // Khi bấm vào nút
        btn.onclick = () => {
            // 1. Điền câu hỏi vào ô nhập
            const userInput = document.getElementById('user-input');
            userInput.value = question;
            
            // 2. Tự động bấm nút Gửi luôn
            handleUserInput();
        };
        
        suggestionArea.appendChild(btn);
    });

    setTimeout(() => {
        const chatBox = document.getElementById('chat-box');
        if (chatBox) {
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }, 100)
}

// 3. Chạy hàm tạo nút ngay khi web tải xong
document.addEventListener('DOMContentLoaded', createSuggestionChips);