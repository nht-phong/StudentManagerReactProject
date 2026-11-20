# Bài tập lớn: Ứng dụng CRUD với React

## Mô tả và yêu cầu kỹ thuật

Xây dựng một ứng dụng web quản lý dữ liệu với đủ bốn thao tác **CRUD**: xem (Read), thêm (Create), sửa (Update), xóa (Delete). Chủ đề: **quản lý sự kiện câu lạc bộ**. Dữ liệu lưu qua API giả lập bằng json-server.

### Yêu cầu kỹ thuật

| Hạng mục | Yêu cầu |
| --- | --- |
| Công cụ | Vite, React, TypeScript, Tailwind CSS, React Router |
| Form và validate | Tự viết bằng useState, không dùng zod hay react-hook-form |
| Gọi API | axios, có một axios instance dùng chung với `baseURL` |
| API | json-server, file dữ liệu đặt trong `server/db.json`, chạy bằng lệnh `npm run api` |
| Cấu trúc | Code chia tối thiểu vào `components/`, `layouts/`, `pages/`, `services/`, `utils/`, `types/` |
| TypeScript | Mọi component có kiểu cho props; không dùng `any`; kiểu dữ liệu sự kiện và kiểu object lỗi của form khai báo trong `types/` |
| Chất lượng | Không có lỗi trong VS Code; `npm run build` thành công; Console không có cảnh báo |

### Dữ liệu mẫu

`server/db.json` có sẵn tối thiểu **8 bản ghi** sự kiện, dữ liệu tự soạn, hợp lý và đa dạng: có cả sự kiện đã diễn ra và sắp diễn ra, có cả hai hình thức trực tiếp và trực tuyến.

## Chủ đề: Quản lý sự kiện câu lạc bộ

| Trường | Kiểu nhập | Luật validate |
| --- | --- | --- |
| Tên sự kiện | Ô chữ | Bắt buộc, 5–100 ký tự |
| Ngày tổ chức | Ô ngày | Bắt buộc; khi **thêm mới** không được là ngày trong quá khứ |
| Giờ bắt đầu | Ô giờ | Bắt buộc |
| Giờ kết thúc | Ô giờ | Bắt buộc, phải **sau** giờ bắt đầu |
| Hình thức | Nút chọn | Trực tiếp hoặc Trực tuyến |
| Địa điểm | Ô chữ | Bắt buộc khi hình thức là Trực tiếp |
| Đường dẫn tham gia | Ô chữ | Bắt buộc và đúng định dạng URL khi hình thức là Trực tuyến |
| Số chỗ tối đa | Ô số | Số nguyên, từ 1 đến 500 |

Chức năng riêng:

- Danh sách chia hai nhóm "Sắp diễn ra" và "Đã diễn ra" theo ngày tổ chức so với hôm nay.
- Form chỉ hiện ô Địa điểm hoặc ô Đường dẫn tham gia tùy hình thức đang chọn.

## Yêu cầu chức năng chung

### A. Trang và điều hướng

- Layout chung gồm header (tên ứng dụng, menu) và footer cho mọi trang.
- Trang **Danh sách** hiển thị toàn bộ bản ghi.
- Trang **Chi tiết** hiển thị đầy đủ thông tin một bản ghi, đường dẫn có id (ví dụ `/su-kien/3`).
- Trang **Thêm mới** và trang **Chỉnh sửa** (ví dụ `/su-kien/3/sua`).
- Trang 404 cho đường dẫn không tồn tại; trang chi tiết hoặc chỉnh sửa của id không tồn tại cũng hiển thị thông báo không tìm thấy.
- Mục menu của trang đang mở được làm nổi bật.

### B. Form

- Thêm mới và chỉnh sửa dùng **chung một component form**.
- Form chỉnh sửa hiển thị sẵn dữ liệu hiện tại của bản ghi, lấy từ API.
- Mỗi ô có nhãn; ô có lỗi được làm nổi bật và có thông báo lỗi ngay bên dưới, bằng tiếng Việt.
- Tối thiểu một component ô nhập dùng lại (dạng `TextField`) cho nhiều ô.
- Lỗi hiển thị khi rời khỏi ô, không chỉ khi bấm gửi.

### C. Validate

- Đủ toàn bộ luật trong bảng ở phần Chủ đề.
- Toàn bộ luật nằm trong **một hàm validate** đặt ở `utils/` (nhận giá trị form, trả về object lỗi), dùng chung cho thêm mới và chỉnh sửa (riêng luật ngày tổ chức không ở quá khứ chỉ áp dụng khi thêm mới).
- Ô số nhận đúng kiểu số; để trống hoặc nhập sai đều có thông báo phù hợp.
- Không gửi được form khi còn lỗi.

### D. Làm việc với API

- Toàn bộ lời gọi API nằm trong `services/`; component không gọi axios trực tiếp.
- Danh sách: `GET` toàn bộ bản ghi.
- Chi tiết và chỉnh sửa: `GET` một bản ghi theo id.
- Thêm mới: `POST`; thành công thì chuyển về trang danh sách hoặc chi tiết.
- Chỉnh sửa: `PUT` hoặc `PATCH`; thành công thì chuyển về trang chi tiết.
- Xóa: `DELETE`, có hỏi xác nhận kèm tên bản ghi; thực hiện được từ trang danh sách hoặc trang chi tiết.
- Dữ liệu thay đổi được lưu lại trong `server/db.json`, tải lại trang vẫn còn.

### E. Trạng thái giao diện

- Trạng thái **đang tải** khi chờ API trả dữ liệu.
- Thông báo **lỗi** dễ hiểu khi API không phản hồi (thử bằng cách tắt json-server).
- Thông báo **danh sách trống** khi không có bản ghi hoặc không có kết quả lọc.
- Nút gửi bị khóa và đổi chữ trong lúc đang gửi, tránh gửi hai lần.
- Thông báo **thành công** sau khi thêm, sửa, xóa.
- Giao diện hiển thị tốt trên điện thoại và máy tính.

## Sử dụng AI, sản phẩm nộp và đánh giá

### Quy định sử dụng AI

- Được dùng AI (Gemini, ChatGPT...) để hỏi khái niệm, giải thích lỗi, gợi ý hướng làm và review code.
- Mọi dòng code nộp lên phải giải thích được. Phần nào không giải thích được khi vấn đáp thì không tính điểm phần đó.
- Ghi nhật ký sử dụng AI trong file `AI_LOG.md`: với mỗi lần hỏi quan trọng, ghi câu hỏi đã dùng, tóm tắt câu trả lời, và điều rút ra được hoặc đã sửa so với gợi ý của AI.

### Sản phẩm nộp

- Code dự án đưa lên Git (GitHub), nộp đường dẫn, không đưa `node_modules` lên.
- File `README.md`: cách cài đặt và chạy (cả `npm run dev` và `npm run api`), ảnh chụp màn hình trang danh sách, form có lỗi validate và giao diện trên điện thoại, **đường dẫn Google Drive tới video giới thiệu**.
- File `AI_LOG.md` như quy định ở trên.

### Video giới thiệu sản phẩm (bắt buộc)

- Thời lượng từ 3 đến 5 phút.
- Nội dung: giới thiệu ứng dụng, trình diễn đủ xem, thêm, sửa, xóa; minh họa form báo lỗi validate và các trạng thái đang tải, lỗi, danh sách trống; giới thiệu ngắn cấu trúc code.
- Đưa video lên Google Drive, mở quyền xem public, đặt đường dẫn trong `README.md`.
- **Không có video thì bài được tính là không nộp.**

### Thang điểm (10 điểm)

| Hạng mục | Nội dung đánh giá | Điểm |
| --- | --- | --- |
| A. Trang và điều hướng | Layout chung, đủ các trang, trang 404, menu nổi bật trang đang mở | 2.0 |
| B. Form | Dùng chung form thêm và sửa, hiển thị sẵn dữ liệu khi sửa, component ô nhập dùng lại, nhãn và thông báo lỗi rõ ràng | 1.5 |
| C. Validate | Đủ luật trong bảng, đặc biệt luật định dạng và luật so sánh hoặc phụ thuộc giữa các ô; hàm validate dùng chung | 2.0 |
| D. Làm việc với API | Đủ GET danh sách, GET theo id, POST, PUT/PATCH, DELETE; tầng services; dữ liệu được lưu | 2.5 |
| E. Trạng thái giao diện | Đang tải, lỗi, danh sách trống, khóa nút khi gửi, thông báo thành công, hiển thị tốt trên điện thoại | 1.0 |
| Chức năng riêng | Đủ các chức năng riêng đã nêu | 0.5 |
| Chất lượng code | TypeScript đúng, cấu trúc thư mục, build không lỗi, Console sạch | 0.5 |
| **Tổng** | | **10** |

### Điểm cộng (tối đa 1 điểm, tổng không quá 10)

- Phân trang danh sách bằng tham số của API (`_page`, `_per_page`).
- Tìm kiếm gửi lên API qua tham số truy vấn thay vì lọc trên trình duyệt.
- Hộp xác nhận xóa và thông báo thành công là component tự viết, không dùng `confirm()` và `alert()`.
- Thêm một loại dữ liệu thứ hai có quan hệ với dữ liệu chính (ví dụ danh sách người đăng ký tham gia mỗi sự kiện) với đủ thêm và xem danh sách.
