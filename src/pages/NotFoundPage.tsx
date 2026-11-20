import NotFoundMessage from '../components/NotFoundMessage';

export default function NotFoundPage() {
  return (
    <NotFoundMessage
      title="Không tìm thấy trang"
      description="Trang bạn tìm không tồn tại. Có thể đường dẫn đã thay đổi hoặc bị gõ sai."
    />
  );
}
