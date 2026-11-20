import NotFoundMessage from '../components/NotFoundMessage';

export default function NotFoundPage() {
  return (
    <NotFoundMessage
      title="Page not found"
      description="The page you are looking for does not exist. It may have been moved, or the address is wrong."
    />
  );
}
